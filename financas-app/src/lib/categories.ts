import type { Category } from "@/types"

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "salary", name: "Salário", type: "income", color: "#10b981", icon: "💼" },
  { id: "freelance", name: "Freelance", type: "income", color: "#3b82f6", icon: "💻" },
  { id: "investments", name: "Investimentos", type: "income", color: "#8b5cf6", icon: "📈" },
  { id: "other_income", name: "Outras Receitas", type: "income", color: "#f59e0b", icon: "💰" },
  { id: "food", name: "Alimentação", type: "expense", color: "#ef4444", icon: "🍽️" },
  { id: "transport", name: "Transporte", type: "expense", color: "#f97316", icon: "🚗" },
  { id: "housing", name: "Moradia", type: "expense", color: "#6366f1", icon: "🏠" },
  { id: "health", name: "Saúde", type: "expense", color: "#ec4899", icon: "🏥" },
  { id: "education", name: "Educação", type: "expense", color: "#14b8a6", icon: "📚" },
  { id: "entertainment", name: "Lazer", type: "expense", color: "#f59e0b", icon: "🎬" },
  { id: "shopping", name: "Compras", type: "expense", color: "#84cc16", icon: "🛍️" },
  { id: "other_expense", name: "Outras Despesas", type: "expense", color: "#94a3b8", icon: "📦" },
]

export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((c) => c.id === id)
}

export function getCategoriesByType(type: "income" | "expense"): Category[] {
  return DEFAULT_CATEGORIES.filter((c) => c.type === type)
}
