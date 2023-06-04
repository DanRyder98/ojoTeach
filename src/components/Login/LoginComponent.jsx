import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "firebaseClient";

import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export function LoginComponent() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setUser(user);
    //         } else {
    //             setUser(null);
    //         }
    //     });

    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();
    // }, [auth]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Clean up the listener
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            setShowDropdown(false);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleAppleLogin = async () => {
        const provider = new AppleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            setShowDropdown(false);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="relative px-4">
            {!user ? (
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="mb-2 bg-gray-light text-black py-2 px-4 rounded-full"
                >
                    Sign in
                </button>
            ) : (
                <div className="px-2">
                    <div>
                        <div
                            className="p-1 rounded-full bg-blue-100 cursor-pointer hover:bg-blue-200"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <Image
                                src={user.photoURL}
                                alt="Profile picture"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 right-0 top-full mt-2 w-64 p-6 rounded-2xl shadow-lg bg-gray-light origin-top-right"
                >
                    {!user ? (
                        <button
                            onClick={handleGoogleLogin}
                            className="mb-2 w-full bg-white text-black py-2 px-4 rounded-full flex items-center space-x-2"
                        >
                            <FcGoogle />
                            <span>Sign in with Google</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="mb-2 bg-white text-black py-2 px-4 rounded-full"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
