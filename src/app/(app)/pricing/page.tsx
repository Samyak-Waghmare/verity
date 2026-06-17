import React from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to start gathering authentic feedback. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-lg flex flex-col neon-card-hover">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-muted-foreground mb-6">Perfect for individuals starting out.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Up to 100 messages/mo</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Basic Spam Protection</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Standard Dashboard</li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full py-6 rounded-xl border-border/80 neon-border-hover">Get Started Free</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-primary/20 to-card/40 backdrop-blur-xl border border-primary/50 p-8 rounded-3xl shadow-[0_0_40px_rgba(var(--primary),0.2)] flex flex-col relative transform md:-translate-y-4 neon-card-1">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">MOST POPULAR</div>
            <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
            <p className="text-muted-foreground mb-6">For creators and professionals.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold">$9</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Unlimited messages</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Advanced AI Spam Filtering</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Custom URL Slug</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Priority Support</li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full py-6 rounded-xl bg-primary text-white hover:opacity-90 neon-border-hover">Start Pro Trial</Button>
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-lg flex flex-col neon-card-hover">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-6">For large teams and organizations.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold">$49</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Everything in Pro</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Team Dashboards</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> API Access</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Dedicated Account Manager</li>
            </ul>
            <Link href="/contact">
              <Button variant="outline" className="w-full py-6 rounded-xl border-border/80 neon-border-hover">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
