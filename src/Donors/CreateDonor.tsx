import React, { useState } from "react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import Donor from '../types/Donor';
import { addDonorToFirestore } from '../firebase/firestore';

const donorSchema = z.object({
  fullName: z.string().min(3, { message: 'Full Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),

  phoneNumber: z.string().min(8, { message: 'Phone Number must be at least 8 characters long' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters long' }),
  donationType: z.enum(['general', 'sponsorship'], { message: 'Invalid donation type' }),
  communicationPreferences: z.array(z.enum(['email', 'phone'])).optional(),
});
const CreateDonor: React.FC = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const validatedData = donorSchema.parse({
          fullName,
          email,
          phoneNumber,
          address,
          donationType,
          communicationPreferences,
      });
      const newDonor: Donor = {
        id: '', // Firestore will generate the ID
        fullName: validatedData.fullName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        address: validatedData.address,
        donationType: validatedData.donationType,
        communicationPreferences: validatedData.communicationPreferences,
        internalNotes: '',
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await addDonorToFirestore(newDonor);
    } catch (error: any) {
      const errors = error.flatten().fieldErrors;
      setFormErrors(errors);
    }
  };



  const handleCommunicationPreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setCommunicationPreferences((prevPreferences) =>
      checked
        ? [...prevPreferences, value]
        : prevPreferences.filter((pref) => pref !== value),
    );
  }

  eturn (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create New Donor</h2>
      <form 
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md"
      >
          <label
            htmlFor="fullName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"

            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter full name"
          />
          {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"

            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter email"
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"

            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter phone number"
          />
          {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"

            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter address"
          />
          {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="donationType"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Donation Type
          </label>
          <select
            id="donationType"

            onChange={(e) => setDonationType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="sponsorship">Sponsorship</option>
          </select>
          {formErrors.donationType && <p className="text-red-500 text-xs mt-1">{formErrors.donationType}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Communication Preferences
          </label>
          <div className="flex flex-wrap">
            <div className="mr-4">
              <input
                type="checkbox"
                id="emailPreference"
                value="email"
                checked={communicationPreferences.includes('email')}
                onChange={handleCommunicationPreferenceChange}
                className="mr-2"
              />
              <label htmlFor="emailPreference">Email</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="phonePreference"
                value="phone"
                checked={communicationPreferences.includes('phone')}
                onChange={handleCommunicationPreferenceChange}
                className="mr-2"
              />
              <label htmlFor="phonePreference">Phone</label>
            </div>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Creating...' : 'Create Donor'}
        </button>
      </form>
    </div>
  )
export default CreateDonor;