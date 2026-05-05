import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { APIResponse } from "@/types/APIResponse"
import axios, { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { acceptingMessageSchema } from "@/SchemaValidations/user.validation"
import { useSession } from "next-auth/react"
import { Message } from "@/models/user.model"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"

function dashboard() {

    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [switchLoading, setSwitchLoading] = useState(false)

    const form = useForm<z.infer<typeof acceptingMessageSchema>>({
        resolver: zodResolver(acceptingMessageSchema)
    })

    const { data: session } = useSession()

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const handleDelete = (messageId: Object) => {
        setMessages([...messages].filter((message) => message._id !== messageId))
    }

    const fetchAcceptMessages = useCallback(async () => {
        setSwitchLoading(true)
        try {
            const response = await axios.get<APIResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages ?? true)
            toast.info('Accepting Messages')
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error('Failed To Fetch Accept Message Status', {
                description: axiosError.response?.data.message
            })
        } finally {
            setSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setSwitchLoading(true)
        try {
            const response = await axios.get<APIResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success('Messages Refresh Successfully')
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error('Failed To Fetch Messages', {
                description: axiosError.response?.data.message
            })
        } finally {
            setIsLoading(false)
            setSwitchLoading(false)
        }
    }, [setSwitchLoading])

    useEffect(() => {
        if (!session || !session.user) return

        fetchAcceptMessages()
        fetchMessages()
    }, [session, fetchMessages, fetchAcceptMessages])

    const handleSwitchChange = async () => {
        setSwitchLoading(true)
        try {
            const response = await axios.post<APIResponse>('/api/accept-message', {
                acceptMessage: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error('Failed To Update Accept Message Status', {
                description: axiosError.response?.data.message
            })
        } finally {
            setSwitchLoading(false)
        }
    }

    const { username }: User = session?.user as User
    const baseURL = `${window.location.protocol}://${window.location.host}/`
    const userURL = `${baseURL}/u/${username}`

    const copyToClipboard = () => {
        window.navigator.clipboard.writeText(userURL)
    }


    if (!session || !session.user) {
        return <div>Please Login</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={userURL}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={switchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id.toString()}
                            message={message}
                            onMessageDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default dashboard