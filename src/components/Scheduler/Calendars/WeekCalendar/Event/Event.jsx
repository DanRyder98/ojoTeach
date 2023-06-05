import moment from "moment";
import { eventColors, textColors, textColorsLight } from "@/styles/colors";

const eventColumn = {
    0: "col-start-0",
    1: "col-start-1",
    2: "col-start-2",
    3: "col-start-3",
    4: "col-start-4",
    5: "col-start-5",
    6: "col-start-6",
}

export default function Event({ event, setOpenEvent, setSelectedEvent }) {
    const handleSelectEvent = () => {
        setSelectedEvent(event);
        setOpenEvent(true);
    };
    //relative mt-px flex sm:col-start-3
    return (
        <>
            <li
                key={event.dateTime + "event"}
                className={`relative mt-px sm:${eventColumn[event.day]} flex`}
                style={{
                    gridRow: `${
                        moment(event.dateTime).hours() * 12 +
                        Math.floor(moment(event.dateTime).minutes() / 5) +
                        2
                    } / span ${event.duration / 5}`,
                }}
                onClick={handleSelectEvent}
            >
                <a
                    href="#"
                    className={`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${
                        eventColors[event.color]
                    } p-2 text-xs leading-5`}
                >
                    <p
                        className={`order-1 font-semibold ${
                            textColors[event.color]
                        }`}
                    >
                        {event.subject}
                    </p>
                    <p
                        className={`order-1 font-semibold ${
                            textColors[event.color]
                        }`}
                    >
                        {event.yearGroup && `Year ${event.yearGroup}`}
                    </p>
                    <p
                        className={`${
                            textColorsLight[event.color]
                        } group-hover:${textColors[event.color]}`}
                    >
                        <time dateTime={event.dateTime}>
                            {moment(event.dateTime).format("h:mm A")}
                        </time>
                    </p>
                </a>
            </li>
            {/* <li
                className="relative mt-px flex sm:col-start-3"
                style={{ gridRow: "74 / span 12" }}
            >
                <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                >
                    <p className="order-1 font-semibold text-blue-700">
                        Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                        <time dateTime="2022-01-12T06:00">6:00 AM</time>
                    </p>
                </a>
            </li> */}
        </>
    );
}
