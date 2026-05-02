import { z } from "zod";
import { verifyCode } from "@/SchemaValidations/user.validation";
import { UserModel } from "@/models/user.model";
import { connectDB } from "@/lib/dbConnect";

export async function POST(request: Request) {
    await connectDB()
    try {
        const { username, code } = await request.json()
        console.log(username, code);

        const codeQuery = {
            code: code
        }

        const result = verifyCode.safeParse(codeQuery)

        if (!result.success) {
            const codeError = z.treeifyError(result.error)
            return Response.json({
                success: false,
                message: codeError.properties?.code?.errors || "Invalid Code Format"
            }, { status: 400 })
        }

        const user = await UserModel.findOne({
            username,
            verifyCode: result.data.code,
            verifyCodeExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return Response.json({
                success: false,
                message: 'Verification Token Expired'
            }, { status: 400 })
        }

        user.isVerified = true
        user.verifyCode=""
        await user.save()

        return Response.json({
            success: true,
            message: 'Account Verification Successful'
        }, { status: 201 })


    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            messsage: "Error Verifying Code"
        }, { status: 500 })
    }

}