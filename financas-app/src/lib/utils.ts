import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Transaction } from "@/types"
import { getCategoryById } from "@/lib/categories"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date + "T00:00:00"))
}

export function exportTransactionsToCSV(transactions: Transaction[], filename = "transacoes.csv") {
  const headers = ["Data", "Tipo", "Descrição", "Categoria", "Valor (R$)"]

  const rows = transactions.map((t) => {
    const category = getCategoryById(t.category_id)
    return [
      formatDate(t.date),
      t.type === "income" ? "Receita" : "Despesa",
      `"${t.description.replace(/"/g, '""')}"`,
      category?.name ?? t.category_id,
      t.type === "expense"
        ? `-${t.amount.toFixed(2).replace(".", ",")}`
        : t.amount.toFixed(2).replace(".", ","),
    ]
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const summary = [
    [],
    ["", "", "", "Total Receitas", totalIncome.toFixed(2).replace(".", ",")],
    ["", "", "", "Total Despesas", `-${totalExpense.toFixed(2).replace(".", ",")}`],
    ["", "", "", "Saldo", balance.toFixed(2).replace(".", ",")],
  ]

  const csvContent = [
    headers.join(";"),
    ...rows.map((r) => r.join(";")),
    ...summary.map((r) => r.join(";")),
  ].join("\n")

  // BOM para Excel reconhecer UTF-8 com acentos corretamente
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
