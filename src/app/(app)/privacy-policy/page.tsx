import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-md border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg prose prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold mb-8 text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: June 6, 2026</p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          At Verity, your privacy and the anonymity of your users are our highest priorities. This Privacy Policy outlines what information we collect, how we use it, and how we cryptographically protect it.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          <strong>Account Information:</strong> When you register for a Verity account, we collect your email address and an encrypted password hash. We do not require real names. <br/><br/>
          <strong>Anonymous Messages:</strong> The core of our service involves routing anonymous messages. We DO NOT log IP addresses, user-agents, or geographical data of the message senders.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How We Use Information</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Information is used strictly to provide and maintain the Verity service. We do not sell data to third-party data brokers or advertisers.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Messages are stored in our secure database until you explicitly delete them or delete your account. Once deleted, data is permanently scrubbed from our active clusters within 24 hours.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
