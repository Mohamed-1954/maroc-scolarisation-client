import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardChart } from "./-components/dashboard-chart"
import { RecentTransactions } from "./-components/recent-transactions"
import { DonorsList } from "./-components/donors-list"
import { StatCards } from "./-components/section-cards";

export const Route = createFileRoute("/(protected)/_mainLayout/_dashboard/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur le tableau de bord de Maroc Scolarisation</p>
      </div>

      <StatCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="donors">Donateurs</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Aperçu financier</CardTitle>
                <CardDescription>Dons et dépenses des 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
                <CardDescription>Les 5 dernières transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donateurs récents</CardTitle>
              <CardDescription>Les derniers donateurs ajoutés à la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <DonorsList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les transactions</CardTitle>
              <CardDescription>Historique complet des transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions extended />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
