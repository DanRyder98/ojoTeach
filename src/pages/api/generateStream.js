import { OpenAI } from "openai-streams/node";

const lessonPlanTemplate = `## Resources

## Starter

## Main

## Plenary

## Homework`;

const DEFAULT_EDITOR_CONTENT = {
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Introducing Novel" }],
        },
        {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text: "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion. Built with ",
                },
                {
                    type: "text",
                    marks: [
                        {
                            type: "link",
                            attrs: {
                                href: "https://tiptap.dev/",
                                target: "_blank",
                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                            },
                        },
                    ],
                    text: "Tiptap",
                },
                { type: "text", text: ", " },
                {
                    type: "text",
                    marks: [
                        {
                            type: "link",
                            attrs: {
                                href: "https://openai.com/",
                                target: "_blank",
                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                            },
                        },
                    ],
                    text: "OpenAI",
                },
                { type: "text", text: ", and the " },
                {
                    type: "text",
                    marks: [
                        {
                            type: "link",
                            attrs: {
                                href: "https://sdk.vercel.ai/docs",
                                target: "_blank",
                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                            },
                        },
                    ],
                    text: "Vercel AI SDK",
                },
                { type: "text", text: " → " },
                { type: "text", marks: [{ type: "code" }], text: "npm i ai" },
            ],
        },
        {
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "Learn more" }],
        },
        {
            type: "orderedList",
            attrs: { start: 1 },
            content: [
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: "Check out the " },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                href: "https://twitter.com/steventey/status/1669762868416512000",
                                                target: "_blank",
                                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                                            },
                                        },
                                    ],
                                    text: "launch video",
                                },
                                { type: "text", text: "." },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: "Star us on " },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                href: "https://github.com/steven-tey/novel",
                                                target: "_blank",
                                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                                            },
                                        },
                                    ],
                                    text: "GitHub",
                                },
                                { type: "text", text: "." },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                href: "https://vercel.com/templates/next.js/novel",
                                                target: "_blank",
                                                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                                            },
                                        },
                                    ],
                                    text: "Deploy",
                                },
                                { type: "text", text: " your own." },
                            ],
                        },
                    ],
                },
            ],
        },
        { type: "paragraph" },
    ],
};

export default async function generateStream(req, res) {
    const lessonData = req.body;

    if (!lessonData) {
        res.status(400).json({
            error: {
                message: "No lesson data provided",
            },
        });
        return;
    }

    try {
        const stream = await OpenAI("chat", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a teacher who specializes in planning lessons.  You should respond in novel when asked for a lesson plan.  Novel is a WYSIWYG text editor, here is an example: " +
                        DEFAULT_EDITOR_CONTENT +
                        "\n  The structure of the lesson plan should be as follows: /n/n" +
                        lessonPlanTemplate,
                },
                {
                    role: "user",
                    content:
                        "Create a lesson plan for the following:" +
                        JSON.stringify(lessonData) +
                        `\n\n Please provide a lesson plan that is as detailed as possible, do not leave things for me to do.`,
                },
            ],
            max_tokens: 2000,
        });

        stream.pipe(res);
    } catch (error) {
        if (error.type === "MAX_TOKENS") {
            res.status(400).json({ error: "Maximum token limit reached." });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
}
