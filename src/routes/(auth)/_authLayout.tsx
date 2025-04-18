import { createFileRoute, Outlet, useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router'
import { auth } from '@/config/firebase';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useSignInWithProvider } from '@/services/auth/mutations';
import { toast } from 'sonner';

// Define search params expected (for redirecting after login)
interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/(auth)/_authLayout")({
  component: AuthLayout,
  beforeLoad: async () => {
    await auth.signOut();
  },
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : '/dashboard',
    }
  },
})

const AuthTypeText = {
  login: {
    title: "Connexion",
    description: "Entrez vos identifiants pour accéder à votre compte",
    footerText: "Vous n'avez pas de compte?",
    footerLinkPath: "/signup",
    footerLinkText: "Créer un compte",
  },
  signup: {
    title: "Créer un compte",
    description: "Vous n'avez pas de compte?",
    footerText: "Vous avez déjà un compte?",
    footerLinkPath: "/login",
    footerLinkText: "Se connecter",
  },
};

function AuthLayout() {
  const { pathname } = useLocation();
  const authType = AuthTypeText[pathname.split('/').pop() as keyof typeof AuthTypeText] || AuthTypeText.login;


  const navigate = useNavigate();
  const search = useSearch({ from: Route.id });
  const providerSignInMutation = useSignInWithProvider();

  console.log(search.redirect)
  const handleProviderLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'apple') => {
    console.log(`Attempting login with ${provider}`);
    await providerSignInMutation.mutateAsync(provider, {
      onSuccess: () => {
        toast.success(`Logged in successfully with ${provider}!`);
        navigate({ to: search.redirect || '/dashboard' });
      },
      onError: (error) => {
        if (error.message.includes('popup-closed-by-user')) {
          toast.info('Sign-in process cancelled.');
        } else if (error.message.includes('account-exists-with-different-credential')) {
          toast.error('Account already exists with this email using a different sign-in method.');
        }
        else {
          toast.error(error.message || `Failed to sign in with ${provider}.`);
        }
      },
    });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-primary/5 dark:bg-primary/10 items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" width={60} height={60} />
            <span className="font-bold text-xl text-primary">Maroc Scolarisation</span>
          </Link>
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6">Ensemble pour l'éducation au Maroc</h1>
          <p className="text-muted-foreground mb-8">
            Notre mission est de soutenir l'éducation des enfants au Maroc en facilitant la gestion des ressources et
            des donateurs.
          </p>
          <img
            src="/login-image.webp"
            alt="Education illustration"
            width={400}
            height={300}
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">

          <div className="space-y-6">

            <div className="flex flex-col items-center gap-1">
              <h1 className="text-3xl font-bold">{authType.title}</h1>
              <p className="text-muted-foreground">{authType.description}</p>
            </div>

            <Outlet />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
              </div>
            </div>

            {/* Providers */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" disabled={providerSignInMutation.isPending} onClick={() => handleProviderLogin('facebook')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                    fill="currentColor"
                  />
                </svg>
                Facebook
              </Button>
              <Button variant="outline" type="button" disabled={providerSignInMutation.isPending} onClick={() => handleProviderLogin('google')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" disabled={providerSignInMutation.isPending} onClick={() => handleProviderLogin('apple')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Apple
              </Button>
              <Button variant="outline" type="button" disabled={providerSignInMutation.isPending} onClick={() => handleProviderLogin('twitter')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                  <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                    fill="currentColor"
                  />
                </svg>
                Twitter
              </Button>
            </div>
            <div className="text-center text-sm">
              <p>
                {authType.footerText}{" "}
                <Link to={authType.footerLinkPath} className="font-medium text-primary hover:underline">
                  {authType.footerLinkText}
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}