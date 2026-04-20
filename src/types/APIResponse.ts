import { Message } from "@/models/user.model";

export interface APIResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>
}