import { sendMail } from "@/helpers/sendMail"
import { connectDB } from "@/lib/dbConnect"
import { UserModel } from "@/models/user.model"
import { verifyCode } from "@/SchemaValidations/user.validation"
import bcrypt from "bcryptjs"


export async function POST(request: Request) {

    await connectDB()

    try {
        const { username, email, password } = await request.json()

        const existingUser = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({ success: false, message: "User Already Exists and Verified" }, { status: 409 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const verifyCodeExpiry = new Date(Date.now() + 3600000)

                existingUser.password = hashedPassword
                existingUser.verifyCode = verifyCode
                existingUser.verifyCodeExpiry = verifyCodeExpiry

                await existingUser.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = new Date(Date.now() + 3600000)

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isAcceptingMessage: true,
                message: []
            })
        }

        const sendingVerificationMail = await sendMail(username, email, verifyCode)

        if (!sendingVerificationMail.success) {
            return Response.json({ success: false, message: sendingVerificationMail.message }, { status: 409 })
        }

        return Response.json({ success: true, message: "User Registered Successfully" }, { status: 201 })

    } catch (error) {
        return Response.json({ success: false, message: "User Registration Failed" }, { status: 409 })
    }
}