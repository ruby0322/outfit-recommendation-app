"use server";
import { ClothingType } from "@/type";
import { chatCompletionTextAndImage } from "./chat";

const makePromptForLabeling = (clothingType: ClothingType): string => {
  const prompt: string = `
  仔細觀察這張圖片中的${
    clothingType === "top" ? "上衣" : "下身"
  }後，提供一個詳細的 multi-tags 列表來描述這件衣物。
  確保涵蓋每一個細節，包括顏色、材質、設計、功能等。
  每類可有多個標籤以涵蓋所有細節。需要的話，你可以使用規範以外的標籤來完成你的任務。
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
      clothingType === "top"
        ? '"領子": "[描述]", "袖子": "[描述]"'
        : '"褲管": "[描述]", "裙擺": "[描述]"'
    }
  }
  
  可以參考以下範例：
  範例一：
  {
    "顏色": "藍色",
    "服裝類型": "襯衫",
    "剪裁版型": "修身剪裁",
    "設計特點": "有口袋",
    "材質": "羊毛混紡",
    "細節": "有條紋",
    "領子": "翻領",
    "袖子": "長袖"
  }
  範例二：
  {
    "顏色": "黑色",
    "服裝類型": "長褲",
    "剪裁版型": "寬鬆剪裁",
    "設計特點": "高腰",
    "材質": "可能為棉質或混紡面料",
    "細節": "有褶皺設計",
    "褲管": "緊縮褲腳",
    "裙擺": "無"
  }
`;
  return prompt;
};

const validateResponseFormat = (imageLabelString: string): boolean => {
  try {
    const cleanedString = imageLabelString
      .replace(/```json\n?|\n?```/g, "")
      .trim();
    const parsedLabels = JSON.parse(cleanedString);
    const requiredKeys = [
      "顏色",
      "服裝類型",
      "剪裁版型",
      "設計特點",
      "材質",
      "細節",
    ];

    const topKeys = ["領子", "袖子"];
    const bottomKeys = ["褲管", "裙擺"];

    const hasRequiredKeys = requiredKeys.every((key) => key in parsedLabels);
    const hasSpecificKeys =
      topKeys.every((key) => key in parsedLabels) ||
      bottomKeys.every((key) => key in parsedLabels);

    return hasRequiredKeys && hasSpecificKeys;
  } catch (error) {
    console.error("Error in validateResponseFormat", error);
    return false;
  }
};

function transformResponse(jsonString: string): string {
  try {
    const cleanedString = jsonString.replace(/```json\n?|\n?```/g, "").trim();
    const parsedJson = JSON.parse(cleanedString);

    const transformEntries = Object.entries(parsedJson).map(([key, value]) => {
      const valueArray = Array.isArray(value) ? value : [value];
      const filteredValues = valueArray
        .filter((item) => item && item !== "無")
        .join(", ");
      const finalValue = filteredValues || "無";
      return `${key}: ${finalValue}`;
    });

    return transformEntries.join(", ");
  } catch (error) {
    console.error("Error in transformResponse", error);
    return "";
  }
}

const extractLabelsFromImage = async (
  imageUrl: string,
  clothingType: ClothingType
): Promise<string | null> => {
  const model: string = "gpt-4o-mini";
  const prompt: string = makePromptForLabeling(clothingType);
  // console.log("prompt: ", prompt);
  console.log("imageUrl in extractLabelsFromImage:", imageUrl);
  try {
    const response: string | null = await chatCompletionTextAndImage({
      model,
      prompt,
      imageUrl,
    });
    if (response && validateResponseFormat(response)) {
      console.log("Original JSON: ", response);
      // console.log("Extracted Labels: ", transformResponse(response));
      return transformResponse(response);
    } else {
      console.error("Invalid response format:", response);
      return null;
    }
  } catch (error) {
    console.error("Error in extractLabelsFromImage:", error);
    return null;
  }
};

export { extractLabelsFromImage };
