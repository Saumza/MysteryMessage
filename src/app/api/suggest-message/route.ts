import { convertToModelMessages, streamText, UIMessage } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
    try {
        const result = streamText({
            model: google('gemini-2.0-flash'),
            prompt: "Create a list of three open-ended andengaging questions formatted as a single string. Eachquestion should be separated by ' | | '. These questions arefor an anonymous social messaging platform, like Qooh.me,and should be suitable for a diverse audience. Avoidpersonal or sensitive topics, focusing instead onuniversal themes that encourage friendly interaction. Forexample, your output should be structured like this:'What's a hobby you've recently started? | | If you couldhave dinner with any historical figure, who would it be?|lWhat's a simple thing that makes you happy?'. Ensure thequestions are intriguing, foster curiosity, andcontribute to a positive and welcoming conversationalenvironment."

        })

        return result.toUIMessageStreamResponse()

    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ success: false, message: error.message }, { status: 500 })
        }
        return Response.json({ success: false, message: "Unexpected Error Occured" }, { status: 500 })
    }
}
