import React, { useEffect, useRef, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const ContentStreamer = () => {
    const [stream, setStream] = useState("");
    const fetchPerformed = useRef(false);

    useEffect(() => {
        if (!fetchPerformed.current) {
            fetchStream().catch(console.error);
            fetchPerformed.current = true;
        }
    }, []);

    async function fetchStream() {
        const testLessonData = {
            subject: "Computing",
            classCode: "CP3",
            location: "Alan Gilbert Room 4",
            yearGroup: 10,
            topic: "Switch statements",
            lessonObjectives: [
                "understand an example of a switch statement in python",
                "implement your own switch statement using scratch",
                "extension objective to also implement it using python",
            ],
        };

        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "api/generateStream",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testLessonData),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.body === null) {
            throw new Error("No body found");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // decode and add the new chunk of text to the existing stream
            setStream((prevStream) => prevStream + decoder.decode(value));
        }
    }

    return (
        <>
            <ReactMarkdown>{stream}</ReactMarkdown>
        </>
    );
};

export default ContentStreamer;