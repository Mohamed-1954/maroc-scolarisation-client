import { queryOptions, useQuery } from '@tanstack/react-query';
import {
  getAllDonors,
  getActiveDonors,
  getDonorById,
  searchDonors
} from './api';

export const getDonorsQueryOptions = (activeOnly = true) => {
  return queryOptions({
    queryKey: ['donors', { activeOnly }],
    queryFn: () => activeOnly ? getActiveDonors() : getAllDonors()
  });
};

export const getDonorByIdQueryOptions = (id: string | undefined) => {
  return queryOptions({
    queryKey: ['donor', id],
    queryFn: () => id ? getDonorById(id) : null,
    enabled: !!id
  });
};

export const useSearchDonors = (searchTerm: string) => {
  return useQuery({
    queryKey: ['donors', 'search', searchTerm],
    queryFn: () => searchDonors(searchTerm),
    enabled: searchTerm.length > 2
  });
};