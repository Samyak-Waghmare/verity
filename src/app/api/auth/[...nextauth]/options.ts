import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text " },
                password: { label: "Password", type: "password" },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this username')
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account first before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error('Incorrect Password')
                    }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Handle Google sign-in: auto-create user in MongoDB if not exists
            if (account?.provider === "google") {
                await dbConnect()
                try {
                    const existingUser = await UserModel.findOne({ email: user.email })

                    if (!existingUser) {
                        // Derive a unique username from the Google email
                        const baseUsername = user.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
                        let username = baseUsername
                        let count = 1

                        // Ensure username is unique
                        while (await UserModel.findOne({ username })) {
                            username = `${baseUsername}${count}`
                            count++
                        }

                        await UserModel.create({
                            email: user.email,
                            username,
                            isVerified: true,
                            isAcceptingMessage: true,
                            provider: 'google',
                            messages: []
                        })
                    } else if (existingUser.provider === 'credentials') {
                        // User registered via credentials — link their account by marking as verified
                        // but do not overwrite their existing data
                        return true
                    }

                    return true
                } catch (error) {
                    console.error("Error during Google sign-in:", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "google") {
                // Fetch the DB user for Google sign-ins to populate token fields
                await dbConnect()
                const dbUser = await UserModel.findOne({ email: token.email })
                if (dbUser) {
                    token._id = dbUser._id?.toString()
                    token.isVerified = dbUser.isVerified
                    token.isAcceptingMessages = dbUser.isAcceptingMessage
                    token.username = dbUser.username
                    token.provider = 'google'
                }
            } else if (user) {
                // For credentials provider, 'user' contains our custom DB user fields
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}