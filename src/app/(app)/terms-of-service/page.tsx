import React from 'react'

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-md border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg prose prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold mb-8 text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: June 6, 2026</p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          By accessing or using the Verity platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. User Conduct</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          You agree not to use Verity to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Harass, abuse, or harm another person.</li>
          <li>Transmit any material that is illegal, threatening, or defamatory.</li>
          <li>Attempt to bypass our rate-limiting or security protocols.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Service Availability</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We strive for 99.9% uptime. However, we do not guarantee that the service will be uninterrupted or error-free. We reserve the right to modify or discontinue the service with or without notice.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Verity is not liable for the content of anonymous messages received through the platform. Users accept the service "as is."
        </p>
      </div>
    </div>
  )
}

export default TermsOfServicePage
