import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import type { MonthlyStats } from "@/types"

interface StatsCardsProps {
  stats: MonthlyStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { totalIncome, totalExpenses, balance } = stats

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Receitas</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="bg-emerald-100 rounded-full p-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Despesas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${balance >= 0 ? "border-l-blue-500" : "border-l-orange-500"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Saldo</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`rounded-full p-3 ${balance >= 0 ? "bg-blue-100" : "bg-orange-100"}`}>
              <Wallet className={`h-5 w-5 ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
