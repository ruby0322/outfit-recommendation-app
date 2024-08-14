"use server";
import openai from "@/utils/openai";
import { ImageURL } from "openai/resources/beta/threads/messages";
import { setTimeout } from "timers/promises";

// Function to handle chat completion with both text and image input
const chatCompletionTextAndImage = async ({
  model,
  prompt,
  image_url,
}: {
  model: string;
  prompt: string;
  image_url: string;
}): Promise<string | null> => {
  try {
    // Sending a request to the OpenAI API with both text and image inputs
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image_url, detail: "high" } as ImageURL  },
          ],
        },
      ],
    });

    // Extracting and returning the response content
    const response = completion.choices[0].message.content;
    await setTimeout(5000);
    console.log("Waited 5s");
    return response;
  } catch (e) {
    console.log("Failed to get response from GPT API.");
    console.log(e);
    return null;
  }
};

// Function to handle chat completion with text input only
const chatCompletionTextOnly = async ({
  model,
  prompt,
}: {
  model: string;
  prompt: string;
}): Promise<string | null> => {
  try {
    // Sending a request to the OpenAI API with only text input
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    // Extracting and returning the response content
    const response = completion.choices[0].message.content;
    return response;
  } catch (e) {
    console.log("Failed to get response from GPT API.");
    console.log(e);
    return null;
  }
};

export { chatCompletionTextAndImage, chatCompletionTextOnly };
