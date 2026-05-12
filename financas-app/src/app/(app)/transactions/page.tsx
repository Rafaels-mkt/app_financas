"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Transaction } from "@/types"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

const now = new Date()

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    type: "",
    categoryId: "",
  })

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = `${filters.year}-${String(filters.month).padStart(2, "0")}-01`
    const endDate = new Date(Number(filters.year), Number(filters.month), 0)
      .toISOString().split("T")[0]

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    if (filters.type) query = query.eq("type", filters.type)
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId)

    const { data } = await query
    setTransactions(data || [])
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas receitas e despesas</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-muted-foreground">
            {loading ? "Carregando..." : `${transactions.length} transação(ões)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionList transactions={transactions} onRefresh={fetchTransactions} />
          )}
        </CardContent>
      </Card>

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
