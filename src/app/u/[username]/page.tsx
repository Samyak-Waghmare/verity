'use client'

import React, { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ApiResponse } from '@/types/ApiResponse'
import confetti from 'canvas-confetti'

function MessagePage() {
  const params = useParams<{ username: string }>()
  const username = params?.username

  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [publicMessages, setPublicMessages] = useState<any[]>([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(true)
  const [themePreset, setThemePreset] = useState('dark')
  const [isUserNotFound, setIsUserNotFound] = useState(false)

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/get-public-profile/${username}`)
        setPublicMessages(response.data.publicMessages || [])
        setIsAcceptingMessage(response.data.isAcceptingMessage)
        setThemePreset(response.data.themePreset || 'dark')
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setIsUserNotFound(true)
        } else {
          console.error("Failed to fetch profile", error)
        }
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#3b82f6', '#ec4899', '#22c55e']
    });
  }

  const handleSendMessage = async () => {
    if (!content.trim()) {
      toast.error('Message cannot be empty')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content
      })
      toast.success(response.data.message)
      setContent('')
      setIsSent(true)
      triggerConfetti()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'neon-purple': return 'from-purple-950 via-background to-fuchsia-900/30'
      case 'sunset': return 'from-orange-950 via-background to-rose-900/30'
      case 'cyberpunk': return 'from-yellow-950 via-background to-cyan-900/30'
      case 'dark':
      default: return 'from-background via-background to-secondary/30'
    }
  }

  const getOrbClasses = (theme: string) => {
    switch (theme) {
      case 'neon-purple': return ['bg-fuchsia-500/20', 'bg-purple-600/20']
      case 'sunset': return ['bg-orange-500/20', 'bg-rose-600/20']
      case 'cyberpunk': return ['bg-yellow-500/20', 'bg-cyan-600/20']
      case 'dark':
      default: return ['bg-primary/10', 'bg-purple-500/10']
    }
  }

  const orbs = getOrbClasses(themePreset)

  if (isUserNotFound) {
    notFound()
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br relative overflow-hidden py-12 px-4 transition-colors duration-1000 ${getThemeClasses(themePreset)}`}>
      {/* Decorative Orbs */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] animate-pulse transition-colors duration-1000 ${orbs[0]}`}></div>
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000 transition-colors duration-1000 ${orbs[1]}`}></div>

      <div className="w-full max-w-2xl bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl p-5 md:p-12 relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 mb-4 pb-2">
            Public Profile Link
          </h1>
          <p className="text-xl text-muted-foreground">
            Send an anonymous message to <span className="font-bold text-foreground">@{username}</span>
          </p>
        </div>

        {isSent ? (
          <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Message Sent!</h2>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Your secret is safe with us. The message has been securely delivered to @{username}.
            </p>
            <Button onClick={() => setIsSent(false)} variant="outline" size="lg" className="mt-8 rounded-xl px-8 hover:bg-secondary">
              Send Another Message
            </Button>
          </div>
        ) : !isAcceptingMessage ? (
          <div className="text-center py-12 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Not Accepting Messages</h2>
            <p className="text-muted-foreground">@{username} is currently taking a break and not accepting new anonymous messages.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Type your secret message here... Don't worry, your identity is completely hidden!"
                className="min-h-[200px] resize-none text-lg p-6 bg-background/50 border-border/50 focus-visible:ring-primary rounded-2xl shadow-inner"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
              />
              <div className={`absolute bottom-4 right-6 text-sm font-medium bg-background/80 px-2 py-1 rounded backdrop-blur-sm transition-colors ${content.length === 1000 ? 'text-destructive font-bold animate-pulse' : content.length >= 950 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {content.length} / 1000
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={isSubmitting || !content.trim()}
              size="lg"
              className="w-full text-lg py-7 rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_-5px_rgba(100,0,255,0.4)] dark:shadow-[0_0_30px_-5px_oklch(0.65_0.2_280/0.8)] dark:border dark:border-primary/60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Sending securely...
                </>
              ) : (
                <>
                  Send It Anonymously <Send className="ml-3 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        )}

        {!profileLoading && publicMessages.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Public Replies</h2>
            <div className="grid gap-6">
              {publicMessages.map((msg, idx) => (
                <div key={idx} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg text-left">
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Anonymous Asked</span>
                      {msg._id && (
                        <span className="font-mono text-[10px] text-muted-foreground opacity-60 tracking-widest uppercase">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-foreground">"{msg.content}"</p>
                  </div>
                  <div className="pl-4 border-l-2 border-primary/50">
                    <span className="inline-block text-muted-foreground text-xs font-bold mb-2 tracking-wide uppercase">@{username} Replied</span>
                    <p className="text-muted-foreground text-base leading-relaxed">{msg.replyText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center space-y-6 pt-10 border-t border-border/30">
          <h3 className="text-2xl font-bold">Want your own Verity?</h3>
          <p className="text-muted-foreground">Join thousands of others receiving honest, anonymous messages.</p>
          <Link href="/sign-up" className="inline-block">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              Create Your Free Account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default MessagePage
