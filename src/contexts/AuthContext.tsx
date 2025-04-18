import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from 'react';
import {
  getAuth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const initFirebase = () => {
  initializeApp(firebaseConfig);
};

const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  const auth = getAuth();

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      dispatch(setUser(user));
      return user;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
      // if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
      //   throw new Error('Invalid email or password');
      // }
      // throw new Error('An error occurred during login');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw new Error(error.message);
    }
  };
  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      dispatch(setUser(user));
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
      // if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
      //   throw new Error('Email already in use');
      // }
      // throw new Error('An error occurred during registration');
    }
  };

  const value: AuthContextProps = {
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};