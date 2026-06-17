'use client'
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { X, Copy, Download, MessageSquareReply, CheckCircle } from "lucide-react"
import { Message } from "@/model/User"
import { toast, useSonner } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useState } from "react"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete}: MessageCardProps) => {
  useSonner()
  const cardRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState(message.replyText || "")
  const [isReplying, setIsReplying] = useState(false)
  const [openReplyDialog, setOpenReplyDialog] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  const handleReplySubmit = async () => {
    setIsReplying(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/reply-message/${message._id}`, {
        replyText
      })
      toast.success(response.data.message)
      setOpenReplyDialog(false)
    } catch (err) {
      toast.error("Failed to post reply")
    } finally {
      setIsReplying(false)
    }
  }

  const handleDeleteConfirm = async() => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast(response.data.message)
    onMessageDelete(message._id.toString())
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  const handleExport = async () => {
    if (cardRef.current === null) {
      return
    }
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        filter: (node) => {
          return !node.classList?.contains('action-buttons');
        }
      })
      const link = document.createElement('a')
      link.download = `verity-message-${message._id}.png`
      link.href = dataUrl
      link.click()
      toast.success("Image exported! You can now share it to your story.")
    } catch (err) {
      toast.error("Failed to export image")
    }
  }

  return (
    <Card ref={cardRef} className="group relative overflow-hidden bg-card/60 backdrop-blur-md border-border/40 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl break-inside-avoid mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        <CardHeader className="flex flex-row justify-between items-start p-5 pb-2 relative z-10">
            <div className="flex-1">
              <span className="font-mono text-[10px] text-primary/60 tracking-widest uppercase">
                {new Date(message.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'
                })}
              </span>
            </div>
            <div className="action-buttons flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              <Dialog open={openReplyDialog} onOpenChange={setOpenReplyDialog}>
                <DialogTrigger asChild>
                  <div className="relative group/btn">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary text-muted-foreground">
                      <MessageSquareReply className="w-4 h-4"/>
                    </Button>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Reply Publicly
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Reply Publicly</DialogTitle>
                    <DialogDescription>
                      This reply will be visible on your public profile along with the anonymous message.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-sm italic">
                      "{message.content}"
                    </div>
                    <Textarea 
                      placeholder="Type your reply here..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenReplyDialog(false)}>Cancel</Button>
                    <Button onClick={handleReplySubmit} disabled={isReplying || !replyText}>
                      {isReplying ? "Posting..." : "Post Reply"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="relative group/btn">
                <Button variant="ghost" size="icon" onClick={handleExport} className="h-8 w-8 hover:bg-primary/10 hover:text-primary text-muted-foreground">
                  <Download className="w-4 h-4"/>
                </Button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Export to Story
                </span>
              </div>

              <div className="relative group/btn">
                <Button variant="ghost" size="icon" onClick={handleCopy} className={`h-8 w-8 transition-colors ${hasCopied ? 'text-green-500 bg-green-500/10' : 'hover:bg-primary/10 hover:text-primary text-muted-foreground'}`}>
                  {hasCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4"/>}
                </Button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {hasCopied ? "Copied!" : "Copy"}
                </span>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative group/btn">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                      <X className="w-4 h-4"/>
                    </Button>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-destructive text-destructive-foreground text-xs font-medium rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Delete
                    </span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border border-border/50 rounded-xl shadow-2xl">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Delete Message?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-base">
                        This action cannot be undone. This will permanently delete this message from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-secondary">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Permanently</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 relative z-10 text-left">
           <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap break-words line-clamp-8">
             {message.content.replace(/\n{3,}/g, '\n\n')}
           </p>
        </CardContent>
    </Card>
  )
}

export default MessageCard
