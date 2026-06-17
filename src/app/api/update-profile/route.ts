import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
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
        const { themePreset } = await request.json()
        
        if (!themePreset) {
            return Response.json(
                { success: false, message: "Theme preset is required" },
                { status: 400}
            )
        }

        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $set: { themePreset } }
        )

        return Response.json(
            { success: true, message: "Profile updated successfully!" },
            { status: 200}
        )
    } catch (error) {
        return Response.json(
            { success: false, message: "Error updating profile" },
            { status: 500}
        )
    }
}
