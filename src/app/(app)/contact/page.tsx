'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Mail, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Fake submission delay for realism
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Message sent! Our support team will get back to you shortly.")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Support</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about Verity? Our team is here to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-xl neon-card-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Email</label>
            <Input 
              type="email" 
              required 
              placeholder="you@company.com" 
              className="bg-background/50 border-border/50 py-6"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input 
              type="text" 
              required 
              placeholder="How can we help?" 
              className="bg-background/50 border-border/50 py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              required 
              placeholder="Describe your issue or question in detail..." 
              className="bg-background/50 border-border/50 min-h-[150px] resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 text-lg rounded-xl neon-border-hover mt-4"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-5 h-5 mr-2" /> Send Message</>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
