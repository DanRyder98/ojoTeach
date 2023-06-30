import { OpenAI } from "openai-streams/node";

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
                        "You are an AI writing assistant that continues existing text based on context from prior text. " +
                        "Give more weight/priority to the later characters than the beginning ones. Make sure to construct complete sentences.",
                },
                {
                    role: "user",
                    content:
                        "Create a lesson plan for the following:" +
                        JSON.stringify(lessonData) +
                        `\n\n Please provide a lesson plan that is as detailed as possible, do not leave things for me to do, and make sure to structure it nicely in markdown.`,
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
