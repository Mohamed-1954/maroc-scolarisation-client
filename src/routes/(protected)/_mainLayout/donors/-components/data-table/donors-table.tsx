import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DonorType } from "@/types/donor"
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/components/table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  status: {
    error: boolean;
    success: boolean;
    pending: boolean;
  };
}

export function DonorsTable<TData, TValue>({
  columns,
  data,
  status,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrer par nom..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Type de don <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => table.getColumn("donorType")?.setFilterValue(undefined)}>
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("donorType")?.setFilterValue(DonorType.GENERAL)}>
                Général
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("donorType")?.setFilterValue(DonorType.SPONSORSHIP)}>
                Parrainage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Statut <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => table.getColumn("isActive")?.setFilterValue(undefined)}>
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("isActive")?.setFilterValue(true)}>
                Actif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("isActive")?.setFilterValue(false)}>
                Inactif
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef
                            .header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {status.pending ? (
              // Show only skeletons while loading
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow className="mb-0.5" key={index}>
                  <TableCell
                    colSpan={columns.length}
                    className="p-0"
                  >
                    <Skeleton className="w-full h-full p-8 rounded-none" />
                  </TableCell>
                </TableRow>
              ))
            ) : status.error ? (
              // Show error message if there's an error
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-max text-center"
                >
                  Error fetching data.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              // Show actual data if successful and has rows
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() && "selected"
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Show no results only if successful but empty
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-max text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
