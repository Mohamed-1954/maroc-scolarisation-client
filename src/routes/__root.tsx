import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { useAuthListener } from '@/hooks/use-auth-listener'
import { Toaster } from '@/components/ui/sonner'
import Error from './-components/error'
import NotFound from './-components/not-found'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => <RootComponent />,
  errorComponent: ({ error, reset}) => <Error error={error} reset={reset} />,
  notFoundComponent: () => <NotFound />
})

function RootComponent() {
  useAuthListener();
  return (
    <>
      <Outlet />
      <Toaster />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}