import React from "react"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-6">
          <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Une erreur est survenue</h1>
          <p className="text-muted-foreground">
            Nous sommes désolés, une erreur inattendue s&apos;est produite. Notre équipe technique a été informée.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button onClick={reset} variant="outline" size="lg" className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
        </div>
        <div className="w-full rounded-md bg-muted p-4 text-left">
          <p className="text-xs font-mono text-muted-foreground">Code d&apos;erreur: {error.digest || "UNKNOWN"}</p>
        </div>
      </div>
    </div>
  )
}
