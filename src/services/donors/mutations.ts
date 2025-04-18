import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { DonorFormData } from '../../types/donor';
import { toast } from 'sonner';
import {
  createDonor,
  updateDonorData,
  deactivateDonorById,
  reactivateDonorById,
  deleteDonorById,
} from './api';

export const useCreateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationKey: ['createDonor'],
    mutationFn: (donorData: DonorFormData) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }
      return createDonor(donorData, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      toast.success('Donateur créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création du donateur: ${error.message || 'Erreur inconnue'}`);
    }
  });
};

export const useUpdateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationKey: ['updateDonor'],
    mutationFn: ({ id, donorData }: { id: string, donorData: Partial<DonorFormData> }) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }
      return updateDonorData(id, donorData, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      queryClient.invalidateQueries({ queryKey: ['donor', variables.id] });
      toast.success('Donateur mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour du donateur: ${error.message || 'Erreur inconnue'}`);
    }
  });
};

export const useDeactivateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationKey: ['deactivateDonor'],
    mutationFn: (id: string) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }
      return deactivateDonorById(id, userId);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      queryClient.invalidateQueries({ queryKey: ['donor', id] });
      toast.success('Donateur désactivé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la désactivation du donateur: ${error.message || 'Erreur inconnue'}`);
    }
  });
};

export const useReactivateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationKey: ['reactivateDonor'],
    mutationFn: (id: string) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }
      return reactivateDonorById(id, userId);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      queryClient.invalidateQueries({ queryKey: ['donor', id] });
      toast.success('Donateur réactivé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la réactivation du donateur: ${error.message || 'Erreur inconnue'}`);
    }
  });
};

export const useDeleteDonor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteDonor'],
    mutationFn: (id: string) => deleteDonorById(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      queryClient.removeQueries({ queryKey: ['donor', id] });
      toast.success('Donateur supprimé définitivement avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du donateur: ${error.message || 'Erreur inconnue'}`);
    }
  });
};


