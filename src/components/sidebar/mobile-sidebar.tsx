import React from "react"
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "../theme-toggle"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { RoutesMenu } from "./routes-menu"

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-xs">
        <div className="pt-4 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Logo" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <span className="font-bold text-lg">Maroc Scolarisation</span>
          </Link>
        </div>
        <div className="border-t">
          <div className="p-4">
            <nav className="flex flex-col gap-2">
              {RoutesMenu().map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <SheetFooter>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Thème</span>
            <ThemeToggle />
          </div>
          <div className="border-t py-4">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span>Admin</span>
                <span className="text-xs text-muted-foreground">admin@example.com</span>
              </div>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}