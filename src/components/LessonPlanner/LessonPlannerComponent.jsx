// components/Activity.tsx
import React from "react";
import NavBar from "../common/NavBar";
import ContentStreamer from "./ContentStreamer/ContentStreamer";

const SchedulerComponent = () => {
    return (
        <>
            <NavBar selectedPage={"lessonPlanner"} />
            <ContentStreamer />
        </>
    );
};

export default SchedulerComponent;
