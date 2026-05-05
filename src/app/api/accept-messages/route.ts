import { authOptions } from "../auth/[...nextauth]/option";
import { UserModel } from "@/models/user.model";
import { getServerSession, User } from "next-auth"
import { connectDB } from "@/lib/dbConnect";
import { z } from "zod";
import { acceptingMessageSchema } from "@/SchemaValidations/user.validation";


export async function POST(req: Request) {
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
    const userId = user._id

    try {
        const { acceptMessage } = await req.json()

        const acceptMessageSchemaQuery = {
            acceptMessage
        }

        const result = acceptingMessageSchema.safeParse(acceptMessageSchemaQuery)
        if (!result.success) {
            const codeError = z.treeifyError(result.error)
            return Response.json({
                success: false,
                message: codeError.properties?.acceptMessages?.errors || "Invalid Code Format"
            }, { status: 400 })
        }

        const updateUserMessageAcceptance = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessage
            },
            { new: true }
        )
        if (!updateUserMessageAcceptance) {
            return Response.json({
                success: false,
                message: "Updation failed for User's Message Acceptance Status"
            },
                {
                    status: 400
                })
        }
        return Response.json({
            success: true,
            message: "Successfully Updated User's Message Acceptance Status",
            isAcceptingMessages: updateUserMessageAcceptance.isAcceptingMessages
        },
            {
                status: 201
            })
    } catch (error) {
        console.error(`Failed to update user's message acceptance status: ${error}`)
        return Response.json({
            success: false,
            message: "Failed to update user's message acceptance status"
        },
            {
                status: 500
            })
    }
}

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
    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User Not Found"
            },
                {
                    status: 404
                })
        }
        return Response.json({
            success: true,
            message: "User Status Fetched Successfully",
            isAcceptingMessages: foundUser.isAcceptingMessages
        },
            {
                status: 201
            })
    } catch (error) {
        console.error(`Failed to fetch user's message acceptance status: ${error}`)
        return Response.json({
            success: false,
            message: "Failed to fetch user's message acceptance status"
        },
            {
                status: 500
            })
    }
}



