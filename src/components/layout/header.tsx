"use client"

import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"
import { MobileNav } from "./mobile-nav"

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "Usuário"

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Olá,</span>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium hidden sm:block">{name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
