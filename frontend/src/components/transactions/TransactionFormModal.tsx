import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useBudget } from "@/context/BudgetContext"

export function TransactionFormModal({ 
  open, 
  onOpenChange,
  transactionToEdit
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
  transactionToEdit?: { id: string, type: "Income"|"Expense", amount: number, category: string, date: string, note?: string | null } | null
}) {
  const { addTransaction, updateTransaction, categories } = useBudget()

  const [type, setType] = useState<"Income" | "Expense">("Expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")

  const availableCategories = categories.filter(c => c.type === type)

  // Initialize state when editing or opening
  useEffect(() => {
    if (open) {
      if (transactionToEdit) {
        setType(transactionToEdit.type)
        setAmount(transactionToEdit.amount.toString())
        setCategory(transactionToEdit.category)
        setDate(new Date(transactionToEdit.date).toISOString().split("T")[0])
        setNote(transactionToEdit.note || "")
      } else {
        setType("Expense")
        setAmount("")
        setDate(new Date().toISOString().split("T")[0])
        setNote("")
        // Category will be auto-set by the other useEffect
      }
    }
  }, [open, transactionToEdit])

  // Auto-select first available category when type changes
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.find(c => c.name === category)) {
      setCategory(availableCategories[0].name)
    }
  }, [type, availableCategories, category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || isNaN(Number(amount))) return
    if (!category) return

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        note
      })
    } else {
      addTransaction({
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        note
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transactionToEdit ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Button 
              type="button" 
              className={`flex-1 text-base py-6 transition-colors ${
                type === "Expense" 
                  ? "bg-rose-500 hover:bg-rose-600 text-white" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setType("Expense")}
            >
              Expense
            </Button>
            <Button 
              type="button" 
              className={`flex-1 text-base py-6 transition-colors ${
                type === "Income" 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setType("Income")}
            >
              Income
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {availableCategories.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Note (Optional)</label>
            <Input 
              type="text" 
              placeholder="What was this for?" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
