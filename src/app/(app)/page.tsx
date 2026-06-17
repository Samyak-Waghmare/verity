'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { MessageSquare, Shield, Zap, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Home = () => {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-20 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden'>
      
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <section className='text-center mb-12 md:mb-16 relative z-10 max-w-3xl'>
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight'>
          Dive into the World of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary/80 animate-pulse">Anonymous Conversations</span>
        </h1>
        <p className='mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground'>
          Explore Verity — Where your identity remains an absolute secret. Share your thoughts freely without fear.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg dark:border dark:border-primary/50 neon-border-hover">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-background/50 backdrop-blur-md neon-border-hover border-border/50 dark:border-border/80">
              Login to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating Dashboard Mockup */}
      <div className="w-full max-w-5xl mx-auto relative z-20 mt-12 perspective-1000">
        <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 neon-mac-hover">
          
          {/* Mockup Header (MacOS style window controls) */}
          <div className="bg-secondary/40 border-b border-border/30 p-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="mx-auto text-sm font-bold text-primary bg-background/50 px-6 py-1 rounded-full border border-border/20 tracking-wide">
              Verity
            </div>
          </div>

          {/* Mockup Body with Sidebar and Main Content */}
          <div className="flex h-[400px]">
            {/* Fake Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-background/30 border-r border-border/20 p-6 space-y-4">
              <div className="h-8 bg-primary/20 rounded-md w-3/4 mb-4"></div>
              <div className="h-4 bg-secondary rounded-md w-full"></div>
              <div className="h-4 bg-secondary rounded-md w-5/6"></div>
              <div className="h-4 bg-secondary rounded-md w-4/6"></div>
            </div>
            
            {/* Main Content (Carousel) */}
            <div className="flex-1 p-8 bg-background/10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 z-0"></div>
              <Carousel
                plugins={[Autoplay({delay: 3000})]}
                className="w-full max-w-md z-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
              >
                <CarouselContent>
                  {
                    messages.map((message, index) => (
                    <CarouselItem key={index}>
                      <div className="p-2">
                        <Card className="border-border/50 bg-card/80 backdrop-blur-lg shadow-xl hover:shadow-primary/20 transition-all duration-300">
                          <CardHeader className="font-semibold text-lg pb-2 border-b border-border/30">
                            {message.title}
                          </CardHeader>
                          <CardContent className="flex flex-col aspect-auto items-start justify-center p-6 min-h-[140px]">
                            <div className="flex items-center mb-4 text-primary">
                              <MessageSquare className="mr-3 h-6 w-6"/>
                              <span className="text-base font-medium text-foreground leading-snug">{message.content}</span>
                            </div>
                            <div className="w-full flex justify-end">
                              <span className="text-xs text-muted-foreground font-medium bg-secondary/80 px-3 py-1 rounded-full">{message.received}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                    ))
                  }
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-background/50 border-border/50 hover:bg-primary hover:text-white" />
                <CarouselNext className="hidden md:flex -right-12 bg-background/50 border-border/50 hover:bg-primary hover:text-white" />
              </Carousel>
            </div>
          </div>
        </div>

        {/* Glow behind the mockup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      </div>

    {/* Features Section */}
    <section className="w-full max-w-6xl mx-auto mt-32 px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why Choose Verity?</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Experience the most secure and intuitive way to gather authentic thoughts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-3xl shadow-lg neon-card-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Absolute Anonymity</h3>
          <p className="text-muted-foreground leading-relaxed">Your identity is completely hidden. We ensure that no trackers or IP logs ever compromise your users' privacy.</p>
        </div>
        {/* Feature 2 */}
        <div className="bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-3xl shadow-lg neon-card-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Lightning Fast</h3>
          <p className="text-muted-foreground leading-relaxed">Receive feedback instantly in your dashboard with real-time updates and ultra-fast Next.js architecture.</p>
        </div>
        {/* Feature 3 */}
        <div className="bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-3xl shadow-lg neon-card-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Bank-Grade Security</h3>
          <p className="text-muted-foreground leading-relaxed">All data is encrypted and securely stored. Only you have the access to view and manage your received messages.</p>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="w-full max-w-6xl mx-auto mt-32 px-4 relative z-10 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Three simple steps to start receiving authentic feedback.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-md border border-border/50">1</div>
          <h3 className="text-xl font-bold mb-2">Create Account</h3>
          <p className="text-muted-foreground">Sign up in seconds and get your unique, personal feedback link.</p>
        </div>
        <div className="flex flex-col items-center relative">
          <div className="hidden md:block absolute top-8 -left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-md border border-border/50">2</div>
          <h3 className="text-xl font-bold mb-2">Share Your Link</h3>
          <p className="text-muted-foreground">Post your link on social media, in your bio, or share directly.</p>
          <div className="hidden md:block absolute top-8 -right-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-[0_0_15px_rgba(var(--primary),0.5)] border border-primary/50">3</div>
          <h3 className="text-xl font-bold mb-2">Receive Feedback</h3>
          <p className="text-muted-foreground">Read honest, anonymous messages directly from your private dashboard.</p>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="w-full relative z-10 py-24 bg-gradient-to-t from-background to-card/20 border-t border-border/30">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Ready to uncover the truth?</h2>
        <p className="text-xl text-muted-foreground mb-10">Join thousands of users discovering authentic thoughts without the fear of judgment.</p>
        <Link href="/sign-up">
          <Button size="lg" className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white border border-transparent neon-border-hover">
            Create Your Free Account
          </Button>
        </Link>
      </div>
    </section>

    </main>
    <footer className="bg-card/30 border-t border-border/30 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-2xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
            <Shield className="w-6 h-6 text-primary" /> Verity
          </div>
          <p className="text-muted-foreground mb-6 max-w-sm">
            The world's most secure and intuitive platform for receiving authentic, anonymous feedback from your audience.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-foreground">Product</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-foreground">Legal</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-border/20 text-muted-foreground text-sm font-medium">
        © 2026 Verity Inc. All rights reserved.
      </div>
    </footer>
    </>
  )
}

export default Home
