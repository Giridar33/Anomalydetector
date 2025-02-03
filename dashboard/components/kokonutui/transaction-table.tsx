import { cn } from "@/lib/utils"
import { Wallet, ShoppingCart, CreditCard, type LucideIcon } from "lucide-react"

interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing"
  category: string
  icon: LucideIcon
  timestamp: string
  status: "Credit" | "pending" | "Debit"
}

interface TransactionTableProps {
  transactions?: Transaction[]
  className?: string
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "09899876",
    amount: "$999.00",
    type: "incoming",
    category: "Saving",
    icon: ShoppingCart,
    timestamp: "2023-05-01, 2:45 PM",
    status: "Credit",
  },
  {
    id: "2",
    title: "12097865",
    amount: "$4,500.00",
    type: "incoming",
    category: "Current",
    icon: Wallet,
    timestamp: "2023-05-01, 9:00 AM",
    status: "Credit",
  },
  {
    id: "3",
    title: "56438765",
    amount: "$15.99",
    type: "outgoing",
    category: "Saving",
    icon: CreditCard,
    timestamp: "2023-04-30, 11:30 PM",
    status: "Debit",
  },
  // Add more transactions here...
]

export default function TransactionTable({ transactions = TRANSACTIONS, className }: TransactionTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-100 dark:bg-zinc-800">
            <th className="p-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Transaction
            </th>
            <th className="p-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="p-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Category
            </th>
            <th className="p-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Date
            </th>
            <th className="p-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td className="p-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "p-2 rounded-lg mr-3",
                      "bg-zinc-100 dark:bg-zinc-800",
                      "border border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    <transaction.icon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{transaction.title}</div>
                </div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <div
                  className={cn(
                    "text-sm font-medium",
                    transaction.type === "incoming"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {transaction.type === "incoming" ? "+" : "-"}
                  {transaction.amount}
                </div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{transaction.category}</div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{transaction.timestamp}</div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <span
                  className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", {
                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100":
                      transaction.status === "Credit",
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100":
                      transaction.status === "pending",
                    "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100": transaction.status === "Debit",
                  })}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

