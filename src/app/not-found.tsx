'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, UserPlus, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  
  // Extract username if they tried to visit /u/[username]
  let missedUsername = ''
  if (pathname?.startsWith('/u/')) {
    const parts = pathname.split('/')
    if (parts.length >= 3) {
      missedUsername = parts[2]
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden py-12 px-4">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 text-center">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
          404 Not Found
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          The page or user profile you are looking for does not exist.
        </p>

        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            {missedUsername ? `Claim @${missedUsername}!` : 'Claim this Username!'}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {missedUsername 
              ? `The username @${missedUsername} doesn't exist and is currently available. Grab it before someone else does!`
              : `If you were trying to visit a public profile that doesn't exist, this username is currently available. Grab it before someone else does!`
            }
          </p>
          <Link href="/sign-up">
            <Button className="w-full rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(100,0,255,0.4)]">
              Create Your Free Account
            </Button>
          </Link>
        </div>

        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
