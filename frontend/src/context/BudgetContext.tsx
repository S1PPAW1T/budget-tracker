import React, { createContext, useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, Transaction as ApiTransaction, Category as ApiCategory, Budget as ApiBudget } from "@/lib/api"

export interface Transaction extends Omit<ApiTransaction, "category"> {
  category: string
}

export interface Budget extends Omit<ApiBudget, "category"> {
  category: string
}

export interface Category extends ApiCategory {}

interface BudgetContextType {
  transactions: Transaction[]
  budgets: Budget[]
  categories: Category[]
  isLoading: boolean
  addTransaction: (tx: { amount: number, date: string, type: "Income" | "Expense", note?: string, category: string }) => void
  updateTransaction: (id: string, tx: { amount: number, date: string, type: "Income" | "Expense", note?: string, category: string }) => void
  updateBudget: (categoryName: string, newLimit: number) => void
  addCategory: (name: string, type: "Income" | "Expense") => void
  deleteCategory: (name: string) => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const { data: transactions = [], isLoading: isLoadingTx } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get<ApiTransaction[]>('/transactions')
      return res.data
    }
  })

  const { data: categories = [], isLoading: isLoadingCat } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories')
      return res.data
    }
  })

  const { data: budgets = [], isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const res = await api.get<ApiBudget[]>('/budgets')
      return res.data
    }
  })

  const addTxMutation = useMutation({
    mutationFn: async (tx: Omit<Transaction, "id" | "category">) => {
      await api.post('/transactions', tx)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  })

  const updateBudgetMutation = useMutation({
    mutationFn: async ({ categoryId, limit }: { categoryId: string, limit: number }) => {
      await api.put(`/budgets/${categoryId}`, { limit })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] })
  })

  const addCatMutation = useMutation({
    mutationFn: async ({ name, type }: { name: string, type: string }) => {
      await api.post('/categories', { name, type })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    }
  })

  const deleteCatMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.delete(`/categories/${name}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })

  const addTransaction = (tx: { amount: number, date: string, type: "Income" | "Expense", note?: string, category: string }) => {
    const cat = categories.find(c => c.name === tx.category)
    if (cat) {
      addTxMutation.mutate({ 
        amount: tx.amount, 
        date: tx.date, 
        type: tx.type, 
        note: tx.note, 
        categoryId: cat.id 
      })
    }
  }

  const updateTxMutation = useMutation({
    mutationFn: async ({ id, tx }: { id: string, tx: Omit<Transaction, "id" | "category"> }) => {
      await api.put(`/transactions/${id}`, tx)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  })

  const updateTransaction = (id: string, tx: { amount: number, date: string, type: "Income" | "Expense", note?: string, category: string }) => {
    const cat = categories.find(c => c.name === tx.category)
    if (cat) {
      updateTxMutation.mutate({ 
        id,
        tx: {
          amount: tx.amount, 
          date: tx.date, 
          type: tx.type, 
          note: tx.note, 
          categoryId: cat.id 
        }
      })
    }
  }

  const updateBudget = (categoryName: string, newLimit: number) => {
    const cat = categories.find(c => c.name === categoryName)
    if (cat) {
      updateBudgetMutation.mutate({ categoryId: cat.id, limit: newLimit })
    }
  }

  const addCategory = (name: string, type: "Income" | "Expense") => {
    addCatMutation.mutate({ name, type })
  }

  const deleteCategory = (name: string) => {
    deleteCatMutation.mutate(name)
  }

  const isLoading = isLoadingTx || isLoadingCat || isLoadingBudgets

  // We map the category objects over the transactions/budgets in case the backend doesn't populate perfectly.
  const adaptedTransactions = transactions.map(tx => ({
    ...tx,
    category: tx.category?.name || "Unknown",
  })) as any[]

  const adaptedBudgets = budgets.map(b => ({
    ...b,
    category: b.category?.name || "Unknown"
  })) as any[]

  return (
    <BudgetContext.Provider value={{ 
      transactions: adaptedTransactions, 
      budgets: adaptedBudgets, 
      categories, 
      isLoading,
      addTransaction, 
      updateTransaction,
      updateBudget, 
      addCategory, 
      deleteCategory 
    }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}
