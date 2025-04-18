import { useMutation } from '@tanstack/react-query';
import {
  signInWithEmail,
  signInWithProvider,
  logoutUser,
  resetPassword,
  signUpWithEmail
} from './api';

// Hook for Email Sign In
export function useSignInWithEmail() {
  // Note: We don't typically need queryClient invalidation here,
  // because onAuthStateChanged handles the primary user state update.
  return useMutation<void, Error, { email: string; password: string }>({
    mutationKey: ['signInWithEmail'],
    mutationFn: signInWithEmail,
    onError: (error) => {
      // Error handling is automatically available via the hook's return value
      console.error("useSignInWithEmail Mutation Error:", error.message);
    },
    // onSuccess could be used for immediate UI feedback before onAuthStateChanged fires,
    // but often not strictly necessary for core state update.
    // onSuccess: () => { console.log("Email sign-in attempt successful via Firebase."); }
  });
}

// Hook for Provider Sign In
export function useSignInWithProvider() {
  return useMutation<void, Error, 'google' | 'facebook' | 'twitter' | 'apple'>({
    mutationKey: ['signInWithProvider'],
    mutationFn: signInWithProvider,
    onError: (error) => {
      console.error("useSignInWithProvider Mutation Error:", error.message);
    },
  });
}

// Hook for User Creation
export function useSignUpWithEmail() {
  return useMutation<void, Error, { email: string; password: string; firstName: string; lastName: string }>({
    mutationKey: ['signUpWithEmail'],
    mutationFn: ({ email, password, firstName, lastName }) => signUpWithEmail({ email, password, firstName, lastName }),
    onError: (error) => {
      console.error("useSignUpWithEmail Mutation Error:", error.message);
    },
  });
}

// Hook for Logout
export function useLogoutUser() {
  return useMutation<void, Error, void>({ // No variables needed for logout
    mutationKey: ['logoutUser'],
    mutationFn: logoutUser,
    onError: (error) => {
      console.error("useLogoutUser Mutation Error:", error.message);
    },
  });
}

// Hook for Password Reset
export function useResetPassword() {
  return useMutation<void, Error, string>({ // Variable is the email string
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
    onError: (error) => {
      console.error("useResetPassword Mutation Error:", error.message);
    },
  });
}