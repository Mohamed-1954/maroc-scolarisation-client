import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Donor, DonorFormData } from '../../types/donor';

// Get all donors
export const getAllDonors = async (): Promise<Donor[]> => {
  const donorsRef = collection(db, 'donors');
  const donorsSnapshot = await getDocs(query(donorsRef, orderBy('createdAt', 'desc')));
  return donorsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Donor[];
};

// Get active donors only
export const getActiveDonors = async (): Promise<Donor[]> => {
  const donorsRef = collection(db, 'donors');
  const donorsSnapshot = await getDocs(
    query(donorsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'))
  );
  return donorsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Donor[];
};

// Get donor by ID
export const getDonorById = async (id: string): Promise<Donor | null> => {
  const donorDoc = await getDoc(doc(db, 'donors', id));
  if (!donorDoc.exists()) {
    return null;
  }
  return { id: donorDoc.id, ...donorDoc.data() } as Donor;
};

// Create donor
export const createDonor = async (donorData: DonorFormData, userId: string): Promise<Donor> => {
  // Check for existing email
  const emailQuery = query(collection(db, 'donors'), where('email', '==', donorData.email));
  const emailQuerySnapshot = await getDocs(emailQuery);

  if (!emailQuerySnapshot.empty) {
    throw new Error('Un donateur avec cette adresse email existe déjà.');
  }

  const newDonor = {
    ...donorData,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId
  };

  const donorRef = await addDoc(collection(db, 'donors'), newDonor);

  return {
    id: donorRef.id,
    ...newDonor
  } as Donor;
};

// Update donor
export const updateDonorData = async (
  id: string,
  donorData: Partial<DonorFormData>,
  userId: string
): Promise<Donor> => {
  if (donorData.email) {
    // Check if another donor has this email
    const emailQuery = query(collection(db, 'donors'), where('email', '==', donorData.email));
    const emailQuerySnapshot = await getDocs(emailQuery);

    if (!emailQuerySnapshot.empty && emailQuerySnapshot.docs[0].id !== id) {
      throw new Error('Un autre donateur avec cette adresse email existe déjà.');
    }
  }

  const donorRef = doc(db, 'donors', id);
  const updateData = {
    ...donorData,
    updatedAt: new Date(),
    updatedBy: userId
  };

  await updateDoc(donorRef, updateData);

  const updatedDonor = await getDoc(donorRef);
  if (!updatedDonor.exists()) {
    throw new Error('Donateur non trouvé après mise à jour.');
  }

  return { id, ...updatedDonor.data() } as Donor;
};

// Deactivate donor
export const deactivateDonorById = async (id: string, userId: string): Promise<void> => {
  const donorRef = doc(db, 'donors', id);
  await updateDoc(donorRef, {
    isActive: false,
    updatedAt: new Date(),
    updatedBy: userId
  });
};

// Reactivate donor
export const reactivateDonorById = async (id: string, userId: string): Promise<void> => {
  const donorRef = doc(db, 'donors', id);
  await updateDoc(donorRef, {
    isActive: true,
    updatedAt: new Date(),
    updatedBy: userId
  });
};

// Delete donor permanently
export const deleteDonorById = async (id: string): Promise<void> => {
  const donorRef = doc(db, 'donors', id);
  await deleteDoc(donorRef);
};

// Search donors
export const searchDonors = async (searchTerm: string): Promise<Donor[]> => {
  // Note: Firestore doesn't support native text search, so this is a limited implementation
  const donorsRef = collection(db, 'donors');
  const nameResults = await getDocs(
    query(donorsRef,
      where('fullName', '>=', searchTerm),
      where('fullName', '<=', searchTerm + '\uf8ff'),
      limit(20)
    )
  );

  const emailResults = await getDocs(
    query(donorsRef,
      where('email', '>=', searchTerm),
      where('email', '<=', searchTerm + '\uf8ff'),
      limit(20)
    )
  );

  // Merge and deduplicate results
  const results = new Map<string, Donor>();

  nameResults.docs.forEach(doc => {
    results.set(doc.id, { id: doc.id, ...doc.data() } as Donor);
  });

  emailResults.docs.forEach(doc => {
    results.set(doc.id, { id: doc.id, ...doc.data() } as Donor);
  });

  return Array.from(results.values());
};
