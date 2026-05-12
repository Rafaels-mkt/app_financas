"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Transaction, MonthlyStats, CategoryStats } from "@/types"
import { getCategoryById } from "@/lib/categories"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const now = new Date()

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year, setYear] = useState(String(now.getFullYear()))

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`
    const endDate = new Date(Number(year), Number(month), 0).toISOString().split("T")[0]

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    setTransactions(data || [])
    setLoading(false)
  }, [month, year])

  useEffect(() => { fetchData() }, [fetchData])

  const stats: MonthlyStats = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.totalIncome += t.amount
      else acc.totalExpenses += t.amount
      acc.balance = acc.totalIncome - acc.totalExpenses
      return acc
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 }
  )

  const categoryStatsMap: Record<string, CategoryStats> = {}
  const totalExpenses = stats.totalExpenses || 1
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = getCategoryById(t.category_id)
      if (!cat) return
      if (!categoryStatsMap[cat.id]) {
        categoryStatsMap[cat.id] = {
          category: cat.name,
          color: cat.color,
          total: 0,
          percentage: 0,
        }
      }
      categoryStatsMap[cat.id].total += t.amount
    })

  const categoryStats: CategoryStats[] = Object.values(categoryStatsMap)
    .map((s) => ({ ...s, percentage: (s.total / totalExpenses) * 100 }))
    .sort((a, b) => b.total - a.total)

  const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - i))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Resumo financeiro do mês</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Nova
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart data={categoryStats} />
            <RecentTransactions transactions={transactions.slice(0, 6)} />
          </div>
        </>
      )}

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}
