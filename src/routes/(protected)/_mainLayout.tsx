import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DesktopSidebar } from '@/components/sidebar/desktop-sidebar';
import { SiteHeader } from '@/components/sidebar/site-header';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/config/firebase';

export const Route = createFileRoute("/(protected)/_mainLayout")({
  component: MainLayout,
})

function MainLayout() {
  const [user, loading, error] = useAuthState(auth);

  console.log(`MainLayout: Rendering. Loading: ${loading}, User: ${user?.uid || 'null'}, Error: ${error}`);

  if (loading) {
    console.log("MainLayout: Auth state loading...");
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Checking authentication...</p> {/* Or your spinner */}
      </div>
    );
  }

  if (error) {
    console.error("MainLayout: Auth state error:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Error loading authentication state: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    console.log("MainLayout: User not authenticated after load. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  console.log("MainLayout: User authenticated. Rendering protected layout.");
  return (
    <SidebarProvider>
      <DesktopSidebar variant='sidebar' />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 lg:gap-2 lg:px-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}