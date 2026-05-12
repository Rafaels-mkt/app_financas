"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-card border-r p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-2 py-3 mb-4 border-b">
              <div className="bg-primary rounded-lg p-1.5">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">FinançasFácil</span>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
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
          </div>
        </div>
      )}
    </div>
  )
}
