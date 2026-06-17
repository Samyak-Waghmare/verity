import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User"
import Pusher from "pusher"
import { messageRateLimit } from "@/lib/rateLimit";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true
})

export async function POST(request: Request){
    // Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
        const { success } = await messageRateLimit.limit(ip);
        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: "You are sending messages too fast. Please wait a minute."
                },
                { status: 429 }
            );
        }
    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open if Redis is down so app still works
    }

    await dbConnect()

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404}
            )
        }

        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                { status: 403}
            )
        }

        const newMessage = {content, createdAt: new Date(), isPublic: false}
        user.messages.push(newMessage as Message)
        await user.save()

        const savedMessage = user.messages[user.messages.length - 1];

        try {
            await pusher.trigger(`user-${username}`, 'new-message', savedMessage);
        } catch (pusherError) {
            console.error("Pusher error:", pusherError);
        }

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status: 200}
        )
    } catch (error) {
        // Error logging removed for security
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500}
        )
    }

}
