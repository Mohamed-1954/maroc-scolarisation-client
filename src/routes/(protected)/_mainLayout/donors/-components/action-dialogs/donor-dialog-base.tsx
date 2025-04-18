import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Donor } from "@/types/donor";
import { toast } from "sonner";
import { DonorForm } from "./donor-dialog-form";
import DonorConfirm from "./donor-dialog-confirm";

interface DonorDialogProps {
    type: "create" | "update" | "deactivate" | "reactivate" | "delete";
    children: React.ReactNode;
    donor?: Donor;
}

const DialogTypeText = {
    create: {
        title: "Ajouter un nouveau donateur",
        description:
            "Remplissez le formulaire pour ajouter un nouveau donateur à la liste.",
    },
    update: {
        title: "Modifier le donateur",
        description:
            "Modifiez les informations du donateur. Cliquez sur enregistrer.",
    },
    deactivate: {
        title: "Confirmer la Désactivation",
        description:
            "Êtes-vous sûr de vouloir désactiver {donor.fullName}? Le donateur sera marqué comme inactif.",
    },
    reactivate: {
        title: "Confirmer la Réactivation",
        description:
            "Êtes-vous sûr de vouloir réactiver {donor.fullName}? Le donateur sera marqué comme actif.",
    },
    delete: {
        title: "Confirmer la Suppression",
        description:
            "Êtes-vous sûr de vouloir supprimer définitivement {donor.fullName}? Cette action est irréversible.",
    },
};

function DonorDialog({ type, children, donor }: DonorDialogProps) {
    const [open, setOpen] = React.useState<boolean>(false);

    const errorToast = () => {
        return toast("Oops, quelque chose s'est mal passé", {
            description: "Impossible de trouver le donateur pour effectuer cette action",
        });
    };

    const getDescription = () => {
        const textConfig = DialogTypeText[type];
        if (["deactivate", "reactivate", "delete"].includes(type)) {
            return textConfig.description.replace(
                "{donor.fullName}",
                donor?.fullName || "ce donateur"
            );
        }
        return textConfig.description;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[450px] w-[90%]">
                <DialogHeader>
                    <DialogTitle>{DialogTypeText[type].title}</DialogTitle>
                    <DialogDescription>
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>
                {type === "create" ? (
                    <DonorForm type={type} setOpen={setOpen} />
                ) : donor ? (
                    type === "update" ? (
                        <DonorForm
                            type={type}
                            setOpen={setOpen}
                            donor={donor}
                        />
                    ) : (
                        <DonorConfirm
                            type={type}
                            setOpen={setOpen}
                            donorId={donor.id}
                        />
                    )
                ) : (
                    (() => {
                        errorToast();
                        return null;
                    })()
                )}
            </DialogContent>
        </Dialog>
    );
}

export default DonorDialog;
