import mongoose, {Schema, Document, Types} from "mongoose";

export interface Message extends Document{
    _id: Types.ObjectId;
    content: string;
    createdAt: Date;
    isPublic: boolean;
    replyText?: string;
    replyCreatedAt?: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    replyText: {
        type: String,
        required: false
    },
    replyCreatedAt: {
        type: Date,
        required: false
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password?: string;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    provider?: string;
    themePreset?: string;
    avatarUrl?: string;
    profileViews: number;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: false
    },
    verifyCode: {
        type: String,
        required: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: false
    },
    provider: {
        type: String,
        default: 'credentials'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    themePreset: {
        type: String,
        default: 'dark'
    },
    avatarUrl: {
        type: String,
        required: false
    },
    profileViews: {
        type: Number,
        default: 0
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel
