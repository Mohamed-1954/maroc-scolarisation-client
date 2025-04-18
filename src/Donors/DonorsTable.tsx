import React, { useState, useEffect } from 'react';
import Donor from '../types/Donor';
import { getAllDonors, deleteDonor } from '../firebase/firestore';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
interface DonorsTableProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDonor: React.Dispatch<React.SetStateAction<Donor | null>>;
}



const DonorsTable: React.FC<DonorsTableProps> = ({ setIsEditing, setSelectedDonor }) => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchDonors = async () => {
      const donorsData = await getAllDonors();
      setDonors(donorsData);
    };

    fetchDonors();
  }, []);

  const handleEdit = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsEditing(true);
  };

  const handleDelete = async (donorId: string) => {
    await deleteDonor(donorId);
    // Refresh the donor list after deletion
    const updatedDonors = await getAllDonors();
    setDonors(updatedDonors);
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Full Name
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Email
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Phone Number
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Donation Type
            </th>
            <th scope='col' className='relative py-3 pl-3 pr-4 sm:pr-6'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donors.map((donor) => (
            <tr key={donor.id} className="hover:bg-gray-100">
              <td className='px-6 py-4 whitespace-nowrap'>{donor.fullName}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{donor.email}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{donor.phoneNumber}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{donor.donationType}</td>
              <td className='relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                <div className='flex justify-end'>
                  <button
                    onClick={() => handleEdit(donor)}
                    className='text-indigo-600 hover:text-indigo-900 px-2'
                  >
                    <PencilIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                  <button
                    onClick={() => handleDelete(donor.id)}
                    className='text-red-600 hover:text-red-900'
                  >
                    <TrashIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 
export default DonorsTable;