// utils.ts
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatCompletionTextAndImage = async (model: string, prompt: string, image_url: string): Promise<string> => {
    /* TODO: Using OpenAI API to get your response with a text and an image input.
       This server action purely takes your input and sends to GPT model to get your response. */
};

const chatCompletionTextOnly = async (model: string, prompt: string): Promise<string> => {
    /* TODO: Using OpenAI API to get your response with only a text input.
       This server action purely takes your input and sends to GPT model to get your response. */
};

export { chatCompletionTextAndImage, chatCompletionTextOnly };