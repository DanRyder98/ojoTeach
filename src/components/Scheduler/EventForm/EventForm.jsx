import { Fragment, useEffect, useState } from "react";
import { XMarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CustomListInput from "@/components/common/CustomListInput";
import { eventColors, eventBorderColors } from "@/styles/colors";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { duration } from "moment";
import { getDatabase, ref, set, push } from "firebase/database";
import moment from "moment";
import { useUser } from "@/components/common/UserContext";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function EventForm({
    open,
    setOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
    showViewLessonButton = true,
}) {
    const [formEvent, setFormEvent] = useState(
        selectedEvent || {
            id: Math.random(),
            color: "blue",
            subject: "",
            topic: "",
            lessonObjectives: [],
            yearGroup: null,
            duration: 1,
        }
    );
    const [items, setItems] = useState(formEvent.lessonObjectives);
    const [loading, setLoading] = useState(true);
    const [buttonActive, setButtonActive] = useState(true);

    const user = useUser();
    const router = useRouter();

    const generated = false;
    useEffect(() => {
        if (!generated && open && showViewLessonButton) {
            setLoading(true);
            setButtonActive(false);
            setTimeout(() => {
                setLoading(false);
                setButtonActive(true);
                toast.success(
                    "Your Year " +
                        formEvent.yearGroup +
                        " " +
                        formEvent.subject +
                        " lesson plan is ready!",
                    { duration: 3000 }
                );
            }, 4000);
        }
    }, [formEvent.subject, formEvent.yearGroup, generated, open]);

    useEffect(() => {
        setSelectedEvent(formEvent);
    }, [formEvent, setSelectedEvent]);

    useEffect(() => {
        if (selectedEvent) {
            setFormEvent(selectedEvent);
            setItems(selectedEvent.lessonObjectives);
        }
    }, [selectedEvent]);

    const handleSubmit = (e) => {
        if (!user) return;

        e.preventDefault();

        const db = getDatabase();
        const date = moment(selectedEvent.dateTime).format("YYYY-MM-DD");
        const time = moment(selectedEvent.dateTime).format("HH:mm");

        // The path to the event in the database.
        // Replace `auth.currentUser.uid` with the actual user's ID.
        const eventRef = ref(db, `/users/${user.uid}/dates/${date}/event`);

        let eventToSave = { ...selectedEvent, dateTime: time }; // Remove the date part from dateTime

        if (selectedEvent.id) {
            // If the event already exists
            set(ref(db, `${eventRef}/${selectedEvent.id}`), eventToSave);
            setEvents((events) =>
                events.map((event) =>
                    event.dateTime === selectedEvent.dateTime
                        ? selectedEvent
                        : event
                )
            );
        } else {
            // If the event is new
            const newEventRef = push(eventRef);
            set(newEventRef, eventToSave).then(() => {
                setEvents((events) => [
                    ...events,
                    { ...eventToSave, id: newEventRef.key },
                ]);
            });
        }

        setOpen(false);
    };

    const handleDelete = () => {
        const newEvents = events.filter((event) => event.id !== formEvent.id);
        setEvents(newEvents);

        setOpen(false);
    };

    const handleClose = () => {
        if (formEvent.subject === "" && formEvent.topic === "") {
            handleDelete();
        }
        setOpen(false);
    };

    const handleColorChange = (color) => {
        setFormEvent((event) => ({
            ...event,
            color: color,
        }));
    };

    const handleChangeYearGroup = (index) => {
        setFormEvent((event) => ({
            ...event,
            yearGroup: index,
        }));
    };

    const handleChangeDuration = () => {
        console.log("change duration called");
    };

    const handleGoToLessonPlan = () => {
        localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
        router.push("/lessonPlanner");
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                                                            {formEvent.subject ===
                                                            ""
                                                                ? "New Lesson"
                                                                : formEvent.subject +
                                                                  " - Year " +
                                                                  formEvent.yearGroup}
                                                        </Dialog.Title>
                                                        <p className="text-sm text-gray-500">
                                                            {formEvent.subject ===
                                                            ""
                                                                ? "Get started by filling in the information below to create your new lesson."
                                                                : formEvent.topic}
                                                        </p>
                                                    </div>
                                                    {/* <div className="flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            onClick={
                                                                handleGoToLessonPlan
                                                            }
                                                        >
                                                            Lesson Plan
                                                        </button>
                                                    </div> */}

                                                    <div className="flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-gray-500"
                                                            onClick={
                                                                handleClose
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
                                                {formEvent.subject !== "" &&
                                                showViewLessonButton &&
                                                !loading ? (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center mt-4"
                                                        onClick={
                                                            handleGoToLessonPlan
                                                        }
                                                    >
                                                        <BookOpenIcon
                                                            className="-ml-0.5 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                        View your lesson plan
                                                    </button>
                                                ) : (
                                                    formEvent.subject !== "" &&
                                                    showViewLessonButton && (
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center mt-4"
                                                            disabled
                                                        >
                                                            <svg
                                                                aria-hidden="true"
                                                                class="w-5 h-5 mr-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                                viewBox="0 0 100 101"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                    fill="currentColor"
                                                                />
                                                                <path
                                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                    fill="currentFill"
                                                                />
                                                            </svg>
                                                            <span class="sr-only">
                                                                Loading...
                                                            </span>
                                                            Loading...
                                                        </button>
                                                    )
                                                )}
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
                                                                    <button
                                                                        key={
                                                                            color +
                                                                            index
                                                                        }
                                                                        onClick={() => {
                                                                            handleColorChange(
                                                                                color
                                                                            );
                                                                        }}
                                                                        type="button"
                                                                    >
                                                                        <div
                                                                            className={`inline-block h-6 w-6 rounded-full ${
                                                                                eventColors[
                                                                                    color
                                                                                ]
                                                                            } ${
                                                                                formEvent.color ===
                                                                                color
                                                                                    ? `border-2 ${eventBorderColors[color]}`
                                                                                    : ""
                                                                            }`}
                                                                        ></div>
                                                                    </button>
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
                                                            value={
                                                                formEvent.subject
                                                            }
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
                                                            value={
                                                                formEvent.topic
                                                            }
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
                                                                {formEvent.yearGroup ===
                                                                    null && (
                                                                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                        Year
                                                                        Group
                                                                        <ChevronDownIcon
                                                                            className="-mr-1 h-5 w-5 text-gray-400"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </Menu.Button>
                                                                )}
                                                                {formEvent.yearGroup ===
                                                                    0 && (
                                                                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                        Reception
                                                                        <ChevronDownIcon
                                                                            className="-mr-1 h-5 w-5 text-gray-400"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </Menu.Button>
                                                                )}
                                                                {formEvent.yearGroup !==
                                                                    null &&
                                                                    formEvent.yearGroup !==
                                                                        0 && (
                                                                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                            {"Year " +
                                                                                formEvent.yearGroup}
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
                                                                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-36">
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
                                                                    max="120"
                                                                    step="0.5"
                                                                    value={
                                                                        formEvent.duration
                                                                    }
                                                                    onChange={
                                                                        handleChangeDuration
                                                                    }
                                                                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-gray-500 text-sm">
                                                                    minutes
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                                {/* <button
                                                    type="button"
                                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    onClick={handleClose}
                                                >
                                                    Cancel
                                                </button> */}
                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    onClick={(e) => {
                                                        handleSubmit(e);
                                                    }}
                                                >
                                                    {formEvent.subject === ""
                                                        ? "Create"
                                                        : "Save"}
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
