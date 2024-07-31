"use server";

import { ClothingType } from "@/type";
import { chatCompletionTextAndImage } from "./utils";
import { Erica_One } from "next/font/google";

const makePrompt = (clothing_type: ClothingType): string => {
  const prompt: string = `
    仔細觀察這張圖片中的衣物，這是一件${
      clothing_type === "top" ? "上衣" : "下身"
    }。接下來，精確且細膩地描述，提供一個詳細的 multi-tags 列表。確保涵蓋每一個細節，包括顏色、材質、設計、功能等。每類可有多個標籤以涵蓋所有細節。需要的話，你可以使用規範以外的標籤來完成你的任務。
    請仿造下方格式回覆，回答無需包含其他資訊：
    ${
      clothing_type === "top"
        ? "顏色:[顏色], 服裝類型:[類型], 剪裁版型:[描述], 設計特點:[描述], 材質:[材質], 配件:[描述]（無的話可略）, 細節:[描述], 領子:[描述], 袖子:[描述]"
        : "顏色:[顏色], 服裝類型:[類型], 剪裁版型:[描述], 設計特點:[描述], 材質:[材質], 配件:[描述]（無的話可略）, 細節:[描述], 褲管:[描述]"
    }
    `;
  return prompt;
};

const extractLabelsFromImage = async (
  image_url: string,
  clothing_type: ClothingType
): Promise<string | null> => {
  /* TODO: The whole process of extracting labels from an image. */
  /* You can utilize chatCompletionTextAndImage() to get response from gpt. */
  /* You should utilize validateResponseFormat() to make sure your output has the correct format. */
  const model: string = "gpt-4o-mini";
  const prompt: string = makePrompt(clothing_type);
  console.log(prompt);
  try {
    const response: string | null = await chatCompletionTextAndImage({
      model,
      prompt,
      image_url,
    });
    // TODO:  Validate response format
    // END TODO
    return response;
  } catch (error) {
    console.error("Error in extractLabelsFromImage:", error);
    return null;
  }
  /* END TODO */
};

const validateResponseFormat = (image_label_string: string): boolean => {
  /* TODO: Validate the format of the response you get from GPT.
       Implement your validation logic here. */
  return true;
};

export { extractLabelsFromImage, validateResponseFormat };
