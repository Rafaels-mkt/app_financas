"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getCategoryById } from "@/lib/categories"
import type { Transaction } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "./transaction-form"
import { Pencil, Trash2 } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  onRefresh: () => void
}

export function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return
    const supabase = createClient()
    await supabase.from("transactions").delete().eq("id", id)
    onRefresh()
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">Nenhuma transação encontrada</p>
        <p className="text-sm">Adicione sua primeira transação clicando no botão acima.</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y">
        {transactions.map((t) => {
          const category = getCategoryById(t.category_id)
          const isIncome = t.type === "income"

          return (
            <div key={t.id} className="flex items-center justify-between py-3.5 px-1 group">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${category?.color}20` }}
                >
                  {category?.icon || "💰"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                    <Badge variant={isIncome ? "income" : "expense"} className="text-xs py-0">
                      {category?.name}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={`font-semibold text-sm ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                  {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingTransaction(t)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editingTransaction && (
        <TransactionForm
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={onRefresh}
          transaction={editingTransaction}
        />
      )}
    </>
  )
}
