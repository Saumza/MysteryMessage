import { UserModel } from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/option";
import { getServerSession, User } from "next-auth";
import { connectDB } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { success } from "zod";


export async function DELETE(req: Request, { params }: { params: { messageId: string } }) {
    await connectDB()

    const { messageId } = params

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Session Unavailable. Please LoginIn First"
        },
            {
                status: 401
            })
    }
    try {
        const result = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageId } } }
        )

        if (result.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message Not Found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Message Successfully Deleted"
        }, {
            status: 201
        })
    } catch (error) {
        return Response.json({
            success: true,
            message: "Error Deleting Messages"
        }, {
            status: 201
        })
    }
}