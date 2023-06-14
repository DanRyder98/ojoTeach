import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";

export default function EditableLessonPlan({ stream, setOpen }) {
    const [lessonPlan, setLessonPlan] = useState(stream);
    const [sections, setSections] = useState([]);
    const [sectionStream, setSectionStream] = useState("");

    useEffect(() => {
        // Split the markdown content into sections based on headers
        const initialSections = stream.split(/\n## /).map((section, index) => {
            // Add the "## " prefix back to all sections except the first
            return (index !== 0 ? "## " : "") + section;
        });

        setSections(initialSections);
    }, [stream]);

    const handleRegenerateSection = async (section, index) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + "api/regenerateStream",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ lessonPlan: sections.join("\n## "), section: section }),
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
            let newSectionContent = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // accumulate the new chunk of text
                newSectionContent += decoder.decode(value);

                // set the new section in the sections array
                setSections((prevSections) => {
                    const newSections = [...prevSections];
                    newSections[index] = newSectionContent;
                    return newSections;
                });
            }
        } catch (error) {
            toast.error("Error regenerating section");
            console.error(error);
        }
    };

    return (
        <div>
            {sections.map((section, index) => (
                <div
                    key={index}
                    className="my-4 relative border-2 border-transparent hover:border-gray-300 rounded-md p-4 group"
                >
                    <ReactMarkdown className="prose prose-lg">{section}</ReactMarkdown>
                    {index > 1 ? (
                        <button
                            onClick={() => handleRegenerateSection(section, index)}
                            className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-800 md:hidden group-hover:block"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setOpen(true);
                            }}
                            className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-800 md:hidden group-hover:block"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
