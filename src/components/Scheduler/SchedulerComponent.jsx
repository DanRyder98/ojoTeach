// components/Activity.tsx
import React, { useState } from "react";
import WeekCalendar from "./Calendars/WeekCalendar/WeekCalendar";
import EventForm from "./EventForm/EventForm";

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

    return (
        <div>
            <WeekCalendar
                setOpenEvent={setOpenEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                events={events}
                setEvents={setEvents}
            />
            <EventForm
                open={openEvent}
                setOpen={setOpenEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                events={events}
                setEvents={setEvents}
            />
        </div>
    );
};

export default SchedulerComponent;
