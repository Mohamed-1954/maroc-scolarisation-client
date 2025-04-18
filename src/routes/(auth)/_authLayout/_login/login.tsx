import { createFileRoute, useNavigate, useSearch, } from '@tanstack/react-router'

import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/password-input/PasswordInput"
import { LoadingButton } from '@/components/ui/loading-button'
import { useSignInWithEmail } from '@/services/auth/mutations'

// Define search params for redirecting after login
interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute('/(auth)/_authLayout/_login/login')({
  component: Login,
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : '/dashboard', // Default redirect to dashboard
    }
  },
})

const formSchema = z.object({
  email: z.email(),
  password: z.string({
    error: "Password is required.",
  }),
});

function Login() {
  const navigate = useNavigate()
  const search = useSearch({ from: Route.id }); // Get validated search params

  const signInMutation = useSignInWithEmail(); // <-- Use the mutation hook

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Attempting login with:", values);
    await signInMutation.mutateAsync(values, {
      onSuccess: (/* userProfile */) => { // userProfile is returned by the updated API, but listener handles Redux update
        toast.success("Login successful!");
        console.log('Login successful via mutation, navigating to:', search.redirect);
        // Navigate after successful Firebase login. Redux state updated by listener.
        navigate({ to: search.redirect || '/dashboard' });
      },
      onError: (error) => {
        console.error("Login mutation error:", error.message);
        // Display error to user (already handled by isError check below)
        toast.error(error.message || 'Login failed. Please check your credentials.');
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto">
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Mot de Passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={signInMutation.isPending}
          type="submit"
          variant="default"
          size="sm"
          className="w-full"
        >
          {signInMutation.isPending ? "Connexion en cours..." : "Se connecter"}
        </LoadingButton>
      </form>
    </Form>
  )
}
