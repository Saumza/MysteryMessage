'use client'

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
import { signInValidation } from "@/SchemaValidations/user.validation"
import { signIn } from "next-auth/react"
import Link from "next/link"

function page() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInValidation>) => {
    setIsSubmitting(true)
    const response = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (response?.error) {
      toast.error("Login Failed", {
        description: response.error
      })
    }
    if (response?.url) {
      setIsSubmitting(false)
      toast.success("Login Successfull", {
        description: "Logged In Successfully"
      })
      router.replace("/dashboard")
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 font-outfit">
            SignIn Into Mystry Message
          </h1>
          <p className="mb-4 font-outfit">SignIn to Start your Adventurous Anonymous Journey</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title" className="font-outfit">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Email Id"
                    type="text"
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
                'Submit'
              )}
            </Button>
          </FieldGroup>
        </form>
        <div className="text-center mt-4">
          <p className="font-outfit">
            First Time Here? SignUp for free! 
            <br />
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-outfit">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page