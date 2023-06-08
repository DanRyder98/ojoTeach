import React, { useState, useEffect } from "react";
import WeekCalendar from "./Calendars/WeekCalendar/WeekCalendar";
import EventForm from "./EventForm/EventForm";
import { getDatabase, ref, onValue } from "firebase/database";
import moment from "moment";
import { useUser } from "../common/UserContext";

const SchedulerComponent = () => {
    const [openEvent, setOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [isNewEvent, setIsNewEvent] = useState(false);
    const user = useUser();

    useEffect(() => {
        if (!user) return;

        const db = getDatabase();
        const startDate = moment().startOf("week").format("YYYY-MM-DD");
        const endDate = moment().endOf("week").format("YYYY-MM-DD");

        const datesRef = ref(db, `/users/${user.uid}/dates`);

        onValue(datesRef, (snapshot) => {
            const data = snapshot.val();
            const eventsData = [];

            for (let date in data) {
                if (
                    moment(date).isBetween(startDate, endDate, undefined, "[]")
                ) {
                    for (let eventId in data[date].event) {
                        eventsData.push({
                            ...data[date].event[eventId],
                            id: eventId,
                            dateTime:
                                date + "T" + data[date].event[eventId].dateTime,
                        });
                    }
                }
            }

            setEvents(eventsData);
        });
    }, [user]);

    return (
        <>
            <WeekCalendar
                setOpenEvent={setOpenEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                events={events}
                setEvents={setEvents}
                setIsNewEvent={setIsNewEvent}
            />
            <EventForm
                open={openEvent}
                setOpen={setOpenEvent}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                events={events}
                setEvents={setEvents}
                showViewLessonButton={true}
                isNewEvent={isNewEvent}
            />
        </>
    );
};

export default SchedulerComponent;

// const initialEvents = [
//     {
//         id: 1,
//         dateTime: "2023-06-06T06:00",
//         duration: 60,
//         color: "blue",
//         subject: "Maths",
//         topic: "Linear Equations",
//         lessonObjectives: ["To learn about linear equations"],
//         yearGroup: 9,
//     },
//     {
//         id: 2,
//         dateTime: "2023-06-06T07:30",
//         duration: 150,
//         color: "red",
//         subject: "History",
//         topic: "The Weimar Republic",
//         lessonObjectives: ["Understand why the Weimar Republic was formed"],
//         yearGroup: 10,
//     },
//     {
//         id: 3,
//         dateTime: "2023-06-07T05:30",
//         duration: 150,
//         color: "yellow",
//         subject: "English",
//         topic: "To Kill a Mockingbird",
//         lessonObjectives: [
//             "Understanding chapters 3-5 of the book",
//             "To learn about the characters",
//         ],
//         yearGroup: 11,
//     },
// ];
