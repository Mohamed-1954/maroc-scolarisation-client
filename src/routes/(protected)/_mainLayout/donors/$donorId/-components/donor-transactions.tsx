import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DonorTransactionsProps {
  id: string
}

export function DonorTransactions({ id }: DonorTransactionsProps) {
  
  const transactions = [
    {
      id: "t1",
      amount: 2000,
      date: "2023-06-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-06-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
    {
      id: "t2",
      amount: 2000,
      date: "2023-05-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-05-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
    {
      id: "t3",
      amount: 2000,
      date: "2023-04-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-04-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
    {
      id: "t4",
      amount: 3000,
      date: "2023-03-10",
      type: "général",
      method: "chèque",
      reference: "CHQ-2023-03-10",
      student: null,
    },
    {
      id: "t5",
      amount: 2000,
      date: "2023-03-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-03-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
    {
      id: "t6",
      amount: 2000,
      date: "2023-02-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-02-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
    {
      id: "t7",
      amount: 2000,
      date: "2023-01-15",
      type: "parrainage",
      method: "virement",
      reference: "VIR-2023-01-15",
      student: {
        name: "Fatima Zahra",
        initials: "FZ",
      },
    },
  ]

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card className="py-0" key={transaction.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="text-xs">
                    {new Date(transaction.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-semibold">
                    {new Date(transaction.date).toLocaleDateString("fr-FR", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{transaction.amount} MAD</p>
                    <Badge variant={transaction.type === "parrainage" ? "default" : "outline"}>
                      {transaction.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Réf: {transaction.reference}</span>
                    <span>•</span>
                    <span>Méthode: {transaction.method}</span>
                  </div>
                </div>
              </div>
              {transaction.student && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Pour:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={transaction.student.name} />
                      <AvatarFallback className="text-xs">{transaction.student.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{transaction.student.name}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center">
        <Button variant="outline">Charger plus</Button>
      </div>
    </div>
  )
}
