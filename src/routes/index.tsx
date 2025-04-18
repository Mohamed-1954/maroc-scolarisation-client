import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // This function runs before the component attempts to load
  beforeLoad: () => {
    // Always redirect from the root '/' to '/login'
    throw redirect({
      to: '/login',
      // Use replace: true so the '/' path doesn't end up in the browser history.
      // Pressing 'back' from /login won't go back to '/'.
      replace: true,
    });
  },
})