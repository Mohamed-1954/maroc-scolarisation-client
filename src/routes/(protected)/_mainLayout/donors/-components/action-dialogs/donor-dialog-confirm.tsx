import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useDeactivateDonor, useDeleteDonor, useReactivateDonor } from "@/services/donors/mutations";
import React from "react"; // Import React for useMemo

interface DonorConfirmProps {
    setOpen: (open: boolean) => void;
    donorId: string;
    type: "deactivate" | "reactivate" | "delete";
}

const DonorConfirm = ({ setOpen, donorId, type }: DonorConfirmProps) => { // Destructure type
    const deleteDonorMutation = useDeleteDonor();
    const deactivateDonorMutation = useDeactivateDonor();
    const reactivateDonorMutation = useReactivateDonor();

    // Select the mutation based on the type
    const { mutation, isLoading, actionText, loadingText } = React.useMemo(() => {
        switch (type) {
            case "deactivate":
                return {
                    mutation: deactivateDonorMutation,
                    isLoading: deactivateDonorMutation.isPending,
                    actionText: "Désactiver",
                    loadingText: "Désactivation...",
                };
            case "reactivate":
                return {
                    mutation: reactivateDonorMutation,
                    isLoading: reactivateDonorMutation.isPending,
                    actionText: "Réactiver",
                    loadingText: "Réactivation...",
                };
            case "delete":
            default: // Default to delete for safety, though type should always be valid
                return {
                    mutation: deleteDonorMutation,
                    isLoading: deleteDonorMutation.isPending,
                    actionText: "Supprimer",
                    loadingText: "Suppression...",
                };
        }
    }, [type, deleteDonorMutation, deactivateDonorMutation, reactivateDonorMutation]);

    const handleConfirm = async () => {
        await mutation.mutateAsync(donorId, {
            onSettled: () => {
                setOpen(false);
            },
        });
    };

    return (
        <DialogFooter>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
                Annuler
            </Button>
            <LoadingButton
                loading={isLoading} 
                onClick={handleConfirm} 
                variant={"destructive"}
            >
                {isLoading ? loadingText : actionText} 
            </LoadingButton>
        </DialogFooter>
    );
};

export default DonorConfirm;
