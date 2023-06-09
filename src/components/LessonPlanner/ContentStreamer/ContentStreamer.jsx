import React, { useEffect, useRef, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { toast } from "react-hot-toast";

const ContentStreamer = ({ selectedEvent }) => {
    const [stream, setStream] = useState("");
    const fetchPerformed = useRef(false);

    useEffect(() => {
        if (!selectedEvent) {
            return;
        }

        if (!fetchPerformed.current) {
            fetchStream().catch(console.error);
            fetchPerformed.current = true;
        }
    }, [selectedEvent]);

    async function fetchStream() {
        if (!selectedEvent) {
            return;
        }

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + "api/generateStream",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedEvent),
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
        } catch (error) {
            toast.error("Error getting lesson plan");
            console.error(error);
        }
    }

    return (
        <>
            <div className="py-5">
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <ReactMarkdown>{stream}</ReactMarkdown>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContentStreamer;
