"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_CATEGORIES, getCategoriesByType } from "@/lib/categories"
import type { Transaction, TransactionType } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction | null
}

export function TransactionForm({ open, onClose, onSuccess, transaction }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type || "expense")
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "")
  const [description, setDescription] = useState(transaction?.description || "")
  const [categoryId, setCategoryId] = useState(transaction?.category_id || "")
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const categories = getCategoriesByType(type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const numAmount = parseFloat(amount.replace(",", "."))
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Informe um valor válido.")
      return
    }
    if (!categoryId) {
      setError("Selecione uma categoria.")
      return
    }

    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Sessão expirada."); setLoading(false); return }

    const payload = {
      user_id: user.id,
      type,
      amount: numAmount,
      description,
      category_id: categoryId,
      date,
    }

    const { error: dbError } = transaction
      ? await supabase.from("transactions").update(payload).eq("id", transaction.id)
      : await supabase.from("transactions").insert(payload)

    if (dbError) {
      setError("Erro ao salvar transação.")
      setLoading(false)
      return
    }

    onSuccess()
    onClose()
  }

  function handleTypeChange(newType: TransactionType) {
    setType(newType)
    setCategoryId("")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-md p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                type === "income"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-border text-muted-foreground hover:border-emerald-300"
              }`}
            >
              ↑ Receita
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                type === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-border text-muted-foreground hover:border-red-300"
              }`}
            >
              ↓ Despesa
            </button>
          </div>

          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Almoço, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {transaction ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
