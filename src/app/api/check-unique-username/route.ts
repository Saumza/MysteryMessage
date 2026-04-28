import { success, z } from "zod";
import { usernameValidation } from "@/SchemaValidations/user.validation";
import { UserModel } from "@/models/user.model";
import { connectDB } from "@/lib/dbConnect";

const usernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const querySearch = {
            username: searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(querySearch)

        if (!result.success) {
            const usernameError = z.treeifyError(result.error)
            return Response.json({
                success: false,
                message: usernameError.properties?.username?.errors || "Username Must Follow Format"
            }, { status: 400 })
        }

        const { username } = result.data

        const user = await UserModel.findOne({ username, isVerified: true })

        if (user) {
            return Response.json({
                success: false,
                message: "Username is Already Taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username is Available"
        }, { status: 200 })


    } catch (error) {
        console.error("Error Checking Username", error)
        return Response.json({
            success: false,
            message: "Error Checking Username"
        }, { status: 500 })
    }
}