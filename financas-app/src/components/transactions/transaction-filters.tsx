"use client"

import { DEFAULT_CATEGORIES } from "@/lib/categories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Filters {
  month: string
  year: string
  type: string
  categoryId: string
}

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const MONTHS = [
  { value: "1", label: "Janeiro" }, { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" }, { value: "4", label: "Abril" },
  { value: "5", label: "Maio" }, { value: "6", label: "Junho" },
  { value: "7", label: "Julho" }, { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" }, { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro" },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const hasActiveFilters = filters.type || filters.categoryId

  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value })
  }

  function clearFilters() {
    onChange({ ...filters, type: "", categoryId: "" })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select value={filters.month} onValueChange={(v) => update("month", v)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.year} onValueChange={(v) => update("year", v)}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type || "all"} onValueChange={(v) => update("type", v === "all" ? "" : v)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.categoryId || "all"} onValueChange={(v) => update("categoryId", v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {DEFAULT_CATEGORIES.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  )
}
