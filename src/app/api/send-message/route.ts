import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { Message } from "@/models/user.model"
import { messageSchemaValidation } from "@/SchemaValidations/user.validation";
import { z } from "zod";

export async function POST(req: Request) {
    await connectDB()

    try {
        const { username, content } = await req.json()

        const contentQuerySchema = {
            content
        }

        const result = messageSchemaValidation.safeParse(contentQuerySchema)
        if (!result.success) {
            const codeError = z.treeifyError(result.error)
            return Response.json({
                success: false,
                message: codeError.properties?.content?.errors || "Invalid Code Format"
            }, { status: 400 })
        }

        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            },
                {
                    status: 401
                })
        }

        const newMessage = { content: content, createdAt: new Date(Date.now()) }
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: 'Message Sent Successfully'
        },
            {
                status: 201
            })
    } catch (error) {
        console.error("Error While Adding Messages", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        },
            {
                status: 500
            })
    }
}