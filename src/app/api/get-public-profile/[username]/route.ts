import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request, {params}: {params: Promise<{username: string}>}) {
    const username = (await params).username
    await dbConnect()

    try {
        const users = await UserModel.aggregate([
            { $match: { username } },
            { $project: {
                themePreset: 1,
                avatarUrl: 1,
                isAcceptingMessage: 1,
                messages: {
                    $filter: {
                        input: "$messages",
                        as: "message",
                        cond: { $eq: ["$$message.isPublic", true] }
                    }
                }
            }}
        ])

        if (!users || users.length === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        }

        const user = users[0];
        
        // Increment profile views
        await UserModel.updateOne({ username }, { $inc: { profileViews: 1 } });
        
        // Sort messages by replyCreatedAt descending
        const publicMessages = user.messages.sort((a: any, b: any) => {
            const dateA = new Date(a.replyCreatedAt || a.createdAt).getTime();
            const dateB = new Date(b.replyCreatedAt || b.createdAt).getTime();
            return dateB - dateA;
        });

        return Response.json({ 
            success: true, 
            publicMessages,
            themePreset: user.themePreset,
            avatarUrl: user.avatarUrl,
            isAcceptingMessage: user.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        return Response.json({ success: false, message: "Error fetching profile" }, { status: 500 })
    }
}
