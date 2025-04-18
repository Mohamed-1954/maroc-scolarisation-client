import { useLocation } from "@tanstack/react-router"
import { BarChart3, CreditCard, FileText, Home, Users, UserPlus, type LucideIcon } from "lucide-react"

interface RoutesMenuItem {
  label: string
  icon: LucideIcon
  href: string
  active: boolean
}

export function RoutesMenu(): RoutesMenuItem[] {
  const { pathname } = useLocation()
  return [
    {
      label: "Tableau de bord",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Donateurs",
      icon: Users,
      href: "/donors",
      active: pathname === "/donors",
    },
    {
      label: "Élèves",
      icon: UserPlus,
      href: "/students",
      active: pathname === "/students",
    },
    {
      label: "Transactions",
      icon: CreditCard,
      href: "/transactions",
      active: pathname === "/transactions",
    },
    {
      label: "Rapports",
      icon: FileText,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Statistiques",
      icon: BarChart3,
      href: "/statistics",
      active: pathname === "/statistics",
    },
  ]
}