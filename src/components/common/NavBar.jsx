import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ojoLogo from "@/images/logos/ojo_logo.svg";
import ojoIcon from "@/images/logos/ojo_icon.svg";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown";

export default function NavBar({ children, selectedPage }) {
    if (!selectedPage) selectedPage = "scheduler";

    return (
        <Disclosure as="nav" className="bg-white shadow">
            {({ open }) => (
                <>
                    <div className="mx-auto mb-4 max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/" aria-label="Ojo Teach Landing Page">
                                        {!children ? (
                                            <Image
                                                className="h-8 w-auto"
                                                src={ojoLogo}
                                                alt="Ojo Teach"
                                                height={32}
                                                width={32}
                                            />
                                        ) : (
                                            <>
                                                <Image
                                                    className="hidden h-8 w-auto sm:block lg:hidden"
                                                    src={ojoIcon}
                                                    alt="Ojo Teach"
                                                    height={32}
                                                    width={32}
                                                />
                                                <Image
                                                    className="hidden h-8 w-auto lg:block"
                                                    src={ojoLogo}
                                                    alt="Ojo Teach"
                                                    height={32}
                                                    width={32}
                                                />
                                            </>
                                        )}
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                                    {selectedPage === "scheduler" && (
                                        <>
                                            <Link
                                                href="/scheduler"
                                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                                            >
                                                Calendar
                                            </Link>
                                            <Link
                                                href="lessonPlanner"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Lesson Planner
                                            </Link>
                                            <Link
                                                href="/page"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Notes
                                            </Link>
                                        </>
                                    )}
                                    {selectedPage === "lessonPlanner" && (
                                        <>
                                            <Link
                                                href="/scheduler"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Calendar
                                            </Link>
                                            <Link
                                                href="lessonPlanner"
                                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                                            >
                                                Lesson Planner
                                            </Link>
                                            <Link
                                                href="/page"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Notes
                                            </Link>
                                        </>
                                    )}{" "}
                                    {selectedPage === "notes" && (
                                        <>
                                            <Link
                                                href="/scheduler"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Calendar
                                            </Link>
                                            <Link
                                                href="lessonPlanner"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Lesson Planner
                                            </Link>
                                            <Link
                                                href="/page"
                                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                                            >
                                                Notes
                                            </Link>
                                        </>
                                    )}
                                    {selectedPage === undefined && (
                                        <>
                                            <Link
                                                href="/scheduler"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Calendar
                                            </Link>
                                            <Link
                                                href="lessonPlanner"
                                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                                            >
                                                Lesson Planner
                                            </Link>
                                            <Link
                                                href="/page"
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Notes
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {children}
                                <ProfileDropdown />
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pb-4 pt-2">
                            {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                            >
                                Dashboard
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                Team
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                Projects
                            </Disclosure.Button>
                            <Disclosure.Button
                                as="a"
                                href="#"
                                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                Calendar
                            </Disclosure.Button>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
