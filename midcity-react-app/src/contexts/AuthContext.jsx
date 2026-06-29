import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, fullName, role, businessName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = {
      uid: user.uid,
      email,
      fullName: role === 'merchant' ? businessName : fullName,
      role,
      isResident: role === 'resident',
      createdAt: serverTimestamp(),
    };

    if (role === 'merchant') {
      userDoc.businessName = businessName;
    }

    await setDoc(doc(db, 'users', user.uid), userDoc);
    setUserData(userDoc);
    return userCredential;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
    return userCredential;
  }

  function logout() {
    setUserData(null);
    return signOut(auth);
  }

  async function updateProfile(data) {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid), data);
    setUserData((prev) => ({ ...prev, ...data }));
  }

  async function deleteAccount() {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid));
    await deleteUser(currentUser);
    setUserData(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    updateProfile,
    deleteAccount,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
