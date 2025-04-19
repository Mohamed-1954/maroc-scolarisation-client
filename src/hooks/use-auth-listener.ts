// src/hooks/useAuthListener.ts (Restore the version with asyncRetry and getUserData)
import React from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import asyncRetry from 'async-retry';
import { auth } from '@/config/firebase';
import { setAuthState } from '@/store/auth/authSlice';
import { getUserData } from '@/services/auth/api';

const MAX_RETRIES = 3;
const RETRY_FACTOR = 2;
const RETRY_MIN_TIMEOUT = 500;

export function useAuthListener() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userProfile = await asyncRetry(
            async () => {
              const profile = await getUserData(firebaseUser.uid);
              if (!profile) {
                throw new Error('Profile not found');
              }
              return profile;
            },
            { retries: MAX_RETRIES, factor: RETRY_FACTOR, minTimeout: RETRY_MIN_TIMEOUT }
          );
          if (userProfile) {
            dispatch(setAuthState({ user: userProfile }));
          } else {
            await auth.signOut();
            dispatch(setAuthState({ user: null}));
          }
          console.log("useAuthListener: User profile fetched successfully:", userProfile);
          dispatch(setAuthState({ user: userProfile }));
        } catch (error) {
          console.error('Auth state error:', error);
          await auth.signOut();
          dispatch(setAuthState({ user: null }));
        }
      } else {
        dispatch(setAuthState({ user: null }));
      }
    });

    return () => {
      console.log("useAuthListener: Unsubscribing...");
      unsubscribe();
    }
  }, [dispatch]);
}