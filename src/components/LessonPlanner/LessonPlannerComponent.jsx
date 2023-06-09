// components/Activity.tsx
import React, { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import ContentStreamer from "./ContentStreamer/ContentStreamer";
import EventForm from "../Scheduler/EventForm/EventForm";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

const initialEvents = [
    {
        id: 1,
        dateTime: "2023-06-06T06:00",
        duration: 60,
        color: "blue",
        day: 3,
        subject: "Maths",
        topic: "Linear Equations",
        lessonObjectives: ["To learn about linear equations"],
        yearGroup: 9,
    },
    {
        id: 2,
        dateTime: "2023-06-06T07:30",
        duration: 150,
        color: "red",
        day: 3,
        subject: "History",
        topic: "The Weimar Republic",
        lessonObjectives: ["Understand why the Weimar Republic was formed"],
        yearGroup: 10,
    },
    {
        id: 3,
        dateTime: "2023-06-07T05:30",
        duration: 150,
        color: "yellow",
        day: 4,
        subject: "English",
        topic: "To Kill a Mockingbird",
        lessonObjectives: [
            "Understanding chapters 3-5 of the book",
            "To learn about the characters",
        ],
        yearGroup: 11,
    },
];

const SchedulerComponent = () => {
    const [openEvent, setOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState(initialEvents);

    useEffect(() => {
        setSelectedEvent(JSON.parse(localStorage.getItem("selectedEvent")));
    }, []);

    return (
        <>
            <NavBar selectedPage={"lessonPlanner"}>
                <>
                    <button
                        type="button"
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-3"
                        onClick={() => setOpenEvent(true)}
                    >
                        <PencilSquareIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                        />
                        Edit Lesson
                    </button>
                </>
            </NavBar>
            <ContentStreamer selectedEvent={selectedEvent} />
            <EventForm
                open={openEvent}
                setOpen={setOpenEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                events={events}
                setEvents={setEvents}
                showViewLessonButton={false}
            />
        </>
    );
};

export default SchedulerComponent;
