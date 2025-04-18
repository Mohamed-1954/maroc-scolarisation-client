import type { FirestoreTimestamps } from "./general";

export enum DonorType {
  GENERAL = "general",
  SPONSORSHIP = "sponsorship", // parrainage
}

export enum CommunicationPreference {
  EMAIL = "email",
  SMS = "sms",
  PHONE = "phone",
  MAIL = "mail",
  NONE = "none",
}

export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  donorType: DonorType;
  communicationPreferences: CommunicationPreference[];
  isActive: boolean;
  notes?: string;
  documents?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Date | FirestoreTimestamps;
  }[];
  createdAt: Date | FirestoreTimestamps;
  updatedAt?: Date | FirestoreTimestamps;
  createdBy: string;
  updatedBy?: string;
}

export interface DonorFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  donorType: DonorType;
  communicationPreferences: CommunicationPreference[];
  notes?: string;
}
