'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Instagram, Share2, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { User } from 'next-auth'

export default function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const username = session?.user ? (session.user as User).username : 'username'
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Link copied! Paste it in your Instagram bio now.", {
      icon: '📋'
    })
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-10">
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
            Welcome to Verity!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your account is fully verified. You're just one step away from receiving your first anonymous message.
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">1</span>
            Get Your Secret Link
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/50 p-4 rounded-2xl border border-border/50">
            <code className="flex-1 text-primary font-semibold text-lg bg-transparent border-none focus:ring-0 w-full text-center sm:text-left overflow-x-auto whitespace-nowrap">
              {profileUrl}
            </code>
            <Button onClick={copyToClipboard} size="lg" className="w-full sm:w-auto rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(100,0,255,0.4)]">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">2</span>
            Share it Everywhere
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background/50 p-6 rounded-2xl border border-border/50 text-center space-y-4 hover:bg-card/80 transition-colors">
              <Instagram className="w-10 h-10 text-pink-500 mx-auto" />
              <h3 className="font-semibold text-lg">Instagram Bio</h3>
              <p className="text-sm text-muted-foreground">Paste your link in your Instagram bio and post a story telling your friends to send you secrets.</p>
            </div>
            <div className="bg-background/50 p-6 rounded-2xl border border-border/50 text-center space-y-4 hover:bg-card/80 transition-colors">
              <Share2 className="w-10 h-10 text-blue-500 mx-auto" />
              <h3 className="font-semibold text-lg">WhatsApp Status</h3>
              <p className="text-sm text-muted-foreground">Share the link on your WhatsApp Status. Prepare to be surprised by what people say!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-8 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-transform">
              Take me to my Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
