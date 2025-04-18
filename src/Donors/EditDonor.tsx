typescriptreact
import React, { useState, FormEvent, ChangeEventHandler } from 'react';
import Donor, { CommunicationPreference } from '../types/Donor';
import { updateDonor } from '../firebase/firestore';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const donorSchema = z.object({
  fullName: z.string().min(3, 'Full Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  donationType: z.enum(['general', 'sponsorship']),
});

interface EditDonorProps {  donor: Donor;  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditDonor: React.FC<EditDonorProps> = ({
  donor: initialDonor,
  setIsEditing
}) => {
  const [fullName, setFullName] = useState(initialDonor?.fullName);
  const [email, setEmail] = useState(initialDonor?.email);
  const [phoneNumber, setPhoneNumber] = useState(initialDonor?.phoneNumber);
  const [address, setAddress] = useState(initialDonor?.address);
  const [donationType, setDonationType] = useState<string>(initialDonor?.donationType || 'general');
  const [communicationPreferences, setCommunicationPreferences] = useState(
    initialDonor?.communicationPreferences || []
  );

  const [isLoading, setIsLoading] = useState(false);
  const handleCommunicationPreferenceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setCommunicationPreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };
    const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (initialDonor) {
        const updatedDonor: Donor = {
          ...initialDonor,
          fullName,
          email,
          phoneNumber,
          address,
          donationType,
          communicationPreferences,
        };
        await updateDonor(updatedDonor);        
        setIsEditing(false);
      } else {
        console.error('No donor to update');
      }
    } finally {
      setIsLoading(false);

    } catch (error) {
      console.error('Error updating donor:', error);
    }
  };
    const [errors, setErrors] = useState({});    const validateField = (fieldName: string, value: any) => {
      try {
        donorSchema.parse({ [fieldName]: value });
        setErrors({ ...errors, [fieldName]: undefined });
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors({ ...errors, [fieldName]: error.errors[0].message });
        }
      }
    };    return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Donor</h2>
      <form className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Full Name
          </label>
          <input
            type="text"            id="fullName"
            className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
            id="fullName"
            onChange={(e) => {
              setFullName(e.target.value);
              validateField('fullName', e.target.value);
            }}
            />
            {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName}</p>}

        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="text"            id="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            type="text"            id="phoneNumber"
            className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
            id="phoneNumber"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              validateField('phoneNumber', e.target.value);
            }}
            />
             {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"            value={address}
            id="address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setAddress(e.target.value)}
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
          className={`w-full px-3 py-2 border ${errors.donationType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
          onChange={(e) => {
            setDonationType(e.target.value);
            validateField('donationType', e.target.value);
          }}
        >          <option value="general">General</option>
          <option value="sponsorship">Sponsorship</option>
          </select>

           {errors.donationType && <p className="text-red-500 text-xs italic">{errors.donationType}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Communication Preferences
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailPreference"
              value={CommunicationPreference.email}
              className="mr-2 checked:bg-blue-500 focus:outline-none"
              checked={communicationPreferences.includes('email')}
              onChange={handleCommunicationPreferenceChange}
            />
            <label htmlFor="emailPreference" className="mr-4">Email</label>
            <input
              type="checkbox"
              id="phone"
              value={CommunicationPreference.phone}
              className="mr-2 checked:bg-blue-500 focus:outline-none"
              checked={communicationPreferences.includes('phone')}
              onChange={handleCommunicationPreferenceChange}
            />
            <label htmlFor="phone">
              Phone
            </label>
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            Update Donor
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditDonor;