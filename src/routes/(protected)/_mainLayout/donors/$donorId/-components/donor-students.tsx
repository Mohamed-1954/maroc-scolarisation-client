import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"

interface DonorStudentsProps {
  id: string
}

export function DonorStudents({ id }: DonorStudentsProps) {
  const students = [
    {
      id: "s1",
      name: "Fatima Zahra",
      age: 12,
      school: "École Primaire Al Fath",
      grade: "6ème année",
      sponsorshipStart: "2022-09-01",
      status: "active",
      initials: "FZ",
    },
    {
      id: "s2",
      name: "Mohammed Alami",
      age: 15,
      school: "Collège Ibn Sina",
      grade: "3ème année",
      sponsorshipStart: "2023-01-15",
      status: "active",
      initials: "MA",
    },
  ]

  return (
    <div className="space-y-4">
      {students.length > 0 ? (
        <>
          {students.map((student) => (
            <Card className="py-0" key={student.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={student.name} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{student.name}</p>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.age} ans • {student.grade} • {student.school}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Parrainage depuis:{" "}
                        {new Date(student.sponsorshipStart).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard">Voir détails</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Ce donateur ne parraine aucun élève actuellement.</p>
          <Button className="mt-4" asChild>
              <Link to="/dashboard">Associer un élève</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
