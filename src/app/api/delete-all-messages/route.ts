import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request) {
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

    const userId = user._id;

    try {
        const updateResult = await UserModel.updateOne(
            { _id: userId },
            { $set: { messages: [] } }
        )

        if(updateResult.modifiedCount == 0){
             return Response.json(
                {
                    success: false,
                    message: "No messages found to delete"
                },
                { status: 404}
            )
        }

        return Response.json(
            {
                success: true,
                message: "All messages have been cleared from your inbox."
            },
            { status: 200}
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error deleting all messages"
            },
            { status: 500}
        )
    }
}
