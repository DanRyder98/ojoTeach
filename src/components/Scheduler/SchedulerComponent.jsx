import React, { useState, useEffect } from "react";
import WeekCalendar from "./Calendars/WeekCalendar/WeekCalendar";
import EventForm from "./EventForm/EventForm";
import Spinner from "../common/Spinner";
import { getDatabase, ref, onValue } from "firebase/database";
import moment from "moment";
import { useUser } from "../common/UserContext";

const SchedulerComponent = () => {
    const [openEvent, setOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [isNewEvent, setIsNewEvent] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useUser();

    useEffect(() => {
        const isRecurringEventOccurringThisWeek = (
            recurringEvent,
            weekStartDate,
            weekEndDate
        ) => {
            // if instances doesn't contain at least one date, return false
            if (!recurringEvent.instances) return false;

            let instanceDate = Object.keys(recurringEvent.instances)[0]; // assuming instances contain at least one date
            let nextOccurrence = moment(instanceDate);

            const { recurrenceType, recurrenceValue } = recurringEvent;

            while (nextOccurrence.isSameOrBefore(weekEndDate)) {
                if (nextOccurrence.isSameOrAfter(weekStartDate)) {
                    return true; // The recurring event has an occurrence this week
                }

                if (recurrenceType === "DAYS") {
                    nextOccurrence.add(recurrenceValue, "days");
                } else if (recurrenceType === "WEEKS") {
                    nextOccurrence.add(recurrenceValue, "weeks");
                } else if (recurrenceType === "MONTHS") {
                    nextOccurrence.add(recurrenceValue, "months");
                }
            }
            return false; // The recurring event does not have an occurrence this week
        };

        const fetchEvents = () => {
            if (!user) return;

            setLoading(true); // Set loading to true before fetching data

            const db = getDatabase();
            const weekStartDate = moment().startOf("week").format("YYYY-MM-DD");
            const weekEndDate = moment().endOf("week").format("YYYY-MM-DD");

            const datesRef = ref(db, `/users/${user.uid}/dates`);
            const recurringEventsRef = ref(
                db,
                `/users/${user.uid}/recurringEvents`
            );

            let eventsData = [];


            const updateEvents = (newEvents) => {
                eventsData = eventsData.concat(newEvents);

                // Update state here
                setEvents(eventsData);
                setLoading(false);
            };

            // Fetch non-recurring events
            onValue(datesRef, (snapshot) => {
                const data = snapshot.val();

                for (let date in data) {
                    if (
                        moment(date).isBetween(
                            weekStartDate,
                            weekEndDate,
                            undefined,
                            "[]"
                        )
                    ) {
                        for (let eventId in data[date].event) {
                            eventsData.push({
                                ...data[date].event[eventId],
                                id: eventId,
                                dateTime:
                                    date +
                                    "T" +
                                    data[date].event[eventId].dateTime,
                                recurring: false,
                            });
                        }
                    }
                }
                // updateEvents(eventsData);
            });

            // Fetch recurring events
            onValue(recurringEventsRef, (snapshot) => {
                const data = snapshot.val();

                // Fetch all recurring events and filter those occurring this week
                const recurringEventsData = [];
                for (let eventId in data) {
                    const recurringEvent = data[eventId];

                    if (
                        isRecurringEventOccurringThisWeek(
                            recurringEvent,
                            weekStartDate,
                            weekEndDate
                        )
                    ) {
                        recurringEventsData.push(recurringEvent);
                    }
                }

                // For each recurring event, calculate its occurrences in the current week
                recurringEventsData.forEach((recurringEvent) => {
                    const {
                        recurrenceType,
                        recurrenceValue,
                        dateTime,
                        instances,
                    } = recurringEvent;
                    let instanceDate = Object.keys(instances)[0];
                    let nextOccurrence = moment(instanceDate);

                    while (nextOccurrence.isSameOrBefore(weekEndDate)) {
                        if (nextOccurrence.isSameOrAfter(weekStartDate)) {
                            eventsData.push({
                                ...recurringEvent,
                                dateTime:
                                    nextOccurrence.format("YYYY-MM-DD") +
                                    "T" +
                                    dateTime,
                                recurring: true,
                            });
                        }

                        if (recurrenceType === "DAYS") {
                            nextOccurrence.add(recurrenceValue, "days");
                        } else if (recurrenceType === "WEEKS") {
                            nextOccurrence.add(recurrenceValue, "weeks");
                        } else if (recurrenceType === "MONTHS") {
                            nextOccurrence.add(recurrenceValue, "months");
                        }
                    }
                });
                // updateEvents(recurringEventsData);
                setEvents(eventsData);
                setLoading(false);
            });
        };

        fetchEvents();
    }, [user]);

    return (
        <>
            {loading && (
                <div className="absolute top-1/2 left-1/2">
                    <Spinner size={9} />
                </div>
            )}
            <div
                style={{
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? "none" : "auto",
                }}
            >
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
                    setIsNewEvent={setIsNewEvent}
                />
            </div>
        </>
    );
};

export default SchedulerComponent;
