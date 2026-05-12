export type TransactionType = "income" | "expense"

export interface Category {
  id: string
  name: string
  type: TransactionType
  color: string
  icon: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category_id: string
  date: string
  created_at: string
  categories?: Category
}

export interface MonthlyStats {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface CategoryStats {
  category: string
  color: string
  total: number
  percentage: number
}
