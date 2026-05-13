"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 border-r bg-card shrink-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <div className="bg-primary rounded-lg p-1.5">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-sm leading-tight">Rotina Financeira do Rafa</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t">
        <p className="text-xs text-muted-foreground">Rotina Financeira do Rafa v1.0</p>
      </div>
    </aside>
  )
}
