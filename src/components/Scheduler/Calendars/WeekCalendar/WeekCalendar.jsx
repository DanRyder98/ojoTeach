import { Fragment, useState, useEffect, useRef } from "react";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import Event from "./Event/Event";

import moment from "moment";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function WeekCalendar({
    setOpenEvent,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
}) {
    const container = useRef(null);
    const containerNav = useRef(null);
    const containerOffset = useRef(null);

    useEffect(() => {
        // Set the container scroll position based on the current time.
        const currentMinute = new Date().getHours() * 60;
        container.current.scrollTop =
            ((container.current.scrollHeight -
                containerNav.current.offsetHeight -
                containerOffset.current.offsetHeight) *
                currentMinute) /
            1440;
    }, []);

    // const date = moment().format("YYYY-MM-DD");

    // Define your query function
    // const fetchEvents = async () => {
    //     if (auth.currentUser) {
    //         const userId = auth.currentUser.uid;
    //         const response = await axios.get(`/api/getWeek/${userId}/${date}`);
    //         return response.data;
    //     } else {
    //         return [];
    //     }
    // };

    const days = [];

    for (let i = 0; i < 7; i++) {
        const day = moment().day(i).format("ddd D");
        days.push(
            <div className="flex items-center justify-center py-3" key={i}>
                <span>
                    {day.split(" ")[0]}{" "}
                    <span className="items-center justify-center font-semibold text-gray-900">
                        {day.split(" ")[1]}
                    </span>
                </span>
            </div>
        );
    }

    const now = new Date();
    const minutesIntoDay = now.getHours() * 60 + now.getMinutes();
    const totalMinutesInDay = 24 * 60;
    const topPosition = (minutesIntoDay / totalMinutesInDay) * 100;
    const currentDay = now.getDay();

    // Array of hours
    const hours = Array.from({ length: 24 }, (_, i) => (i === 0 ? 12 : i % 12));

    // Function to generate AM or PM based on the hour
    const getMeridiem = (hour) => (hour < 12 || hour === 24 ? "AM" : "PM");

    const calendarGridRef = useRef(); // Ref to the calendar grid container

    const checkIfEventExists = (dateTime) => {
        for (let event of events) {
            const eventStartTime = moment(event.dateTime);
            const eventEndTime = moment(event.dateTime).add(
                event.duration,
                "minutes"
            );

            const clickedTime = moment(dateTime);

            if (
                clickedTime.isSameOrAfter(eventStartTime) &&
                clickedTime.isSameOrBefore(eventEndTime)
            ) {
                return true;
            }
        }
        return false;
    };

    const handleGridClick = (e) => {
        const { top, left, height, width } =
            calendarGridRef.current.getBoundingClientRect();
        const clickedHour = Math.floor(((e.clientY - top) / height) * 24); // Assuming 24 hours
        const clickedDay = Math.floor(((e.clientX - left) / width) * 7); // Assuming 7 days
        const clickedDateTime = moment()
            .hour(clickedHour)
            .day(clickedDay)
            .minute(0)
            .second(0)
            .format();

        if (checkIfEventExists(clickedDateTime)) {
            return;
        }

        const newEvent = {
            title: "",
            dateTime: clickedDateTime,
            duration: 60,
            color: "blue",
            day: clickedDay + 1,
            subject: "",
            topic: "",
            lessonObjectives: [],
            yearGroup: null,
        };
        setSelectedEvent(newEvent);
        setEvents([...events, newEvent]);
        setOpenEvent(true);
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    <time dateTime={moment.dateTime}>
                        {moment().format("MMMM YYYY")}
                    </time>
                </h1>
                <div className="flex items-center">
                    <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                        <div
                            className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
                            aria-hidden="true"
                        />
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous week</span>
                            <ChevronLeftIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </button>
                        <button
                            type="button"
                            className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                        >
                            Today
                        </button>
                        <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Next week</span>
                            <ChevronRightIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <div className="hidden md:ml-4 md:flex md:items-center">
                        <Menu as="div" className="relative">
                            <Menu.Button
                                type="button"
                                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Week view
                                <ChevronDownIcon
                                    className="-mr-1 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm"
                                                    )}
                                                >
                                                    Day view
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm"
                                                    )}
                                                >
                                                    Week view
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm"
                                                    )}
                                                >
                                                    Month view
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm"
                                                    )}
                                                >
                                                    Year view
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        <div className="ml-6 h-6 w-px bg-gray-300" />
                        <button
                            type="button"
                            className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add event
                        </button>
                    </div>
                    <Menu as="div" className="relative ml-6 md:hidden">
                        <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Open menu</span>
                            <EllipsisHorizontalIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Create event
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Go to today
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Day view
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Week view
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Month view
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Year view
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </header>
            <div
                ref={container}
                className="isolate flex flex-auto flex-col overflow-auto bg-white"
            >
                <div
                    style={{ width: "165%" }}
                    className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
                >
                    <div
                        ref={containerNav}
                        className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
                    >
                        <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                M{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    10
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                T{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    11
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                W{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                                    12
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                T{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    13
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                F{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    14
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                S{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    15
                                </span>
                            </button>
                            <button
                                type="button"
                                className="flex flex-col items-center pb-3 pt-2"
                            >
                                S{" "}
                                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                                    16
                                </span>
                            </button>
                        </div>

                        <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
                            <div className="col-end-1 w-14" />
                            {days}
                        </div>
                    </div>
                    <div
                        className="flex flex-auto"
                        ref={calendarGridRef}
                        onClick={handleGridClick}
                    >
                        <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
                        <div className="grid flex-auto grid-cols-1 grid-rows-1">
                            {/* Horizontal lines */}
                            <div
                                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                                style={{
                                    gridTemplateRows:
                                        "repeat(48, minmax(3.5rem, 1fr))",
                                }}
                            >
                                <div
                                    ref={containerOffset}
                                    className="row-end-1 h-7"
                                ></div>

                                {hours.map((hour, i) => (
                                    <Fragment key={i}>
                                        <div>
                                            <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                                {hour === 12 ? 12 : hour % 12}
                                                {getMeridiem(i)}
                                            </div>
                                        </div>
                                        <div />
                                    </Fragment>
                                ))}
                            </div>

                            {/* Vertical lines */}
                            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                                {[...Array(7)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="row-span-full"
                                        style={{
                                            position: "relative", // You need relative positioning here for the child absolute positioning to work correctly
                                        }}
                                    >
                                        {currentDay === index && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: `${topPosition}%`,
                                                    left: 0,
                                                    right: 0,
                                                    height: "2px", // or whatever height you want for the line
                                                    backgroundColor: "red", // or whatever color you want for the line
                                                    zIndex: 10,
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="col-start-8 row-span-full w-8" />
                            </div>

                            {/* Events */}
                            <ol
                                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                                style={{
                                    gridTemplateRows:
                                        "1.75rem repeat(288, minmax(0, 1fr)) auto",
                                }}
                            >
                                {events.map((event) => (
                                    <Event
                                        key={event.dateTime + "event"}
                                        event={event}
                                        setOpenEvent={setOpenEvent}
                                        setSelectedEvent={setSelectedEvent}
                                    />
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
