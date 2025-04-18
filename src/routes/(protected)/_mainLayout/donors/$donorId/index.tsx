import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDonorByIdQueryOptions } from '@/services/donors/queries'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonorDetails } from "./-components/donor-details"
import { DonorTransactions } from "./-components/donor-transactions"
import { DonorStudents } from "./-components/donor-students"
import DonorDialog from '../-components/action-dialogs/donor-dialog-base'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export const Route = createFileRoute('/(protected)/_mainLayout/donors/$donorId/')({
  component: Donor,
  loader: ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDonorByIdQueryOptions(params.donorId))
  },
})

function Donor() {
  const { donorId } = Route.useParams();
  const { data: donor, isSuccess, isLoading, isError } = useQuery(getDonorByIdQueryOptions(donorId));

  if (isLoading) {
    return <DonorProfileSkeleton />;
  }

  if (isError || !isSuccess || !donor) {
    return <DonorProfileSkeleton showErrorToast />;
  }

  const showSkeletons = (isSuccess && !donor) || isLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/donors">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Détails du donateur</h1>
            <p className="text-muted-foreground">Informations complètes et historique des dons</p>
          </div>
        </div>
        <Button asChild>
          <DonorDialog type="update" donor={donor}>
            <Button variant="default">
              <PenLine className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DonorDialog>
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Informations</TabsTrigger>
          <TabsTrigger value="transactions">Historique des dons</TabsTrigger>
          <TabsTrigger value="students">Élèves parrainés</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <DonorDetails donor={donor} showSkeletons={showSkeletons} />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des dons</CardTitle>
              <CardDescription>Tous les dons effectués par ce donateur</CardDescription>
            </CardHeader>
            <CardContent>
              <DonorTransactions id={donor.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Élèves parrainés</CardTitle>
              <CardDescription>Liste des élèves soutenus par ce donateur</CardDescription>
            </CardHeader>
            <CardContent>
              <DonorStudents id={donor.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DonorProfileSkeleton({ showErrorToast = false }: { showErrorToast?: boolean }) {
  React.useEffect(() => {
    if (showErrorToast) {
      toast("Erreur", {
        description: "Impossible de charger les données du donateur.",
      });
    }
  }, [showErrorToast, toast]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/donors">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Détails du donateur</h1>
            <p className="text-muted-foreground">Informations complètes et historique des dons</p>
          </div>
        </div>
        <Button asChild>
          <Button variant="default">
            <PenLine className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-6 w-40" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-1 border-b pb-2 last:border-b-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="col-span-2 h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-1 border-b pb-2 last:border-b-0">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="col-span-2 h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
