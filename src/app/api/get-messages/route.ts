import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401}
        )
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '20')

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const pipeline: any[] = [
            { $match: {_id: userId}},
            { $unwind: '$messages'}
        ];

        if (cursor) {
            pipeline.push({
                $match: { 'messages.createdAt': { $lt: new Date(cursor) } }
            });
        }

        pipeline.push(
            {$sort: {'messages.createdAt': -1}},
            {$limit: limit},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        );

        const userAgg = await UserModel.aggregate(pipeline);

        if(!userAgg || userAgg.length === 0){
            // Return empty messages if user exists but has no messages matching
            return Response.json(
                {
                    success: true,
                    messages: [],
                    nextCursor: null
                },
                { status: 200}
            )
        }

        const messages = userAgg[0].messages;
        const nextCursor = messages.length === limit ? messages[messages.length - 1].createdAt : null;

        return Response.json(
            {
                success: true,
                messages: messages,
                nextCursor: nextCursor
            },
            { status: 200}
        )
    } catch (error) {
        // Error logging removed for security
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 500}
        )
    }    
}
