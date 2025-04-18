import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  useForm,
  type FieldErrors
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/password-input/PasswordInput";
import { PasswordStrengthInput } from "@/components/password-input/PasswordStrengthInput";
import { LoadingButton } from '@/components/ui/loading-button'
import React from 'react'
import { useSignUpWithEmail } from '@/services/auth/mutations'

export const Route = createFileRoute('/(auth)/_authLayout/_signup/signup')({
  component: Signup,
})

const formSchema = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "At least 8 characters" })
    .regex(/[a-z]/, { error: "At least 1 lowercase letter" })
    .regex(/[A-Z]/, { error: "At least 1 uppercase letter" })
    .regex(/[0-9]/, { error: "At least 1 number" })
    .regex(/[@$!%*?&#]/, { error: "At least 1 special character (@$!%*?&#)" })
    .max(64, { error: "Password cannot exceed 64 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords don't match",
  path: ["confirmPassword"],
});

function Signup() {
  const navigate = useNavigate()
  const [triggerHighlight, setTriggerHighlight] = React.useState<boolean>(false);
  const signUpMutation = useSignUpWithEmail();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Attempting signup with:", values);
    // Exclude confirmPassword when sending to mutation
    const { confirmPassword, ...signupData } = values;

    await signUpMutation.mutateAsync(signupData, {
      onSuccess: (/* userProfile */) => { // Listener handles Redux state
        toast.success("Account created successfully! Redirecting...");
        console.log('Signup successful via mutation.');
        navigate({ to: '/dashboard' }); // Or '/login' if you want them to log in manually
      },
      onError: (error) => {
        console.error("Signup mutation error:", error.message);
        toast.error(error.message || 'Signup failed. Please try again.');
      },
    });
  }

  const onSubmitError = async (
    errors: FieldErrors<z.infer<typeof formSchema>>
  ) => {
    if (errors.password) {
      setTriggerHighlight(true);
      setTimeout(() => setTriggerHighlight(false), 1000);
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom"
                      type="text"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom"
                      type="text"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="exemple@email.com"
                  type="email"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de Passe</FormLabel>
              <FormControl>
                <PasswordStrengthInput
                  triggerHighlight={triggerHighlight}
                  hidePasswordRequirementsList={true}
                  placeholder='Mot de Passe'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Confirmer le mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={signUpMutation.isPending}
          type="submit"
          variant="default"
          size="sm"
          className="w-full"
        >
          {signUpMutation.isPending ? "Création en cours..." : "Créer un compte"}
        </LoadingButton>
      </form>
    </Form>
  )
}
