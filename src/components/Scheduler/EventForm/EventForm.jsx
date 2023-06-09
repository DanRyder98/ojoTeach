import { Fragment, useEffect, useState } from "react";
import { XMarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    CheckIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import CustomListInput from "@/components/common/CustomListInput";
import {
    eventColors,
    eventBorderColors,
    getRandomColor,
} from "@/styles/colors";
import { Menu, Transition, Dialog, Listbox } from "@headlessui/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getDatabase, ref, set, push, remove } from "firebase/database";
import moment from "moment";
import { useUser } from "@/components/common/UserContext";
import Spinner from "@/components/common/Spinner";

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
    isNewEvent = false,
    setIsNewEvent,
}) {
    const [formEvent, setFormEvent] = useState(
        selectedEvent || {
            id: Math.random(),
            color: getRandomColor(),
            subject: "",
            topic: "",
            lessonObjectives: [],
            yearGroup: null,
            duration: 1,
            recurring: false,
        }
    );
    const [items, setItems] = useState(formEvent.lessonObjectives || {});
    const [loading, setLoading] = useState(isNewEvent);
    const [buttonActive, setButtonActive] = useState(true);
    const [lessonPlanGenerated, setLessonPlanGenerated] = useState(false);
    const [eventEdited, setEventEdited] = useState(false);

    let recurringOptions = [
        {
            id: 1,
            name: "Every week",
            recurrenceType: "DAYS",
            recurrenceValue: 7,
        },
        {
            id: 2,
            name: "Every 2 weeks",
            recurrenceType: "DAYS",
            recurrenceValue: 14,
        },
    ];
    if (isNewEvent) {
        recurringOptions = [
            { id: 0, name: "Never" },
            {
                id: 1,
                name: "Every week",
                recurrenceType: "DAYS",
                recurrenceValue: 7,
            },
            {
                id: 2,
                name: "Every 2 weeks",
                recurrenceType: "DAYS",
                recurrenceValue: 14,
            },
        ];
    }

    const [recurringSelected, setRecurringSelected] = useState(
        setInitialRecurringSelected()
    );

    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        setSelectedEvent(formEvent);
    }, [formEvent, setSelectedEvent]);

    useEffect(() => {
        setRecurringSelected(setInitialRecurringSelected());
    }, [selectedEvent]);

    useEffect(() => {
        if (selectedEvent) {
            setFormEvent(selectedEvent);
            setItems(selectedEvent.lessonObjectives);
        }
    }, [selectedEvent]);

    function setInitialRecurringSelected() {
        let indexModifier = 0;
        if (!isNewEvent) indexModifier = 1;
        return (
            recurringOptions[
                selectedEvent?.recurrenceType === "DAYS" &&
                selectedEvent?.recurrenceValue === 7
                    ? 1 - indexModifier
                    : selectedEvent?.recurrenceType === "DAYS" &&
                      selectedEvent?.recurrenceValue === 14
                    ? 2 - indexModifier
                    : 0
            ] || recurringOptions[0]
        );
    }

    const handleSubmit = (e) => {
        if (!user) return;

        e.preventDefault();

        try {
            const db = getDatabase();
            const date = moment(selectedEvent.dateTime).format("YYYY-MM-DD");
            const time = moment(selectedEvent.dateTime).format("HH:mm");
            const userId = user.uid;

            if (!date || !userId) {
                toast.error("Error saving lesson");
                return;
            }

            let eventToSave = {
                ...selectedEvent,
                dateTime: time,
                recurring: recurringSelected.id !== 0,
                recurrenceType:
                    recurringOptions[recurringSelected.id].recurrenceType,
                recurrenceValue:
                    recurringOptions[recurringSelected.id].recurrenceValue,
            };

            if (items) {
                eventToSave.lessonObjectives = items;
            }

            if (eventToSave.recurring === false) {
                saveNonRecurringEvent(eventToSave, userId, date, db);
            } else {
                saveRecurringEvent(eventToSave, userId, date, db);
            }
        } catch (error) {
            toast.error("Sorry, there was a problem saving your lesson");
            console.error(error);
        }
    };

    function saveRecurringEvent(eventToSave, userId, date, db) {
        if (selectedEvent.id) {
            // Updating an existing event
            const eventId = selectedEvent.id;
            if (!eventId) {
                toast.error("Error saving lesson");
                return;
            }
            // eventToSave minus topic and lessonObjectives
            const recurringEventToSave = {
                ...eventToSave,
                topic: null,
                lessonObjectives: null,
            };
            const path = `users/${userId}/recurringEvents/${eventId}`;
            set(ref(db, path), recurringEventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson updated successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error saving lesson: " + error.message);
                });

            // eventToSave minus dateTime, duration, color, subject, yearGroup
            const instanceEventToSave = {
                topic: eventToSave.topic,
                lessonObjectives: eventToSave.lessonObjectives,
            };
            const instancePath = `users/${userId}/recurringEvents/${eventId}/instances/${date}`;
            set(ref(db, instancePath), instanceEventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson updated successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error saving lesson: " + error.message);
                });
        } else {
            // Creating a new event
            const eventRef = ref(db, `/users/${user.uid}/recurringEvents`);
            const newEventRef = push(eventRef);
            set(newEventRef, eventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson created successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error saving lesson: " + error.message);
                });

            // eventToSave minus dateTime, duration, color, subject, yearGroup
            const instanceEventToSave = {
                topic: eventToSave.topic,
                lessonObjectives: eventToSave.lessonObjectives,
            };
            const instancePath = `users/${userId}/recurringEvents/${newEventRef.key}/instances/${date}`;
            set(ref(db, instancePath), instanceEventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson updated successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error saving lesson: " + error.message);
                });
        }
    }

    function saveNonRecurringEvent(eventToSave, userId, date, db) {
        if (selectedEvent.id) {
            // Updating an existing event
            const eventId = selectedEvent.id;
            if (!eventId) {
                toast.error("Error saving lesson");
                return;
            }
            const path = `users/${userId}/dates/${date}/event/${eventId}`;
            set(ref(db, path), eventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson updated successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error saving lesson: " + error.message);
                });
        } else {
            // Creating a new event
            const eventRef = ref(db, `/users/${user.uid}/dates/${date}/event`);
            const newEventRef = push(eventRef);
            set(newEventRef, eventToSave)
                .then(() => {
                    // Write is complete
                    toast.success("Lesson created successfully");
                    setViewLessonButtonLoading();
                    setEventEdited(false);
                    setIsNewEvent(false);
                    setEvents((events) => [
                        ...events,
                        { ...eventToSave, id: newEventRef.key },
                    ]);
                })
                .catch((error) => {
                    // Handle any errors here
                    toast.error("Error creating lesson: " + error.message);
                });
        }
    }

    function setViewLessonButtonLoading() {
        if (open && showViewLessonButton) {
            setLoading(true);
            setButtonActive(false);
            setTimeout(() => {
                setLoading(false);
                setButtonActive(true);
                setLessonPlanGenerated(true);
            }, 4000);
        }
    }

    const handleDelete = () => {
        if (!user) return;

        const db = getDatabase();
        const date = moment(formEvent.dateTime).format("YYYY-MM-DD");
        const eventId = formEvent.id;
        const userId = user.uid;

        if (!date || !eventId || !userId) {
            toast.error("Error deleting lesson");
            return;
        }

        // Reference to the event in Firebase Realtime Database
        const eventRef = ref(
            db,
            `users/${userId}/dates/${date}/event/${eventId}`
        );

        // Remove the event from Firebase
        remove(eventRef)
            .then(() => {
                // Filter out the deleted event from the local state
                const newEvents = events.filter(
                    (event) => event.id !== eventId
                );
                setEvents(newEvents);

                // Optionally, show a success message
                toast.success("Lesson deleted successfully");

                setOpen(false);
            })
            .catch((error) => {
                // Handle errors here
                toast.error("Error deleting lesson");
            });
    };

    const handleClose = () => {
        if (isNewEvent) {
            handleDelete();
        }
        setOpen(false);
    };

    const handleColorChange = (color) => {
        setEventEdited(true);
        setFormEvent((event) => ({
            ...event,
            color: color,
        }));
    };

    const handleSubjectChange = (subject) => {
        setEventEdited(true);
        setFormEvent((event) => ({
            ...event,
            subject: subject,
        }));
    };

    const handleTopicChange = (topic) => {
        setEventEdited(true);
        setFormEvent((event) => ({
            ...event,
            topic: topic,
        }));
    };

    const handleChangeYearGroup = (index) => {
        setEventEdited(true);
        setFormEvent((event) => ({
            ...event,
            yearGroup: index,
        }));
    };

    const handleChangeDuration = (duration) => {
        setEventEdited(true);
        setFormEvent((event) => ({
            ...event,
            duration: duration,
        }));
    };

    const handleGoToLessonPlan = () => {
        localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
        router.push("/lessonPlanner");
    };

    const handleRegenerateLessonPlan = () => {
        setLessonPlanGenerated(false);
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
                                                            {isNewEvent
                                                                ? "New Lesson"
                                                                : formEvent.subject +
                                                                  " - Year " +
                                                                  formEvent.yearGroup}
                                                        </Dialog.Title>
                                                        <p className="text-sm text-gray-500">
                                                            {isNewEvent
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
                                                {!isNewEvent &&
                                                showViewLessonButton &&
                                                !loading ? (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center mt-4"
                                                        onClick={
                                                            handleGoToLessonPlan
                                                        }
                                                        disabled={!buttonActive}
                                                    >
                                                        <BookOpenIcon
                                                            className="-ml-0.5 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                        View your lesson plan
                                                    </button>
                                                ) : (
                                                    !isNewEvent &&
                                                    formEvent.subject !== "" &&
                                                    showViewLessonButton && (
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center mt-4"
                                                            disabled
                                                        >
                                                            <Spinner />
                                                            <span className="sr-only">
                                                                Loading...
                                                            </span>
                                                            Loading...
                                                        </button>
                                                    )
                                                )}
                                                {!isNewEvent &&
                                                    !showViewLessonButton &&
                                                    eventEdited && (
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center mt-4"
                                                            onClick={
                                                                handleRegenerateLessonPlan
                                                            }
                                                            disabled={
                                                                !buttonActive
                                                            }
                                                        >
                                                            <BookOpenIcon
                                                                className="-ml-0.5 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                            Regenerate your
                                                            lesson plan
                                                        </button>
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

                                                {/* Recurring */}
                                                {isNewEvent ||
                                                    (selectedEvent?.recurring && (
                                                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                            <div>
                                                                <label
                                                                    htmlFor="project-name"
                                                                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                                                                >
                                                                    Repeat
                                                                </label>
                                                            </div>
                                                            <div className="sm:col-span-2">
                                                                <Listbox
                                                                    value={
                                                                        recurringSelected
                                                                    }
                                                                    onChange={
                                                                        setRecurringSelected
                                                                    }
                                                                >
                                                                    {({
                                                                        open,
                                                                    }) => (
                                                                        <>
                                                                            <div className="relative mt-2">
                                                                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                                    <span className="block truncate">
                                                                                        {
                                                                                            recurringSelected.name
                                                                                        }
                                                                                    </span>
                                                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                        <ChevronUpDownIcon
                                                                                            className="h-5 w-5 text-gray-400"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                </Listbox.Button>

                                                                                <Transition
                                                                                    show={
                                                                                        open
                                                                                    }
                                                                                    as={
                                                                                        Fragment
                                                                                    }
                                                                                    leave="transition ease-in duration-100"
                                                                                    leaveFrom="opacity-100"
                                                                                    leaveTo="opacity-0"
                                                                                >
                                                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                        {recurringOptions.map(
                                                                                            (
                                                                                                person
                                                                                            ) => (
                                                                                                <Listbox.Option
                                                                                                    key={
                                                                                                        person.id
                                                                                                    }
                                                                                                    className={({
                                                                                                        active,
                                                                                                    }) =>
                                                                                                        classNames(
                                                                                                            active
                                                                                                                ? "bg-indigo-600 text-white"
                                                                                                                : "text-gray-900",
                                                                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                                        )
                                                                                                    }
                                                                                                    value={
                                                                                                        person
                                                                                                    }
                                                                                                >
                                                                                                    {({
                                                                                                        recurringSelected,
                                                                                                        active,
                                                                                                    }) => (
                                                                                                        <>
                                                                                                            <span
                                                                                                                className={classNames(
                                                                                                                    recurringSelected
                                                                                                                        ? "font-semibold"
                                                                                                                        : "font-normal",
                                                                                                                    "block truncate"
                                                                                                                )}
                                                                                                            >
                                                                                                                {
                                                                                                                    person.name
                                                                                                                }
                                                                                                            </span>

                                                                                                            {recurringSelected ? (
                                                                                                                <span
                                                                                                                    className={classNames(
                                                                                                                        active
                                                                                                                            ? "text-white"
                                                                                                                            : "text-indigo-600",
                                                                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                                    )}
                                                                                                                >
                                                                                                                    <CheckIcon
                                                                                                                        className="h-5 w-5"
                                                                                                                        aria-hidden="true"
                                                                                                                    />
                                                                                                                </span>
                                                                                                            ) : null}
                                                                                                        </>
                                                                                                    )}
                                                                                                </Listbox.Option>
                                                                                            )
                                                                                        )}
                                                                                    </Listbox.Options>
                                                                                </Transition>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </Listbox>
                                                            </div>
                                                        </div>
                                                    ))}

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
                                                            onChange={(e) =>
                                                                handleSubjectChange(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                            onChange={(e) =>
                                                                handleTopicChange(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                                    min="1"
                                                                    max="1000"
                                                                    step="1"
                                                                    value={
                                                                        formEvent.duration
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleChangeDuration(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
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
                                                    className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                        isNewEvent
                                                            ? "bg-white border border-indigo-500 text-indigo-500"
                                                            : "bg-red-600 text-white hover:bg-red-500"
                                                    } `}
                                                    onClick={handleDelete}
                                                >
                                                    {isNewEvent
                                                        ? "Cancel"
                                                        : "Delete"}
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
                                                    className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                                                        eventEdited
                                                            ? "bg-indigo-600 hover:bg-indigo-500"
                                                            : "bg-indigo-200 hover:bg-indigo-300 cursor-not-allowed"
                                                    }`}
                                                    onClick={(e) => {
                                                        if (eventEdited) {
                                                            handleSubmit(e);
                                                        }
                                                    }}
                                                    disabled={!eventEdited}
                                                >
                                                    {isNewEvent
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
