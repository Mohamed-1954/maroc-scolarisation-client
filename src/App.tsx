import React, { useState } from 'react';
import DonorsTable from './Donors/DonorsTable';
import CreateDonor from './Donors/CreateDonor';
import EditDonor from './Donors/EditDonor';
import Donor from './types/Donor';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<p>Register component here (if needed)</p>}
          />{' '}
          {/* Placeholder */}
          <Route
            path="/"
            element={
              user ? (
                <>
                  <CreateDonor />
                  {isEditing && selectedDonor && (
                    <EditDonor
                      donor={selectedDonor}
                      setIsEditing={setIsEditing}
                    />
                  )}
                  <DonorsTable
                    setIsEditing={setIsEditing}
                    setSelectedDonor={setSelectedDonor}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
