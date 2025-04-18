import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Donor {
  id: string
  name: string
  email: string
  phone: string
  donationType: "général" | "parrainage"
  totalDonated: number
  lastDonation: string
  avatar?: string
  initials: string
}

const donors: Donor[] = [
  {
    id: "d1",
    name: "Ahmed Benali",
    email: "ahmed.benali@example.com",
    phone: "+212 6 12 34 56 78",
    donationType: "parrainage",
    totalDonated: 15000,
    lastDonation: "2023-06-15",
    initials: "AB",
  },
  {
    id: "d2",
    name: "Karim Idrissi",
    email: "karim.idrissi@example.com",
    phone: "+212 6 23 45 67 89",
    donationType: "général",
    totalDonated: 8000,
    lastDonation: "2023-06-12",
    initials: "KI",
  },
  {
    id: "d3",
    name: "Société ABC",
    email: "contact@abc.com",
    phone: "+212 5 22 33 44 55",
    donationType: "général",
    totalDonated: 25000,
    lastDonation: "2023-06-08",
    initials: "SA",
  },
  {
    id: "d4",
    name: "Nadia Tazi",
    email: "nadia.tazi@example.com",
    phone: "+212 6 34 56 78 90",
    donationType: "parrainage",
    totalDonated: 12000,
    lastDonation: "2023-06-05",
    initials: "NT",
  },
]

export function DonorsList() {
  return (
    <div className="space-y-4">
      {donors.map((donor) => (
        <Card key={donor.id} className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={donor.avatar || "/placeholder.svg"} alt={donor.name} />
                <AvatarFallback>{donor.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{donor.name}</p>
                  <Badge variant={donor.donationType === "parrainage" ? "default" : "outline"}>
                    {donor.donationType}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <p>{donor.email}</p>
                  <span className="mx-1">•</span>
                  <p>{donor.phone}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <p>
                    <span className="font-medium">{donor.totalDonated} MAD</span> au total
                  </p>
                  <p>
                    Dernier don:{" "}
                    <span className="font-medium">
                      {new Date(donor.lastDonation).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-t">
              <Button variant="ghost" className="flex-1 rounded-none text-xs h-10">
                Voir détails
              </Button>
              <div className="border-r h-10" />
              <Button variant="ghost" className="flex-1 rounded-none text-xs h-10">
                Enregistrer un don
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}