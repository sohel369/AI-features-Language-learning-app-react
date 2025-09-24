// src/context/context.js
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({ level: 1, progressPercentage: 0 });
  const [fontSize, setFontSize] = useState("text-base");
  const [currentLanguage, setCurrentLanguage] = useState({ rtl: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        setUser(docSnap.exists() ? { uid: firebaseUser.uid, ...docSnap.data() } : { uid: firebaseUser.uid });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        userProgress,
        setUserProgress,
        fontSize,
        setFontSize,
        currentLanguage,
        setCurrentLanguage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
