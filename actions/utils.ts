// utils.ts
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatCompletionTextAndImage = async (model: string, prompt: string, image_url: string): Promise<string> => {
    /* TODO: Using OpenAI API to get your response with a text and an image input.
       This server action purely takes your input and sends to GPT model to get your response. */
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: image_url },
            ] }],
        });
        const response = completion.choices[0];
        return response;
    } catch (e) {
        console.log("Failed to get response from GPT API.");
        console.log(e);
        return "";
    };
};

const chatCompletionTextOnly = async (model: string, prompt: string): Promise<string> => {
    /* TODO: Using OpenAI API to get your response with only a text input.
       This server action purely takes your input and sends to GPT model to get your response. */
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
        });
        const response = completion.choices[0];
        return response;
    } catch (e) {
        console.log("Failed to get response from GPT API.");
        console.log(e);
        return "";
    };
};

export { chatCompletionTextAndImage, chatCompletionTextOnly };