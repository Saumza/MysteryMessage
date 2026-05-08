'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Button } from '@/components/ui/button'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { UserModel } from '@/models/user.model'
import { messageSchemaValidation } from '@/SchemaValidations/user.validation'
import { toast } from 'sonner'
import { APIResponse } from '@/types/APIResponse'
import { Loader2 } from 'lucide-react'
import { useCompletion } from '@ai-sdk/react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'


function page() {

    const { username } = useParams()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof messageSchemaValidation>>({
        resolver: zodResolver(messageSchemaValidation),
        defaultValues: {
            content: ""
        }
    })
    const content = form.watch("content")
    const submitHandler = async (data: z.infer<typeof messageSchemaValidation>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/send-message', {
                username,
                content
            })
            toast.success('Message Sent Successfully')

        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            const responseError = axiosError.response?.data.message
            toast.error('Operation Unsuccessful', {
                description: responseError
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    let initialMessages = "What's a simple pleasure that never fails to brighten your day? | | If you could instantly master any new skill, what would you choose? | | What's one fictional world you'd love to visit for a day?"

    const { completion, complete, isLoading, error, setCompletion } = useCompletion({
        api: '/api/suggest-message',
        initialCompletion: initialMessages
    });

    const loadMessages = () => {
        try {
            complete("")
        } catch (error) {
            toast.error("Error While Loading Messages")
        }
    }

    const parseResponse = (string: string) => {
        const response = string.split(" | | ")
        return response
    }

    useEffect(() => {
        complete("")
    }, [])

    return (
        <>
            <div className="my-6 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl font-outfit ">
                <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>
                <form onSubmit={form.handleSubmit(submitHandler)}>
                    <FieldGroup className='flex items-center'>
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description" className='font-semibold text-[1rem]'>
                                        Send Anonymous Message to @{username}
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="Write Your Anonymous Message Here"
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit" className='w-fit font-outfit p-5' disabled={isSubmitting || content.length === 0}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </FieldGroup>
                </form>
                <Separator className='mt-8' />
            </div>
            <div className="mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl font-outfit ">
                <Button type="submit" className='w-fit font-outfit p-5' disabled={isLoading} onClick={loadMessages}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        'Suggest Messages'
                    )}
                </Button>
                <section className='font-outfit'>
                    <p className='my-8 text-lg'>Click on any messages below to select it</p>
                    <div className='border rounded-lg p-5'>
                        <p className='font-semibold text-2xl'>Messages</p>
                        <div className='flex flex-col my-4 gap-y-8'>
                            {
                                error ? (
                                    <p className="text-red-500">{error.message}</p>
                                ) : (
                                    parseResponse(completion).map((message, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => form.setValue('content', message)}
                                            className='bg-white text-black border border-gray-500 text-base p-8'
                                        >
                                            {message}
                                        </Button>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </section>
                <Separator className='my-8' />
                <div className='bg-black font-outfit text-white rounded-xl flex flex-col justify-center centre p-5 gap-y-5'>
                    <p className='text-center text-2xl font-bold'>Get Your Anonymous Message</p>
                    <Button className='w-fit bg-white text-black self-center text-base p-4'>
                        <Link href={"/sign-up"}>Create Your Account</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default page