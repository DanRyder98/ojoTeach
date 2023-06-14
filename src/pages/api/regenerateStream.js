import { OpenAI } from "openai-streams/node";

const lessonPlanTemplate = `# Lesson Plan

## Lesson Objectives

## Resources

## Starter

## Main

## Plenary

## Homework`;

export default async function regenerateStream(req, res) {
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
                        "You are a teacher who specializes in planning lessons.  You have already planned a lesson with the following format:" +
                        lessonPlanTemplate +
                        ".  There has been a request to regenerate a section of the lesson plan, you will be provided with the original plan, and the section that needs to be regenerated.  You will then need to regenerate the section and return it in markdown.",
                },
                {
                    role: "user",
                    content:
                        "Here is the original lesson plan:" +
                        JSON.stringify(lessonData.lessonPlan) +
                        ".  Here is the section that needs to be regenerated:" +
                        JSON.stringify(lessonData.section) +
                        ".",
                },
            ],
            temperature: 0.9,
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
