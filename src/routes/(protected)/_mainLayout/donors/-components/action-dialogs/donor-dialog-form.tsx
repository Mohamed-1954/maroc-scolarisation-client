import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    useCreateDonor,
    useUpdateDonor,
} from "@/services/donors/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { type Donor, DonorType, CommunicationPreference, type DonorFormData } from "@/types/donor";
import { useSelector } from 'react-redux';
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { selectCurrentUser } from "@/store/auth/authSelectors";

const communicationPreferenceItems = [
    { id: CommunicationPreference.EMAIL, label: "Email" },
    { id: CommunicationPreference.SMS, label: "SMS" },
    { id: CommunicationPreference.PHONE, label: "Téléphone" },
    { id: CommunicationPreference.MAIL, label: "Courrier" },
    { id: CommunicationPreference.NONE, label: "Aucune" },
] as const;

const donorSchema = z.object({
    fullName: z.string().min(1, "Le nom complet est requis"),
    email: z.email({ error: "Adresse email invalide"}),
    phoneNumber: z
        .string()
        .refine(isValidPhoneNumber, { error: "Numéro de téléphone invalide" }),
    address: z.string().min(1, "L'adresse est requise"),
    donorType: z.enum(DonorType, {
        error: "Le type de donateur est requis",
    }),
    communicationPreferences: z.array(z.enum(CommunicationPreference))
        .min(1, "Au moins une préférence de communication doit être sélectionnée"),
    notes: z.string().optional(),
});

type DonorFormValues = z.infer<typeof donorSchema>;

interface DonorFormProps {
    setOpen: (open: boolean) => void;
    donor?: Donor;
    type: "create" | "update";
}

export function DonorForm({ setOpen, donor, type }: DonorFormProps) {
    const user = useSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const createDonorMutation = useCreateDonor();
    const updateDonorMutation = useUpdateDonor();

    const createDonorHandler = async (data: DonorFormValues) => {
        if (!user?.id) {
            toast.error("Erreur: Utilisateur non identifié.");
            return;
        }
        const donorData: DonorFormData = data;

        return await createDonorMutation.mutateAsync(donorData, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ["donors"],
                });
                toast.success("Donateur créé avec succès");
            },
            onError: (error) => {
                console.error("Failed to create donor:", error);
            },
            onSettled: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const updateDonorHandler = async (data: DonorFormValues) => {
        if (!user?.id) {
            toast.error("Erreur: Utilisateur non identifié.");
            return;
        }
        if (!donor?.id) {
            toast.error("Erreur: Donateur non trouvé pour la mise à jour.");
            return;
        }
        const donorData: Partial<DonorFormData> = data;

        return await updateDonorMutation.mutateAsync(
            { id: donor.id, donorData },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ["donors"],
                    });
                    await queryClient.invalidateQueries({
                        queryKey: ["donor", donor.id],
                    });
                    toast.success("Donateur mis à jour avec succès");
                },
                onError: (error) => {
                    console.error("Failed to update donor:", error);
                },
                onSettled: () => {
                    form.reset();
                    setOpen(false);
                },
            }
        );
    };

    const form = useForm<DonorFormValues>({
        resolver: zodResolver(donorSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: donor?.fullName || "",
            email: donor?.email || "",
            phoneNumber: donor?.phoneNumber || "",
            address: donor?.address || "",
            donorType: donor?.donorType || DonorType.GENERAL,
            communicationPreferences: donor?.communicationPreferences || [],
            notes: donor?.notes || "",
        },
    });

    const onSubmit = async (data: DonorFormValues) => {
        return toast.promise(
            type === "create" ? createDonorHandler(data) : updateDonorHandler(data),
            {
                loading: "Traitement...",
            }
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
            >
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nom complet du donateur" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} placeholder="adresse@email.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de téléphone</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        className="w-full"
                                        defaultCountry={"MA"}
                                        international={true}
                                        placeholder="Numéro de téléphone"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="donorType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type de donateur</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={DonorType.GENERAL}>Général</SelectItem>
                                        <SelectItem value={DonorType.SPONSORSHIP}>Parrainage</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Adresse complète" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="communicationPreferences"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Préférences de communication</FormLabel>
                                <FormDescription>
                                    Sélectionnez comment le donateur préfère être contacté.
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {communicationPreferenceItems.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="communicationPreferences"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item.id
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Notes internes (optionnel)" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="!mt-6">
                    <LoadingButton
                        loading={
                            createDonorMutation.isPending ||
                            updateDonorMutation.isPending
                        }
                        className="w-full"
                        type="submit"
                        size={"sm"}
                    >
                        {type === "create" ? "Ajouter Donateur" : "Enregistrer Modifications"}
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}

export default DonorForm;
