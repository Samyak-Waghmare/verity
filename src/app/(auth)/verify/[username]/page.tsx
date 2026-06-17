'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

function VerifyAccount() {
  const router = useRouter() //i can redirect
  const params = useParams<{username: string}>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  //zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  })

  const onSubmit = async(data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
          username: params.username,
          code: data.code
      })

      toast.success(response.data.message)
      router.replace('/sign-in?welcome=true')
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>;
      toast.error(AxiosError.response?.data.message ?? "Signup failed");
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden'>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse delay-1000"></div>

        <div className='w-full max-w-md p-8 space-y-8 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl relative z-10 transform transition-all duration-500 hover:shadow-primary/10'>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-light lg:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                    Verify Your Account
                </h1>
                <p className="mb-4 text-muted-foreground">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input className="text-center text-3xl tracking-[0.5em] font-mono h-16 bg-background/50 border-border/50 shadow-inner rounded-xl" placeholder="••••••" autoComplete="one-time-code" autoFocus maxLength={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="w-full text-lg h-12 hover:scale-[1.02] transition-transform rounded-xl">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</> : 'Verify Account'}
        </Button>
      </form>
    </Form>
        </div>
    </div>
  )
}

export default VerifyAccount
