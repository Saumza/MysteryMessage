'use client'

import { verifyCode } from "@/SchemaValidations/user.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { useParams, useRouter } from "next/navigation"
import { APIResponse } from "@/types/APIResponse"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

function verificationCode() {

    const { username } = useParams<{ username: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof verifyCode>>({
        resolver: zodResolver(verifyCode),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifyCode>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<APIResponse>('/api/verify-code', {
                username,
                code: data.code
            })
            toast.success("Success", {
                description: response.data.message
            })
            router.replace("/sign-in")

        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error("Verifiication Failed", {
                description: axiosError.response?.data.message
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 font-outfit">
                        Account Verification
                    </h1>
                    <p className="mb-4 font-outfit">Enter The Verification Code To Verify Your Account</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title" className="font-outfit">
                                        Code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your Verification Code"
                                        type="text"
                                        className="font-outfit"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError className="font-outfit" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit" className='w-full font-outfit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default verificationCode