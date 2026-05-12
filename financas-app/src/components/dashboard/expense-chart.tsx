"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { CategoryStats } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpenseChartProps {
  data: CategoryStats[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryStats }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="font-medium">{item.category}</p>
      <p className="text-sm text-muted-foreground">{formatCurrency(item.total)}</p>
      <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</p>
    </div>
  )
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm">Nenhuma despesa neste mês</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="total"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
