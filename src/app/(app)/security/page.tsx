import React from 'react'
import { ShieldCheck, Server, Key, FileWarning } from 'lucide-react'

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <ShieldCheck className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Security & Privacy</h1>
          <p className="text-xl text-muted-foreground">
            We don't just promise security; we engineer it into the core of Verity.
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg neon-card-1">
            <div className="flex items-start gap-6">
              <Server className="w-10 h-10 text-primary mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Zero-Log Architecture</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Verity operates on a strict zero-log policy. We do not track IP addresses, browser agents, or location data of senders. Once a message is submitted, it is immediately encrypted and routed to the recipient's dashboard without any identifiable metadata attached.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg neon-card-2">
            <div className="flex items-start gap-6">
              <Key className="w-10 h-10 text-purple-400 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Encryption Standards</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All traffic is secured via TLS 1.3. Data at rest is encrypted using AES-256 block-level encryption inside our secure MongoDB clusters. Your password hashes are generated using bcrypt with a high work factor to ensure cryptographic safety against brute-force attacks.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg neon-card-3">
            <div className="flex items-start gap-6">
              <FileWarning className="w-10 h-10 text-emerald-400 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Vulnerability Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in working with the security community. If you are a security researcher and have found a vulnerability in Verity, please report it immediately to security@Verity.app. We offer a competitive bug bounty program for critical exploits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityPage
