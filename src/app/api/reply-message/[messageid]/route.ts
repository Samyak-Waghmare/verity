import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request, {params}: {params: Promise<{messageid: string}>}){
    const messageId = (await params).messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 401}
        )
    }

    try {
        const { replyText } = await request.json()
        
        if (!replyText) {
            return Response.json(
                { success: false, message: "Reply text is required" },
                { status: 400}
            )
        }

        const updateResult = await UserModel.updateOne(
            { _id: user._id, "messages._id": messageId },
            { 
                $set: { 
                    "messages.$.replyText": replyText,
                    "messages.$.isPublic": true,
                    "messages.$.replyCreatedAt": new Date()
                } 
            }
        )

        if(updateResult.modifiedCount == 0){
            return Response.json(
                { success: false, message: "Message not found" },
                { status: 404}
            )
        }

        return Response.json(
            { success: true, message: "Reply posted publicly!" },
            { status: 200}
        )
    } catch (error) {
        return Response.json(
            { success: false, message: "Error replying to message" },
            { status: 500}
        )
    }
}
