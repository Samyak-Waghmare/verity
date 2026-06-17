"use client"
// client component ban gya server pe render hoke nhi aayega
// js shift hogi user ke browser me aur waha use karege
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'
import { ShieldCheck, Settings } from 'lucide-react'

function Navbar() {
  
  const {data: session} = useSession()

  const user: User = session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-lg sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 transition-all'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <Link className='flex items-center gap-2 text-2xl font-extrabold mb-4 md:mb-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 hover:opacity-80 transition-opacity' href={session ? '/dashboard' : '/'}>
                <ShieldCheck className="w-8 h-8 text-primary" />
                Verity
            </Link>
            {
                session ? (
                    <div className="flex items-center space-x-4">
                      <span className='mr-4 font-medium hidden sm:inline-block'>Welcome, {user?.username || user?.email}</span>
                      <Link href='/profile'>
                          <Button variant="ghost" size="icon" className='hover:bg-primary/10 hover:text-primary transition-colors'>
                              <Settings className="w-5 h-5" />
                          </Button>
                      </Link>
                      <Button className='w-full md:w-auto hover:scale-105 transition-transform bg-primary text-primary-foreground' onClick={() => signOut()}>Logout</Button>
                      <ThemeToggle />
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                      <Link href='/sign-in'>
                          <Button className='w-full md:w-auto hover:scale-105 transition-transform shadow-md'>Login</Button>
                      </Link>
                      <ThemeToggle />
                    </div>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
