
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { formatPhoneNumberIntl } from "react-phone-number-input";

import { DonorType, type Donor } from "@/types/donor";

import { firestoreTimestampsConverter } from "@/lib/firestore-timestamps-converter";
import type { FirestoreTimestamps } from "@/types/general";
import { ActionDropdownMenu } from "./action-dropdown-menu";

const getInitials = (name: string = ""): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();
};

export const columns: ColumnDef<Donor>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "fullName",
    header: "Donateur",
    cell: ({ row }) => {
      const donor = row.original;
      const avatarSrc = undefined;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={donor.fullName} />}
            <AvatarFallback>{getInitials(donor.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="max-w-[200px] truncate font-medium">
              {donor.fullName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {donor.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-center">Téléphone</div>,
    cell: ({ row }) => {
      const formattedPhone = row.original.phoneNumber
        ? formatPhoneNumberIntl(row.original.phoneNumber)
        : "N/A";
      return <div className="whitespace-nowrap text-center">{formattedPhone}</div>;
    },
  },
  {
    accessorKey: "donorType",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => {
      const typeText = row.original.donorType === DonorType.SPONSORSHIP
        ? "Parrainage"
        : "Général";
      const variant = row.original.donorType === DonorType.SPONSORSHIP
        ? "default"
        : "outline";
      return (
        <div className="text-center">
          <Badge variant={variant}>{typeText}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Statut</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      const statusText = isActive ? "Actif" : "Inactif";
      const variant = isActive ? "default" : "destructive";
      return (
        <div className="text-center">
          <Badge variant={variant} className="capitalize">
            {statusText}
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId) as boolean;
      return rowValue === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="pl-4 text-left">
          {firestoreTimestampsConverter(row.original.createdAt as FirestoreTimestamps)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionDropdownMenu donor={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];