import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    message: Message[]  // this means the array type will be the Message type
}


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    verifyCode: {
        type: String,
        required: [true, "Verification Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification Code Expiry is requried"]
    },
    isVerified: {
        type: Boolean,
        required: [true, "Is Verified is needed"],
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: [true, "Is Accepting Message is needed"],
        default: true
    },
    message: [messageSchema]
})

// here I am checking if the model is already created or we have to newly create it. Also have wrote the typescript for the following Code
export const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema)