'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"

import { toast, useSonner } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"


const SignInPage = () => {
  
  useSonner()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    setIsSubmitting(false)

    if(result?.error){
      // toast({
      //   title: "Login Failed",
      //   description: "Incorrect username or password",
      //   variant: "destructive"
      // })
      if(result.error == 'CredentialsSignin'){
        toast.error("Incorrect username or password");
      }
      else{
        toast.error(result.error ?? "Something went wrong");
      }
    }

    if(result?.url){
      const isWelcome = typeof window !== 'undefined' && window.location.search.includes('welcome=true')
      router.replace(isWelcome ? '/welcome' : '/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl relative z-10 transform transition-all duration-500 hover:shadow-primary/10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
          Join Verity
        </h1>
        <p className="mb-4 text-muted-foreground">Sign in and share your thoughts anonymously</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" 
                    {...field} 
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="password" 
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isGoogleLoading} className="w-full hover:scale-[1.02] transition-transform">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</> : 'Sign in'}
            </Button>
          </form>
        </Form>
        {/* Google Sign In */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card/40 backdrop-blur-2xl px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading || isSubmitting}
          className="w-full flex items-center gap-3 hover:scale-[1.02] transition-transform border-border/50 bg-background/50 backdrop-blur"
          onClick={() => {
            setIsGoogleLoading(true)
            signIn('google', { callbackUrl: '/dashboard' })
          }}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
        </Button>
        <div className="text-center mt-4">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
