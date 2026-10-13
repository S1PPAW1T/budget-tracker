import React, { useState, useEffect, useRef } from "react"
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
  transactionToEdit?: { id: string, type: "Income"|"Expense", amount: number, category: string, date: string, note?: string | null, destinationCategoryId?: string | null } | null
}) {
  const { addTransaction, updateTransaction, categories } = useBudget()

  const [type, setType] = useState<"Income" | "Expense">("Expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [destinationCategoryId, setDestinationCategoryId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")
  const [error, setError] = useState<{ field: "amount" | "category" | "destination" | "date", message: string } | null>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const destinationRef = useRef<HTMLSelectElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const availableCategories = categories.filter(c => c.type === type)
  const expenseCategories = categories.filter(c => c.type === "Expense")
  const isTransfer = type === "Income" && category.toLowerCase() === "transfer"

  // Initialize state when editing or opening
  useEffect(() => {
    if (open) {
      setError(null)
      if (transactionToEdit) {
        setType(transactionToEdit.type)
        setAmount(transactionToEdit.amount.toString())
        setCategory(transactionToEdit.category)
        setDestinationCategoryId(transactionToEdit.destinationCategoryId || "")
        setDate(new Date(transactionToEdit.date).toISOString().split("T")[0])
        setNote(transactionToEdit.note || "")
      } else {
        setType("Expense")
        setAmount("")
        setDestinationCategoryId("")
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
    
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError({ field: "amount", message: "Enter an amount greater than zero." })
      amountRef.current?.focus()
      return
    }
    if (!category) {
      setError({ field: "category", message: "Choose a category to continue." })
      categoryRef.current?.focus()
      return
    }
    if (isTransfer && !destinationCategoryId) {
      setError({ field: "destination", message: "Choose an expense category for this transfer." })
      destinationRef.current?.focus()
      return
    }
    if (!date || Number.isNaN(new Date(date).getTime())) {
      setError({ field: "date", message: "Enter a valid date." })
      dateRef.current?.focus()
      return
    }
    setError(null)

    const transferDestination = isTransfer ? destinationCategoryId : null

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        note,
        destinationCategoryId: transferDestination
      })
    } else {
      addTransaction({
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        note,
        destinationCategoryId: transferDestination
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} labelledBy="transaction-dialog-title">
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="transaction-dialog-title">{transactionToEdit ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-4">
          <div className="flex gap-2 rounded-xl bg-secondary p-1">
            <Button 
              type="button" 
              className={`flex-1 text-sm py-5 transition-colors ${
                type === "Expense" 
                  ? "bg-card text-foreground shadow-sm hover:bg-card"
                  : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
              }`}
              onClick={() => { setType("Expense"); setError(null) }}
            >
              Expense
            </Button>
            <Button 
              type="button" 
              className={`flex-1 text-sm py-5 transition-colors ${
                type === "Income" 
                  ? "bg-card text-foreground shadow-sm hover:bg-card"
                  : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
              }`}
              onClick={() => { setType("Income"); setError(null) }}
            >
              Income
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="transaction-amount" className="text-sm font-medium">Amount</label>
            <Input 
              id="transaction-amount"
              ref={amountRef}
              type="number" 
              min="0.01"
              step="0.01"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(null) }}
              aria-invalid={error?.field === "amount"}
              aria-describedby={error?.field === "amount" ? "transaction-amount-error" : undefined}
              required
            />
            {error?.field === "amount" && <p id="transaction-amount-error" className="text-xs text-destructive">{error.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="transaction-category" className="text-sm font-medium">Category</label>
            <Select 
              id="transaction-category"
              ref={categoryRef}
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setError(null) }}
              aria-invalid={error?.field === "category"}
              aria-describedby={error?.field === "category" ? "transaction-category-error" : undefined}
              required
            >
              {availableCategories.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </Select>
            {error?.field === "category" && <p id="transaction-category-error" className="text-xs text-destructive">{error.message}</p>}
          </div>

          {isTransfer && (
            <div className="space-y-2">
              <label htmlFor="transfer-destination" className="text-sm font-medium">Transfer into expense category</label>
              <Select
                id="transfer-destination"
                ref={destinationRef}
                value={destinationCategoryId}
                onChange={(e) => { setDestinationCategoryId(e.target.value); setError(null) }}
                aria-invalid={error?.field === "destination"}
                aria-describedby={error?.field === "destination" ? "transfer-destination-error" : "transfer-destination-help"}
                required
              >
                <option value="" disabled>Select a category</option>
                {expenseCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {error?.field === "destination" && <p id="transfer-destination-error" className="text-xs text-destructive">{error.message}</p>}
              <p id="transfer-destination-help" className="text-xs text-muted-foreground">This amount will increase what you can spend in the selected category this month.</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="transaction-date" className="text-sm font-medium">Date</label>
            <Input 
              id="transaction-date"
              ref={dateRef}
              type="date" 
              value={date}
              onChange={(e) => { setDate(e.target.value); setError(null) }}
              aria-invalid={error?.field === "date"}
              aria-describedby={error?.field === "date" ? "transaction-date-error" : undefined}
              required
            />
            {error?.field === "date" && <p id="transaction-date-error" className="text-xs text-destructive">{error.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="transaction-note" className="text-sm font-medium">Note (Optional)</label>
            <Input 
              id="transaction-note"
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
