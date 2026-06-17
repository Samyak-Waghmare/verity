'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { toast, useSonner } from "sonner"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ProfilePage() {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [themePreset, setThemePreset] = useState('dark')
  const [acceptMessages, setAcceptMessages] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useSonner()

  const {data: session, status} = useSession()

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setAcceptMessages(response.data.isAcceptingMessage ?? false)
      setThemePreset(response.data.themePreset || 'dark')
    } catch (error) {
      toast.error("Failed to fetch message settings")
    } finally{
      setIsSwitchLoading(false)
      setIsPageLoading(false)
    }
  }, [])

  useEffect(() => {
    if(!session || !session.user) return
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage])

  const handleSwitchChange = async(checked: boolean) => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: checked
      })
      setAcceptMessages(checked)
      toast.success(response.data.message)
    } catch (error) {
      toast.error("Failed to update message settings")
    }
  }

  const handleThemeChange = async (value: string) => {
    setThemePreset(value)
    try {
      await axios.post('/api/update-profile', { themePreset: value })
      toast.success("Profile theme updated! Your public link will now use this theme.")
    } catch (error) {
      toast.error("Failed to update theme")
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      await axios.delete('/api/delete-account')
      toast.success("Account permanently deleted")
      signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error("Failed to delete account")
      setIsDeletingAccount(false)
    }
  }

  if (status === 'loading' || isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if(!session || !session.user){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-muted-foreground">Please sign in to access your profile.</p>
        <Link href="/sign-in">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="my-10 mx-4 md:mx-8 lg:mx-auto p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 transition-all duration-500">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inbox
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 pb-2">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public profile and privacy preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Privacy Settings */}
        <div className="p-6 bg-background/50 rounded-2xl border border-border/30 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Privacy</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Accept Anonymous Messages</p>
              <p className="text-sm text-muted-foreground">Turn this off to take a break. People visiting your link won't be able to send you messages.</p>
            </div>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-primary ml-4"
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="p-6 bg-background/50 rounded-2xl border border-border/30 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Public Profile Theme</p>
              <p className="text-sm text-muted-foreground">Choose the aesthetic for your public `/u/[username]` page.</p>
            </div>
            <Select value={themePreset} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px] bg-background border-border/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Classic Dark</SelectItem>
                <SelectItem value="neon-purple">Neon Purple</SelectItem>
                <SelectItem value="sunset">Sunset Glow</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-destructive/5 rounded-2xl border border-destructive/20 shadow-sm relative overflow-hidden mt-12">
           <div className="absolute top-0 right-0 p-8 opacity-5">
            <AlertTriangle className="w-32 h-32 text-destructive" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Permanently delete your account, your profile link, and all of your received messages. This action cannot be undone.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="font-bold tracking-wide">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50 rounded-xl shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-destructive" /> Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-base">
                    This action cannot be undone. This will permanently delete your account, your Verity profile, and all your anonymous messages from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-secondary border-border/50">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeletingAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isDeletingAccount ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage
