"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import StarterKit from "@tiptap/starter-kit";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { getPrevText } from "@/lib/editor";
import { Markdown } from "tiptap-markdown";
import DEFAULT_EDITOR_CONTENT from "./default-content";

import { EditorBubbleMenu } from "./components";

export default function Editor({ initialStream, generateLesson, setGenerateLesson }) {
    const [content, setContent] = useLocalStorage("content");
    const [saveStatus, setSaveStatus] = useState("Saved");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (
            !JSON.parse(localStorage.getItem("content")) ||
            !JSON.parse(localStorage.getItem("content")).content ||
            !JSON.parse(localStorage.getItem("content")).content[0] ||
            !JSON.parse(localStorage.getItem("content")).content[0].content ||
            generateLesson === true
        ) {
            setGenerateLesson(true);
        }
    }, [content, generateLesson, setGenerateLesson]);

    const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
        const json = editor.getJSON();
        setSaveStatus("Saving...");
        setContent(json);
        // Simulate a delay in saving.
        setTimeout(() => {
            setSaveStatus("Saved");
        }, 500);
    }, 750);

    const editor = useEditor({
        extensions: TiptapExtensions,
        editorProps: TiptapEditorProps,
        onUpdate: (e) => {
            setSaveStatus("Unsaved");
            const selection = e.editor.state.selection;
            const lastTwo = getPrevText(e.editor, {
                chars: 2,
            });
            if (lastTwo === "++" && !isLoading) {
                e.editor.commands.deleteRange({
                    from: selection.from - 2,
                    to: selection.from,
                });
                complete(
                    getPrevText(e.editor, {
                        chars: 5000,
                    })
                );
                // complete(e.editor.storage.markdown.getMarkdown());
                va.track("Autocomplete Shortcut Used");
            } else {
                debouncedUpdates(e);
            }
        },
        autofocus: "end",
    });

    useEffect(() => {
        editor?.commands.insertContent(initialStream, {
            parseOptions: {
                preserveWhitespace: "full",
            },
        });
    }, [initialStream]);

    const { complete, completion, isLoading, stop } = useCompletion({
        id: "novel",
        api: "/api/generate/route",
        onResponse: (response) => {
            if (response.status === 429) {
                toast.error("You have reached your request limit for the day.");
                va.track("Rate Limit Reached");
                return;
            }
        },
        onFinish: (_prompt, completion) => {
            editor?.commands.setTextSelection({
                from: editor.state.selection.from - completion.length,
                to: editor.state.selection.from,
            });
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });

    const prev = useRef("");

    // Insert chunks of the generated text
    useEffect(() => {
        const diff = completion.slice(prev.current.length);
        prev.current = completion;
        editor?.commands.insertContent(diff, {
            parseOptions: {
                preserveWhitespace: "full",
            },
        });
    }, [isLoading, editor, completion]);

    useEffect(() => {
        // if user presses escape or cmd + z and it's loading,
        // stop the request, delete the completion, and insert back the "++"
        const onKeyDown = (e) => {
            if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
                stop();
                if (e.key === "Escape") {
                    editor?.commands.deleteRange({
                        from: editor.state.selection.from - completion.length,
                        to: editor.state.selection.from,
                    });
                }
                editor?.commands.insertContent("++");
            }
        };
        const mousedownHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            stop();
            if (window.confirm("AI writing paused. Continue?")) {
                complete(editor?.getText() || "");
            }
        };
        if (isLoading) {
            document.addEventListener("keydown", onKeyDown);
            window.addEventListener("mousedown", mousedownHandler);
        } else {
            document.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("mousedown", mousedownHandler);
        }
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("mousedown", mousedownHandler);
        };
    }, [stop, isLoading, editor, complete, completion.length]);

    // Hydrate the editor with the content from localStorage.
    useEffect(() => {
        if (editor && content && !hydrated) {
            editor.commands.setContent(content);
            setHydrated(true);
        }
    }, [editor, content, hydrated]);

    return (
        <div
            onClick={() => {
                editor?.chain().focus().run();
            }}
            className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
        >
            <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
                {saveStatus}
            </div>

            {editor ? (
                <>
                    <EditorContent editor={editor} />
                    <EditorBubbleMenu editor={editor} />
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
