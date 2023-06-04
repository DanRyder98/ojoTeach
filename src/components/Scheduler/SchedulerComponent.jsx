// components/Activity.tsx
import React, { useState } from "react";
import WeekCalendar from "./Calendars/WeekCalendar/WeekCalendar";
import EventForm from "./EventForm/EventForm";

const SchedulerComponent = () => {
    const [openEvent, setOpenEvent] = useState(false);

    return (
        <div>
            <WeekCalendar setOpenEvent={setOpenEvent} />
            <EventForm open={openEvent} setOpen={setOpenEvent} />
        </div>
    );
};

export default SchedulerComponent;
