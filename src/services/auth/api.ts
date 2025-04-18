
import { type User, UserRole } from '@/types/user'; 
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  type AuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { auth, db } from '@/config/firebase'; // Adjust path if needed

// Get User Profile Data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      // Convert Timestamps and ensure structure matches User type
      return {
        id: uid,
        email: data.email ?? null,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as UserRole, // Add validation
        isActive: data.isActive ?? false,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate().toISOString() : data.lastLogin,
      };
    }
    console.warn(`User data not found in Firestore for UID: ${uid}`);
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user profile.'); // Re-throw standard error
  }
};

// Create User API
export const signUpWithEmail = async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string; }): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const newUser = {
      email,
      firstName,
      lastName,
      role: UserRole.MANAGER,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    await setDoc(userDocRef, newUser);
  } catch (error: any) {
    console.error("createUser Error:", error);
    throw new Error(error.message || 'Failed to create user.');
  }
};

// Sign In With Email API
export const signInWithEmail = async ({ email, password }: { email: string; password: string }): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update last login timestamp after successful sign-in
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: new Date()
    });
  } catch (error: any) {
    console.error("signInWithEmail Error:", error);
    throw new Error(error.message || 'Failed to sign in with email.');
  }
};

export const signInWithProvider = async (providerName: 'google' | 'facebook' | 'twitter' | 'apple'): Promise<void> => {
  let provider: AuthProvider;
  switch (providerName) {
    case 'google': provider = new GoogleAuthProvider(); break;
    case 'facebook': provider = new FacebookAuthProvider(); break;
    case 'twitter': provider = new TwitterAuthProvider(); break;
    case 'apple': provider = new OAuthProvider('apple.com'); break;
    default: throw new Error('Invalid provider');
  }

  try {
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, { lastLogin: new Date() });
    }

    const newUserData = {
      email: firebaseUser.email || null,
      firstName: firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0] || 'New',
      lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'User',
      role: UserRole.MANAGER,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    console.log("before setDoc")
    await setDoc(userDocRef, newUserData);
    console.log("after setDoc")
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in process cancelled.');
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with this email address using a different sign-in method.');
    }
    throw new Error(error.message || `Failed to sign in with ${providerName}.`);
  }
};

// Logout API
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("logoutUser Error:", error);
    throw new Error(error.message || 'Failed to sign out.');
  }
};

// Reset Password API
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("resetPassword Error:", error);
    throw new Error(error.message || 'Failed to send password reset email.');
  }
};