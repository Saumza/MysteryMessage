"use client"

import { useEffect, useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpValidation } from "@/SchemaValidations/user.validation"
import { Controller, useForm } from "react-hook-form"
import { useDebounce } from "@uidotdev/usehooks"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { APIResponse } from "@/types/APIResponse"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


function page() {
    const [username, setUsername] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [usernameSuccess, setUsernameSuccess] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername = useDebounce(username, 300)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            console.log(debouncedUsername);

            if (debouncedUsername) {
                try {
                    const response = await axios.get<APIResponse>(`/api/check-unique-username?username=${username}`)
                    console.log(response.data.message);
                    setUsernameError(response.data.message)
                    setUsernameSuccess(response.data.success)
                } catch (error) {
                    const axiosError = error as AxiosError<APIResponse>
                    setUsernameError(axiosError.response?.data.message ?? "Error While Checking Username")
                    setUsernameSuccess(axiosError.response?.data.success ?? true)
                }
            }
        }
        checkUsername()
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<APIResponse>("/api/sign-up", data)
            toast.success("Success", {
                description: response.data?.message
            })
            setIsSubmitting(false)
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error("SignUp Failed", {
                description: errorMessage,
            })
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 font-outfit">
                        Join Mystry Feedback
                    </h1>
                    <p className="mb-4 font-outfit">Sign up to start your anonymous adventure</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title" className="font-outfit">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setUsername(e.target.value)
                                        }}
                                        aria-invalid={!usernameSuccess}
                                        placeholder="Enter your Username"
                                        type="text"
                                        className="font-outfit"
                                    />
                                    {!usernameSuccess ? (
                                        <FieldError className="font-outfit" errors={[{ message: usernameError }]} />
                                    ) : <p className='text-green-500 font-outfit' >
                                        {usernameError}
                                    </p>}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title" className="font-outfit">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your Email"
                                        type="email"
                                        className="font-outfit"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError className="font-outfit" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title" className="font-outfit">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your Password"
                                        type="password"
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
                                'Sign Up'
                            )}
                        </Button>
                    </FieldGroup>
                </form>
                <div className="text-center mt-4">
                    <p className="font-outfit">
                        Already a member?
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-outfit">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    )
}

export default page