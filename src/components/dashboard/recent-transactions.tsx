import Link from "next/link"
import type { Transaction } from "@/types"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Últimas Transações</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions" className="flex items-center gap-1 text-sm text-muted-foreground">
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm">Nenhuma transação registrada ainda</p>
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((t) => {
              const category = getCategoryById(t.category_id)
              const isIncome = t.type === "income"
              return (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      {category?.icon || "💰"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                    {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
