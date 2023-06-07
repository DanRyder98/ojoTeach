import React, { useState, useEffect } from "react";
import { auth } from "firebaseClient";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import defaultProfilePicture from "@/images/avatars/defaultProfilePicture.png";
import SignedInProfileDropdown from "./SignedInProfileDropdown";
import SignedOutProfileDropdown from "./SignedOutProfileDropdown";

export default function ProfileDropdown() {
    const [user, setUser] = useState(null);
    const [photoURL, setPhotoURL] = useState(defaultProfilePicture);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                if (user.photoURL) {
                    setPhotoURL(user.photoURL);
                } else {
                    setPhotoURL(defaultProfilePicture);
                }
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        console.log("Signing out...");
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>
            {user ? (
                <SignedInProfileDropdown
                    photoURL={photoURL}
                    handleSignOut={handleSignOut}
                />
            ) : (
                <SignedOutProfileDropdown />
            )}
        </>
    );
}
