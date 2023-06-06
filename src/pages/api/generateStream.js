import { OpenAI } from "openai-streams/node";

export default async function test(req, res) {
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
                        "You are a teacher who specializes in planning lessons.  You should respond in markdown when asked for a lesson plan.",
                },
                {
                    role: "user",
                    content:
                        "Create a lesson plan for the following:" +
                        JSON.stringify(lessonData),
                },
            ],
            max_tokens: 20,
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
