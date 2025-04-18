import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PenLine, Eye, UserX, UserCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Donor } from "@/types/donor";
import { Button, buttonVariants } from "@/components/ui/button";
import DonorDialog from "../action-dialogs/donor-dialog-base";
import { cn } from "@/lib/utils";

export function ActionDropdownMenu({ donor }: { donor: Donor }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <div className="flex flex-col gap-1 items-center justify-start">
          {/* Ensure your route for donor details exists */}
          <DropdownMenuItem asChild>
            <Link className={cn(buttonVariants({
              variant: "ghost",
              size: "default",

            }), "justify-start")} to="/donors/$donorId" params={{ donorId: donor.id }}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Voir détails</span>
            </Link>
          </DropdownMenuItem>

          {/* Only allow editing active donors? Or always allow? */}
          <DropdownMenuItem asChild>
            <DonorDialog donor={donor} type="update">
              <Button variant={"ghost"} className="w-full justify-start">
                <PenLine className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </Button>
            </DonorDialog>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />

        {donor.isActive ? (
          <DropdownMenuItem asChild>
            <DonorDialog donor={donor} type="deactivate">
              <Button variant={"ghost"} className="justify-start">
                <UserX className="mr-2 h-4 w-4" />
                <span>Désactiver</span>
              </Button>
            </DonorDialog>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <DonorDialog donor={donor} type="reactivate">
              <Button variant={"ghost"} className="justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Réactiver</span>
              </Button>
            </DonorDialog>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}