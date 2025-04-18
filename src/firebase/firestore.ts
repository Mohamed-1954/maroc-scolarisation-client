import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import Donor from '../types/Donor';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const donorsCollection = collection(db, 'donors');

export const addDonorToFirestore = async (donor: Omit<Donor, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(donorsCollection, donor);
    return docRef.id;
  } catch (error) {
    console.error('Error adding donor to Firestore:', error);
    throw error;
  }
};

export const getAllDonorsFromFirestore = async (): Promise<Donor[]> => {
  try {
    const querySnapshot = await getDocs(donorsCollection);
    const donors: Donor[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Donor)
    );
    return donors;
  } catch (error) {
    console.error('Error getting donors from Firestore:', error);
    throw error;
  }
};

export const updateDonorInFirestore = async (donor: Donor): Promise<void> => {
  try {
    const donorDoc = doc(db, 'donors', donor.id);
    await updateDoc(donorDoc, { ...donor });
  } catch (error) {
    console.error('Error updating donor in Firestore:', error);
    throw error;
  }
};

export const deleteDonorFromFirestore = async (donorId: string): Promise<void> => {
  try {
    const donorDoc = doc(db, 'donors', donorId);
    await deleteDoc(donorDoc);
  } catch (error) {
    console.error('Error deleting donor from Firestore:', error);
    throw error;
  }
};