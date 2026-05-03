import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios, { AxiosError } from "axios"
import { APIResponse } from "@/types/APIResponse"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Message } from "@/models/user.model"
import { X } from "lucide-react"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const deleteHandler = async () => {
        try {
            const response = await axios.delete<APIResponse>(`/api/delete-message/${message._id}`)
            toast.success("Feedback Deleted", {
                description: response.data.message
            })
            onMessageDelete(message._id.toString())
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message
            })
        }
    }

    return (
        <Card className="card-bordered">
            <CardHeader>
                <CardDescription>Card Description</CardDescription>
                <Dialog>
                    <DialogTrigger>
                        <Button variant="destructive"> <X /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant="outline" type="submit" onClick={deleteHandler}>
                                    Delete
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
        </Card >
    )
}

export default MessageCard
