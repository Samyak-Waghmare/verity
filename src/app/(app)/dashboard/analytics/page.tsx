'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, Eye, MessageSquare, TrendingUp, ArrowLeft } from "lucide-react"
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ views: 0, messages: 0 })
  const [chartData, setChartData] = useState<{day: string, count: number, fullDate: string}[]>([])

  const fetchStatsAndMessages = useCallback(async () => {
    try {
      const [statsRes, messagesRes] = await Promise.all([
        axios.get('/api/accept-messages'),
        axios.get('/api/get-messages')
      ])
      
      setStats({
        views: statsRes.data.profileViews || 0,
        messages: statsRes.data.totalMessages || 0
      })

      // Process messages for chart (last 7 days)
      const msgs = messagesRes.data.messages || []
      
      // Initialize last 7 days array
      const last7Days = Array.from({length: 7}).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return {
          dateString: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: 0
        }
      })

      // Aggregate messages
      msgs.forEach((m: any) => {
        if (!m.createdAt) return
        const mDate = new Date(m.createdAt).toISOString().split('T')[0]
        const dayEntry = last7Days.find(d => d.dateString === mDate)
        if (dayEntry) {
          dayEntry.count++
        }
      })

      setChartData(last7Days.map(d => ({
        day: d.dayName,
        fullDate: d.fullDate,
        count: d.count
      })))

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatsAndMessages()
  }, [fetchStatsAndMessages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const conversionRate = stats.views > 0 
    ? ((stats.messages / stats.views) * 100).toFixed(1) 
    : '0.0'

  const maxChartCount = Math.max(...chartData.map(d => d.count), 5) // Minimum height scale is 5

  return (
    <div className="my-6 mx-4 md:mx-8 lg:mx-auto p-4 md:p-8 w-full max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your public profile performance</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
            <Eye className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.views}</div>
            <p className="text-xs text-muted-foreground mt-1">Total lifetime visits to your link</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Received</CardTitle>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.messages}</div>
            <p className="text-xs text-muted-foreground mt-1">Total anonymous messages</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 backdrop-blur-xl border-primary/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-primary">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{conversionRate}%</div>
            <p className="text-xs text-primary/80 mt-1">Percentage of visitors who sent a message</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground">Message Volume</h3>
            <p className="text-sm text-muted-foreground">Messages received over the last 7 days</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-primary/10 rounded-xl text-primary font-semibold text-sm">
            Last 7 Days
          </div>
        </div>
        
        <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-6 pt-10">
          {chartData.map((data, idx) => {
            const heightPercent = (data.count / maxChartCount) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="w-full relative flex flex-col items-center justify-end h-full">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-10 pointer-events-none shadow-xl">
                    {data.count} msgs
                    <div className="text-[10px] opacity-80 font-normal">{data.fullDate}</div>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-xl group-hover:from-purple-500 group-hover:to-primary transition-all duration-300 relative shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }} // Minimum 2% height so empty days have a tiny bump
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-xl"></div>
                  </div>
                </div>
                {/* X-Axis Label */}
                <span className="mt-4 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  {data.day}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
