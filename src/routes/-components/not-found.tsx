import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-muted p-6">
          <FileQuestion className="h-12 w-12 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Page non trouvée</h1>
          <p className="text-muted-foreground">Désolé, nous n&apos;avons pas pu trouver la page que vous recherchez.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="w-full" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
        </div>
        <div className="w-full border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter l&apos;administrateur du
            système.
          </p>
        </div>
      </div>
    </div>
  )
}
