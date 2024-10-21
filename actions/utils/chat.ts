"use server";
import openai from "@/utils/openai";
import { ImageURL } from "openai/resources/beta/threads/messages";

//send requests to the OpenAI API with both text and image inputs
const sendImgURLAndPromptToGPT = async ({
  model,
  prompt,
  imageUrl,
}: {
  model: string;
  prompt: string;
  imageUrl: string;
}): Promise<string | null> => {
  const NUM_MAX_RETRIES = 5;
  for (let numRetries = 0; numRetries < NUM_MAX_RETRIES; ++numRetries) {
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageUrl } as ImageURL,
              },
            ],
          },
        ],
      });
      const response = completion.choices[0].message.content;
      return response;
    } catch (e) {
      console.log("Failed to get response from GPT API.");
      console.log(e);
      if (numRetries < NUM_MAX_RETRIES) {
        console.log("Retrying...");
      }
    }
  }
  return null;
};

//send requests to the OpenAI API with both text and image inputs
const sendPromptToGPT = async ({
  model,
  prompt,
}: {
  model: string;
  prompt: string;
}): Promise<string | null> => {
  const NUM_MAX_RETRIES = 5;
  for (let numRetries = 0; numRetries < NUM_MAX_RETRIES; ++numRetries) {
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
            ],
          },
        ],
      });
      const response = completion.choices[0].message.content;
      return response;
    } catch (e) {
      console.log("Failed to get response from GPT API.");
      console.log(e);
      if (numRetries < NUM_MAX_RETRIES) {
        console.log("Retrying...");
      }
    }
  }
  return null;
};

//check if the response is ok and content type is an image
const isImageUrlValid = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking image URL:", error);
    return false;
  }
};


export { sendImgURLAndPromptToGPT, isImageUrlValid, sendPromptToGPT };
