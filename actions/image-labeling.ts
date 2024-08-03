"use server";

import { ClothingType } from "@/type";
import { chatCompletionTextAndImage } from "./utils";
import { Erica_One } from "next/font/google";
import { error } from "console";

const makePrompt = (clothing_type: ClothingType): string => {
  const prompt: string = `
    仔細觀察這張圖片中的${
      clothing_type === "top" ? "上衣" : "下身類衣物"
    }後，提供一個詳細的 multi-tags 列表。確保涵蓋每一個細節，包括顏色、材質、設計、功能等。每類可有多個標籤以涵蓋所有細節。需要的話，你可以使用規範以外的標籤來完成你的任務。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    {
      "顏色": "[顏色]",
      "服裝類型": "[類型]",
      "剪裁版型": "[描述]",
      "設計特點": "[描述]",
      "材質": "[材質]",
      "配件": "[描述]（若無可略過）",
      "細節": "[描述]",
      ${
        clothing_type === "top"
          ? "\"領子\": \"[描述]\", \"袖子\": \"[描述]\""
          : "\"褲管\": \"[描述]\""
      }
    }
    
    可以參考以下範例：
    {
      "顏色": "藍色",
      "服裝類型": "襯衫",
      "剪裁版型": "修身剪裁",
      "設計特點": "有口袋",
      "材質": "羊毛混紡",
      "配件": "無",
      "細節": "有條紋",
      "領子": "翻領",
      "袖子": "長袖"
    }
  `;
  return prompt;
};


const extractLabelsFromImage = async (
  image_url: string,
  clothing_type: ClothingType
): Promise<string | null> => {
  const model: string = "gpt-4o-mini";
  const prompt: string = makePrompt(clothing_type);
  console.log("prompt: ", prompt);
  try {
    const response: string | null = await chatCompletionTextAndImage({
      model,
      prompt,
      image_url,
    });
    if (response && validateResponseFormat(response)) {
      return response;
    }
    else {
      console.error("Invalid response format:", response );
      return null;
    }
  } catch (error) {
    console.error("Error in extractLabelsFromImage:", error);
    return null;
  }
};

const validateResponseFormat = (image_label_string: string): boolean => {
  try {
    const cleanedString = image_label_string.replace(/```json\n?|\n?```/g, '').trim();
    const parsedLabels = JSON.parse(cleanedString);
    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "配件", "細節"];

    const topKeys = ["領子", "袖子"];
    const bottomKeys = ["褲管"];
    
    const hasRequiredKeys = requiredKeys.every(key => key in parsedLabels);
    const hasSpecificKeys = topKeys.every(key => key in parsedLabels) || bottomKeys.every(key => key in parsedLabels);

    return hasRequiredKeys && hasSpecificKeys;
  }
  catch (error) {
    console.error("Error in validateResponseFormat", error);
    return false;
  }
};

export { extractLabelsFromImage, validateResponseFormat };
