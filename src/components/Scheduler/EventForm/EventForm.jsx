import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LinkIcon, QuestionMarkCircleIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import CustomListInput from "@/components/common/CustomListInput";
import { eventColors, eventBorderColors } from "@/styles/colors";
import { Menu, Transition, Dialog } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function EventForm({ open, setOpen }) {
    const [items, setItems] = useState([]);
    const [event, setEvent] = useState({
        color: "blue",
        subject: "",
        topic: "",
        lessonObjectives: [],
        yearGroup: null,
        duration: 1
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
    };

    const handleChangeYearGroup = (index) => {
        setEvent(event => ({
            ...event,
            yearGroup: index
        }));
    }

    const handleChangeDuration = () => {
        console.log("change duration called")
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                    <form
                                        className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                <div className="flex items-start justify-between space-x-3">
                                                    <div className="space-y-1">
                                                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                            New lesson
                                                        </Dialog.Title>
                                                        <p className="text-sm text-gray-500">
                                                            Get started by
                                                            filling in the
                                                            information below to
                                                            create your new
                                                            lesson.
                                                        </p>
                                                    </div>
                                                    <div className="flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-gray-500"
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                        >
                                                            <span className="sr-only">
                                                                Close panel
                                                            </span>
                                                            <XMarkIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider container */}
                                            <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                {/* Color */}
                                                <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <div>
                                                        <h3 className="text-sm font-medium leading-6 text-gray-900">
                                                            Color
                                                        </h3>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <div className="flex space-x-2">
                                                            {Object.keys(
                                                                eventColors
                                                            ).map(
                                                                (
                                                                    color,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={`inline-block h-6 w-6 rounded-full ${
                                                                            eventColors[
                                                                                color
                                                                            ]
                                                                        } ${
                                                                            event.color ===
                                                                            color
                                                                                ? `border-2 ${eventBorderColors[color]}`
                                                                                : ""
                                                                        }`}
                                                                    ></div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subject */}
                                                <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <div>
                                                        <label
                                                            htmlFor="project-name"
                                                            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                        >
                                                            Subject
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <input
                                                            type="text"
                                                            name="project-name"
                                                            id="project-name"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Topic */}
                                                <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <div>
                                                        <label
                                                            htmlFor="project-name"
                                                            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                        >
                                                            Topic
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <input
                                                            type="text"
                                                            name="project-name"
                                                            id="project-name"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Lesson Objectives */}
                                                <CustomListInput
                                                    items={items}
                                                    setItems={setItems}
                                                />

                                                {/* Year Group */}
                                                <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <div>
                                                        <label
                                                            htmlFor="project-name"
                                                            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                        >
                                                            Year Group
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <Menu
                                                            as="div"
                                                            className="relative inline-block text-left"
                                                        >
                                                            <div>
                                                            {event.yearGroup === null && (
                                                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                    Year Group
                                                                    <ChevronDownIcon
                                                                        className="-mr-1 h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Menu.Button>
                                                            )}
                                                            {event.yearGroup === 0 && (
                                                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                    Reception
                                                                    <ChevronDownIcon
                                                                        className="-mr-1 h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Menu.Button>
                                                            )}
                                                            {event.yearGroup !== null && event.yearGroup !== 0 && (
                                                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                    {"Year " + event.yearGroup}
                                                                    <ChevronDownIcon
                                                                        className="-mr-1 h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Menu.Button>
                                                            )}
                                                            </div>

                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60">
    <div className="py-1">
        <Menu.Item>
                                                                            {({
                                                                                active,
                                                                            }) => (
                                                                                <div
                                                                                    onClick={() => {
                                                                                        handleChangeYearGroup(
                                                                                            0
                                                                                        );
                                                                                    }}
                                                                                    className={classNames(
                                                                                        active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700",
                                                                                        "block px-4 py-2 text-sm"
                                                                                    )}
                                                                                >
                                                                                    Reception
                                                                                </div>
                                                                            )}
                                                                        </Menu.Item>
                                                                        {[
                                                                            ...Array(
                                                                                12
                                                                            ),
                                                                        ].map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <Menu.Item
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    {({
                                                                                        active,
                                                                                    }) => (
                                                                                        <div
                                                                                            onClick={() => {
                                                                                                handleChangeYearGroup(
                                                                                                    i +
                                                                                                        1
                                                                                                );
                                                                                            }}
                                                                                            className={classNames(
                                                                                                active
                                                                                                    ? "bg-gray-100 text-gray-900"
                                                                                                    : "text-gray-700",
                                                                                                "block px-4 py-2 text-sm"
                                                                                            )}
                                                                                        >
                                                                                            Year{" "}
                                                                                            {i +
                                                                                                1}
                                                                                        </div>
                                                                                    )}
                                                                                </Menu.Item>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>
                                                    </div>
                                                </div>

                                                {/* Duration */}
                                                <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <div>
                                                        <label
                                                            htmlFor="project-name"
                                                            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                        >
                                                            Duration
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <div className="flex space-x-2">
                                                            <div className="flex items-center">
                                                                <input
                                                                    id="duration"
                                                                    name="duration"
                                                                    type="number"
                                                                    min="0.5"
                                                                    max="12"
                                                                    step="0.5"
                                                                    value={
                                                                        event.duration
                                                                    }
                                                                    onChange={
                                                                        handleChangeDuration
                                                                    }
                                                                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-gray-500 text-sm">
                                                                    hour(s)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                {/* Privacy */}
                                                <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                    <legend className="sr-only">
                                                        Privacy
                                                    </legend>
                                                    <div
                                                        className="text-sm font-medium leading-6 text-gray-900"
                                                        aria-hidden="true"
                                                    >
                                                        Privacy
                                                    </div>
                                                    <div className="space-y-5 sm:col-span-2">
                                                        <div className="space-y-5 sm:mt-0">
                                                            <div className="relative flex items-start">
                                                                <div className="absolute flex h-6 items-center">
                                                                    <input
                                                                        id="public-access"
                                                                        name="privacy"
                                                                        aria-describedby="public-access-description"
                                                                        type="radio"
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        defaultChecked
                                                                    />
                                                                </div>
                                                                <div className="pl-7 text-sm leading-6">
                                                                    <label
                                                                        htmlFor="public-access"
                                                                        className="font-medium text-gray-900"
                                                                    >
                                                                        Public
                                                                        access
                                                                    </label>
                                                                    <p
                                                                        id="public-access-description"
                                                                        className="text-gray-500"
                                                                    >
                                                                        Everyone
                                                                        with the
                                                                        link
                                                                        will see
                                                                        this
                                                                        project
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="relative flex items-start">
                                                                <div className="absolute flex h-6 items-center">
                                                                    <input
                                                                        id="restricted-access"
                                                                        name="privacy"
                                                                        aria-describedby="restricted-access-description"
                                                                        type="radio"
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                    />
                                                                </div>
                                                                <div className="pl-7 text-sm leading-6">
                                                                    <label
                                                                        htmlFor="restricted-access"
                                                                        className="font-medium text-gray-900"
                                                                    >
                                                                        Private
                                                                        to
                                                                        Project
                                                                        Members
                                                                    </label>
                                                                    <p
                                                                        id="restricted-access-description"
                                                                        className="text-gray-500"
                                                                    >
                                                                        Only
                                                                        members
                                                                        of this
                                                                        project
                                                                        would be
                                                                        able to
                                                                        access
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="relative flex items-start">
                                                                <div className="absolute flex h-6 items-center">
                                                                    <input
                                                                        id="private-access"
                                                                        name="privacy"
                                                                        aria-describedby="private-access-description"
                                                                        type="radio"
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                    />
                                                                </div>
                                                                <div className="pl-7 text-sm leading-6">
                                                                    <label
                                                                        htmlFor="private-access"
                                                                        className="font-medium text-gray-900"
                                                                    >
                                                                        Private
                                                                        to you
                                                                    </label>
                                                                    <p
                                                                        id="private-access-description"
                                                                        className="text-gray-500"
                                                                    >
                                                                        You are
                                                                        the only
                                                                        one able
                                                                        to
                                                                        access
                                                                        this
                                                                        project
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className="border-gray-200" />
                                                        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                            <div>
                                                                <a
                                                                    href="#"
                                                                    className="group flex items-center space-x-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    <LinkIcon
                                                                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-900"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span>
                                                                        Copy
                                                                        link
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <a
                                                                    href="#"
                                                                    className="group flex items-center space-x-2.5 text-sm text-gray-500 hover:text-gray-900"
                                                                >
                                                                    <QuestionMarkCircleIcon
                                                                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span>
                                                                        Learn
                                                                        more
                                                                        about
                                                                        sharing
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
