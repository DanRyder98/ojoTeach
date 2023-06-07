import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/Landing/Button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "firebaseClient";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SignedOutProfileDropdown() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/scheduler");
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("Error signing in");
        }
    };

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none">
                        <span>Sign In</span>
                    </div>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                onClick={handleGoogleLogin}
                                className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                )}
                            >
                                <FcGoogle className="inline-block mr-2" />
                                Sign in with Google
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
