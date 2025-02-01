import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [nickname, setNickname] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = doc(db, "users", currentUser.uid);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setNickname(userSnapshot.data().nickname);
                }
                setUser(currentUser);
            } else {
                setUser(null);
                setNickname('');
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    return (
        <UserContext.Provider value={{ user, nickname }}>
            {children}
        </UserContext.Provider>
    )
}