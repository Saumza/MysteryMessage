import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/VerificationEmail";
import { APIResponse } from "@/types/APIResponse";

export const sendMail = async (username: string, email: string, verifyCode: string): Promise<APIResponse> => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Mail',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Email Sent Successfully" }
    } catch (error) {
        return { success: false, message: "Failed to send Email" }
    }
}