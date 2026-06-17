import React from 'react'
import { Shield, Zap, Lock, EyeOff, Globe, Bell } from 'lucide-react'

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Uncompromising Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Verity is built from the ground up to provide the most secure, intuitive, and lightning-fast anonymous messaging experience on the market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Absolute Anonymity", desc: "No IP tracking, no device fingerprinting, and no logs. The sender's identity is mathematically protected.", color: "text-primary", bg: "bg-primary/20", border: "neon-card-1" },
            { icon: Zap, title: "Lightning Fast", desc: "Powered by Next.js and MongoDB, messages are delivered to your dashboard in less than 50 milliseconds.", color: "text-purple-400", bg: "bg-purple-500/20", border: "neon-card-2" },
            { icon: Lock, title: "Bank-Grade Security", desc: "Your messages are encrypted at rest and in transit using state-of-the-art AES-256 encryption.", color: "text-blue-400", bg: "bg-blue-500/20", border: "neon-card-3" },
            { icon: EyeOff, title: "Spam Protection", desc: "Advanced AI-driven rate limiting and spam filtering ensure your dashboard stays clean and relevant.", color: "text-red-400", bg: "bg-red-500/20", border: "neon-card-1" },
            { icon: Globe, title: "Global CDN", desc: "Access your dashboard from anywhere in the world with zero latency, backed by Edge Network routing.", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "neon-card-2" },
            { icon: Bell, title: "Real-Time Alerts", desc: "Get instant notifications when a new message arrives so you never miss an important piece of feedback.", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "neon-card-3" }
          ].map((feature, i) => (
            <div key={i} className={`bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-3xl shadow-lg ${feature.border}`}>
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage
