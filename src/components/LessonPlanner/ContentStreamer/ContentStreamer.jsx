import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import EditableLessonPlan from "./EditableLessonPlan/EditableLessonPlan";
import Editor from "../../../ui/editor";

const ContentStreamer = ({ selectedEvent, setOpen }) => {
    const [stream, setStream] = useState("Loading...");
    const [generateLesson, setGenerateLesson] = useState(false);
    const fetchPerformed = useRef(false);

    useEffect(() => {
        if (generateLesson) {
        setStream(
            `\n# ${selectedEvent?.subject} - Year ${selectedEvent?.yearGroup}\n\n## ${
                selectedEvent?.topic
            }\n\n### Lesson Objectives\n${selectedEvent?.lessonObjectives
                ?.map((objective) => `- ${objective}`)
                .join("\n")}\n`
        );
            }
    }, [generateLesson, selectedEvent?.lessonObjectives, selectedEvent?.subject, selectedEvent?.topic, selectedEvent?.yearGroup]);
    

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
        if (!generateLesson) {
            return
        }

        if (!selectedEvent) {
            return;
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/generateStream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedEvent),
            });

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
                    setGenerateLesson(false);
                    break;
                }

                // decode and add the new chunk of text to the existing stream
                setStream(decoder.decode(value));
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
                        {/* <EditableLessonPlan stream={stream} setOpen={setOpen} /> */}
                        <Editor initialStream={stream} generateLesson={generateLesson} setGenerateLesson={setGenerateLesson} />
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContentStreamer;
