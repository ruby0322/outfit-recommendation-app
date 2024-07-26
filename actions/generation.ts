"use server";

import openai from "@/utils/openai";

const askGPT = async (role: string, prompt: string): Promise<string> => {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: role },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o",
  });
  return completion.choices[0].message.content as string;
};

export { askGPT };
