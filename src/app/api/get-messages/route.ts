import { authOptions } from "../auth/[...nextauth]/option";
import { UserModel } from "@/models/user.model";
import { getServerSession, User } from "next-auth"
import { connectDB } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Session Unavailable. Please LoginIn First"
        },
            {
                status: 401
            })
    }
    const user: User = session?.user as User
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {
                $match: userId
            },
            {
                $unwind: '$message'
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: userId,
                    messages: { $push: '$message' }
                }
            }
        ])
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            },
                {
                    status: 401
                })
        }
        if (user.length === 0) {
            return Response.json({
                success: false,
                message: "User Doesn't Have Any Messages"
            },
                {
                    status: 401
                })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },
            {
                status: 201
            })
    } catch (error) {
        console.error("Error While Fetching Messages", error)
        return Response.json({
            success: false,
            message: "Error While Fetching Messages"
        },
            {
                status: 500
            })
    }
}