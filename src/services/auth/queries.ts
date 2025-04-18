import { useQuery } from '@tanstack/react-query';
import {
  getUserData
} from './api';
import type { User } from '@/types/user';

// Hook to get user profile data (can be used by components)
export function useGetUserProfile(userId: string | undefined) {
  return useQuery<User | null, Error>({
    queryKey: ["auth", "profile", userId],
    queryFn: () => getUserData(userId!), // Calls the raw API function
    enabled: !!userId, // Only run if userId is available
    staleTime: 1000 * 60 * 15, // Cache profile data for 15 minutes, adjust as needed
    // cacheTime: ... // Optional: adjust cache time
  });
}