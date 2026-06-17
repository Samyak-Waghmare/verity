'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Message } from "@/model/User"
import { ApiResponse } from "@/types/ApiResponse"
import { useCallback, useEffect, useState, useRef } from "react"
import { toast, useSonner } from "sonner"
import Link from "next/link"
import PusherClient from "pusher-js"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, Share2, Inbox, Trash2, AlertTriangle } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
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


function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  const [hasCopied, setHasCopied] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // Pagination states
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useSonner()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId)) 
  }

  const {data: session, status} = useSession()

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setTotalMessages(response.data.totalMessages || 0)
    } catch (error) {
    }
  }, [])

  const handleClearInbox = async () => {
    setIsClearing(true)
    try {
      const response = await axios.delete<ApiResponse>('/api/delete-all-messages')
      setMessages([])
      setTotalMessages(0)
      toast.success(response.data.message)
    } catch (error) {
      toast.error("Failed to clear inbox")
    } finally {
      setIsClearing(false)
    }
  }

  const fetchMessages = useCallback(async (reset: boolean = false) => {
    if (reset) {
      setIsLoading(true)
      setNextCursor(null)
      setHasMore(true)
    } else {
      if (!hasMore || isFetchingMore) return;
      setIsFetchingMore(true)
    }

    try {
      const currentCursor = reset ? null : nextCursor;
      const url = currentCursor ? `/api/get-messages?cursor=${currentCursor}` : '/api/get-messages';
      const response = await axios.get<ApiResponse>(url)
      
      const newMessages = response.data.messages || [];
      const returnedCursor = response.data.nextCursor || null;

      if (reset) {
        setMessages(newMessages)
      } else {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m._id));
          return [...prev, ...uniqueNewMessages];
        })
      }
      
      setNextCursor(returnedCursor);
      setHasMore(!!returnedCursor);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(
        <div>
          <div className="font-semibold text-red-600">Error</div>
          <div className="text-sm text-muted-foreground">
            {axiosError.response?.data.message || "Failed to fetch messages"}
          </div>
        </div>,
        {
          className: "bg-red-100 text-red-900",
        }
      )
    } finally{
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [nextCursor, hasMore, isFetchingMore])

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMessages(false);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore, fetchMessages]);

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages(true)
    fetchAcceptMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Pusher Subscription
  useEffect(() => {
    if(!session || !session.user) return
    const username = (session.user as User).username
    if(!username) return

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "d02f5c467a7fa8e0d4f2"
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2"

    const pusher = new PusherClient(pusherKey, {
      cluster: pusherCluster,
    })

    const channel = pusher.subscribe(`user-${username}`)
    
    channel.bind('new-message', (newMessage: Message) => {
      setMessages((prevMessages) => {
        // Prevent duplicate if already added
        if (prevMessages.some(m => m._id === newMessage._id)) return prevMessages;
        setTotalMessages(prev => prev + 1)
        return [newMessage, ...prevMessages]
      })
      toast.success("New anonymous message received!", {
        icon: '🎉',
        className: 'bg-primary text-primary-foreground border-none shadow-lg'
      })
    })

    return () => {
      pusher.unsubscribe(`user-${username}`)
    }
  }, [session])



  if (status === 'loading') {
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
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        <Link href="/sign-in">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  const {username} = session?.user as User
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
    toast(
      <div>
        <p className="font-semibold">URL copied</p>
        <p className="text-sm text-muted-foreground">
          Profile URL has been copied to clipboard
        </p>
      </div>
    )
  }

  return (
    <div className="my-6 mx-4 md:mx-8 lg:mx-auto p-4 md:p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl w-full max-w-6xl relative z-10 transition-all duration-500">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 pb-2">User Dashboard</h1>

      <div className="mb-8 p-6 bg-background/50 rounded-2xl border border-border/30 shadow-inner">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Copy Your Unique Link</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-grow p-3 rounded-xl bg-input text-foreground border border-border/50 outline-none cursor-not-allowed opacity-70"
          />
          <Button onClick={copyToClipboard} className="hover:scale-105 transition-transform px-6">
            {hasCopied ? "Copied! ✓" : "Copy"}
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Send me an anonymous message!',
                  url: profileUrl,
                })
              } else {
                window.open(`https://twitter.com/intent/tweet?text=Send me an anonymous message!&url=${profileUrl}`, '_blank')
              }
            }} 
            className="hover:scale-105 transition-transform px-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Link href="/dashboard/analytics" className="block mb-10 transition-transform hover:scale-[1.01] duration-300 group">
        <div className="p-8 rounded-3xl relative overflow-hidden shadow-2xl border border-primary/30 bg-card/60 backdrop-blur-xl flex flex-col items-center text-center hover:bg-card/80 transition-colors">
          {/* Decorative Glowing Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-400 to-primary group-hover:via-pink-400 transition-all duration-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500"></div>

          <span className="text-sm font-semibold tracking-wider text-primary uppercase mb-2 relative z-10 flex items-center gap-2">
            Lifetime Analytics
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">View Details &rarr;</span>
          </span>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 drop-shadow-sm">
              {totalMessages}
            </span>
            <span className="text-3xl font-bold text-muted-foreground">Messages</span>
          </div>
        </div>
      </Link>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Recent Messages 
          <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{messages.length}</span>
        </h2>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors hidden sm:flex">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Inbox
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" /> Clear your entire inbox?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all anonymous messages you have received. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearInbox} disabled={isClearing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isClearing ? "Clearing..." : "Yes, clear inbox"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="relative group">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-foreground/90 text-background text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            Refresh Messages
          </div>
        </div>
      </div>
      </div>

      <div className="mt-8 columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[140px] bg-card/40 border border-border/40 rounded-2xl animate-pulse mb-6 break-inside-avoid"></div>
          ))
        ) : messages.length > 0 ? (
          <>
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div 
                  key={message._id?.toString?.() ?? index} 
                  ref={isLast ? lastElementRef : null}
                  className="break-inside-avoid"
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </div>
              );
            })}
            {isFetchingMore && (
              <div className="w-full flex justify-center py-8 break-inside-avoid col-span-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-card/20 border border-border/30 rounded-3xl text-center break-inside-avoid col-span-full">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Your inbox is empty</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              Share your unique link on Instagram, Twitter, or WhatsApp to start receiving anonymous messages.
            </p>
            <Button onClick={copyToClipboard} size="lg" className={`rounded-full shadow-[0_0_20px_-5px_rgba(100,0,255,0.4)] hover:scale-105 transition-all px-8 ${hasCopied ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)]' : ''}`}>
              {hasCopied ? "Copied! ✓" : "Copy Profile Link"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage
