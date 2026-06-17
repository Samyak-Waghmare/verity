"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="w-10 h-10 rounded-full" disabled />
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border-border/50 hover:bg-secondary transition-all shadow-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
