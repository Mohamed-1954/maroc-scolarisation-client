import { createFileRoute } from '@tanstack/react-router'

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DonorsTable } from "./-components/data-table/donors-table"
import { getDonorsQueryOptions } from '@/services/donors/queries'
import { useQuery } from '@tanstack/react-query'
import { columns } from './-components/data-table/columns'
import DonorDialog from './-components/action-dialogs/donor-dialog-base'

export const Route = createFileRoute('/(protected)/_mainLayout/donors/')({
  component: DonorsPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDonorsQueryOptions(false));
  },
})

function DonorsPage() {
  const { data: donors, isError, isSuccess, isFetching } = useQuery(getDonorsQueryOptions(false));

  const status = {
    error: isError,
    success: isSuccess,
    pending: isFetching,
  };

  return <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donateurs</h1>
        <p className="text-muted-foreground">Gérez les donateurs et leurs préférences de don</p>
      </div>
      <DonorDialog type='create'>
        <Button>
          <PlusCircle />
          Ajouter un donateur
        </Button>
      </DonorDialog>
    </div>

    <DonorsTable data={donors || []} columns={columns} status={status} />
  </div>
}