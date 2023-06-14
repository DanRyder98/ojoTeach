import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "firebaseClient";

// Create Context object.
export const UserContext = createContext();

// Then create a provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // This listener is called when the user logs in and when the user logs out
        const unsubscribe = onAuthStateChanged(auth, setUser);
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// Create a hook to use the UserContext, this is just a shortcut
export const useUser = () => {
    return useContext(UserContext);
};
