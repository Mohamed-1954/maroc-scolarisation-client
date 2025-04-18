import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Transaction {
  id: string
  type: "entrée" | "sortie"
  amount: number
  date: string
  description: string
  category: string
  person: {
    name: string
    avatar?: string
    initials: string
  }
}

const transactions: Transaction[] = [
  {
    id: "t1",
    type: "entrée",
    amount: 5000,
    date: "2023-06-15",
    description: "Don mensuel",
    category: "Parrainage",
    person: {
      name: "Ahmed Benali",
      initials: "AB",
    },
  },
  {
    id: "t2",
    type: "sortie",
    amount: 1200,
    date: "2023-06-14",
    description: "Frais de scolarité",
    category: "Éducation",
    person: {
      name: "Fatima Zahra",
      initials: "FZ",
    },
  },
  {
    id: "t3",
    type: "entrée",
    amount: 3000,
    date: "2023-06-12",
    description: "Don ponctuel",
    category: "Général",
    person: {
      name: "Karim Idrissi",
      initials: "KI",
    },
  },
  {
    id: "t4",
    type: "sortie",
    amount: 800,
    date: "2023-06-10",
    description: "Fournitures scolaires",
    category: "Fourniture",
    person: {
      name: "Yasmine Alaoui",
      initials: "YA",
    },
  },
  {
    id: "t5",
    type: "entrée",
    amount: 10000,
    date: "2023-06-08",
    description: "Don entreprise",
    category: "Général",
    person: {
      name: "Société ABC",
      initials: "SA",
    },
  },
  {
    id: "t6",
    type: "sortie",
    amount: 1500,
    date: "2023-06-05",
    description: "Événement caritatif",
    category: "Événement",
    person: {
      name: "Nadia Tazi",
      initials: "NT",
    },
  },
  {
    id: "t7",
    type: "entrée",
    amount: 2000,
    date: "2023-06-01",
    description: "Don spécial",
    category: "Général",
    person: {
      name: "Omar El Ghazali",
      initials: "OG",
    },
  },
]

export function RecentTransactions({ extended = false }: { extended?: boolean }) {
  const displayTransactions = extended ? transactions : transactions.slice(0, 5)

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction, index) => (
        <>
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={transaction.person.avatar || "/placeholder.svg"} alt={transaction.person.name} />
                <AvatarFallback>{transaction.person.initials}</AvatarFallback>
              </Avatar>
              <div>

                <p className="text-sm font-medium leading-none">{transaction.person.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p
                className={`text-sm font-medium ${transaction.type === "entrée"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
                  }`}
              >
                {transaction.type === "entrée" ? "+" : "-"}
                {transaction.amount} MAD
              </p>
              <Badge variant={transaction.type === "entrée" ? "outline" : "secondary"} className="text-xs">
                {transaction.category}
              </Badge>
            </div>
          </div>
          {index < displayTransactions.length - 1 && <Separator />}
        </>
      ))}
    </div>
  )
}
