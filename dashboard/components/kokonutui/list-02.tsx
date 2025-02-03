import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Wallet, ShoppingCart, CreditCard, type LucideIcon } from "lucide-react"
import FileUpload from './file-upload-demo'

interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing"
  category: string  
  icon: LucideIcon
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface List02Props {
  transactions?: Transaction[]
  className?: string
}

const categoryStyles = {
  shopping: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  food: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  transport: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  entertainment: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Apple Store Purchase",
    amount: "$999.00",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Salary Deposit",
    amount: "$4,500.00",
    type: "incoming",
    category: "transport",
    icon: Wallet,
    timestamp: "Today, 9:00 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
  {
    id: "4",
    title: "Apple Store Purchase",
    amount: "$999.00",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "5",
    title: "Supabase Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
  {
    id: "6",
    title: "Vercel Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
]

export default function List02({ transactions = TRANSACTIONS, className }: List02Props) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Upload Latest transaction
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1"></span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Today</span>
        </div>

        <div className="space-y-1">
        <FileUpload  />
        </div>
      </div>
    </div>
  )
}

