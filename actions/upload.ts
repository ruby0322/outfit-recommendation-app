"use server";
import {
  insertSuggestion,
  insertResults,
  insertParam,
  insertRecommendation,
  insertUpload,
} from "./utils/insert";
import { UnstoredResult, semanticSearch } from "./utils/matching";
import { ClothingType } from "@/type";
import { chatCompletionTextOnly } from "./utils/chat";
import { extractLabelsFromImage } from "./utils/labeling";

// Handles matching suggestions with results and storing them
const handleSuggestionMatching = async ({
  suggestedLabelStrings,
  maxNumItem,
  recommendationId,
}: {
  suggestedLabelStrings: string[];
  maxNumItem: number;
  recommendationId: number;
}): Promise<void> => {
  try {
    for (const s of suggestedLabelStrings) {
      // Store suggestions and get suggestion IDs
      const suggestionId: number = await insertSuggestion({
        recommendationId,
        labelString: s,
      });

      // Get suggestion results (ResultTable[]) and store them to get result IDs
      const results: UnstoredResult[] = (await semanticSearch({
        suggestionId: suggestionId,
        suggestedLabelString: s,
        maxNumItem,
      })) as UnstoredResult[];

      await insertResults(results);
    }
  } catch (error) {
    console.error("Error in handleSuggestionMatching:", error);
  }
};

// Constructs a prompt based on input to generate suggestions
const makePromptForSuggestions = ({
  clothingType,
  height,
  stylePreferences,
  maxNumSuggestion,
  labelString,
}: {
  clothingType: ClothingType;
  height: number | null;
  stylePreferences: string | null;
  maxNumSuggestion: number;
  labelString: string;
}): string => {
  const prompt: string = `
    請擔任我的造型師，根據這件${
      clothingType === "top" ? "上衣" : "下身類衣物"
    }的描述："${labelString}"，並加上我提供的額外資訊輔助判斷，${
    height === null ? "" : `身高：${height}`
  }、${stylePreferences === null ? "" : `偏好風格：${stylePreferences}`}
    ，推薦${maxNumSuggestion}種與之搭配的${
    clothingType === "top" ? "下身類衣物" : "上衣"
  }
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "顏色: "[顏色]", 
        "服裝類型": "[類型]", 
        "剪裁版型": "[描述]", 
        "設計特點": "[描述]", 
        "材質": "[材質]", 
        "配件": "[描述]（若無可略過）", 
        "細節: "[描述]", 
        ${
          clothingType === "top"
            ? '"褲管": "[描述]"'
            : '"領子": "[描述]", "袖子": "[描述]"'
        }
      }
    ]
    
    可以參考以下範例：
    [
      {
        "顏色": "藍色",
        "服裝類型": "牛仔褲",
        "剪裁版型": "修身剪裁",
        "設計特點": "有口袋",
        "材質": "棉",
        "配件": "無",
        "細節": "有破洞",
        "褲管": "直筒"
      },
      {
        "顏色": "黑色",
        "服裝類型": "運動褲",
        "剪裁版型": "寬鬆",
        "設計特點": "抽繩",
        "材質": "聚酯纖維",
        "配件": "無",
        "細節": "有條紋",
        "褲管": "窄口"
      }
    ]
  `;
  return prompt;
};

// Generates suggestions based on the clothing details
const makeSuggestions = async ({
  clothingType,
  height,
  stylePreferences,
  maxNumSuggestion,
  labelString,
}: {
  clothingType: ClothingType;
  height: number | null;
  stylePreferences: string | null;
  maxNumSuggestion: number;
  labelString: string;
}): Promise<string[]> => {
  const model = "gpt-4o-mini";
  const prompt: string = makePromptForSuggestions({
    clothingType,
    height,
    stylePreferences,
    maxNumSuggestion,
    labelString,
  });

  // console.log("Prompt" + prompt);

  try {
    const suggestions = await chatCompletionTextOnly({
      model,
      prompt,
    });
    console.log("Suggestions:", suggestions);

    if (!suggestions) {
      throw new Error("No suggestions");
    }

    const suggestedLabelStrings: string[] = validateAndCleanSuggestions(
      suggestions,
      clothingType
    );
    return suggestedLabelStrings;
  } catch (error) {
    console.error("Error in makeSuggestions:", error);
    return [];
  }
};

const validateAndCleanSuggestions = (
  suggestions: string,
  clothingType: ClothingType
): string[] => {
  try {
    const cleanedString = suggestions.replace(/```json\n?|\n?```/g, "").trim();
    const suggestionsArray: any[] = JSON.parse(cleanedString);
    if (!Array.isArray(suggestionsArray)) {
      throw new Error("Invalid suggestion format: " + cleanedString);
    }

    return suggestionsArray
      .filter((suggestion) =>
        validateSuggestionFormat(suggestion, clothingType)
      )
      .map((suggestion) => formatSuggestion(suggestion, clothingType));
  } catch (error) {
    console.error("Error in validateAndCleanSuggestions", error);
    return [];
  }
};

const validateSuggestionFormat = (
  suggestion: any,
  clothingType: ClothingType
): boolean => {
  const requiredKeys = [
    "顏色",
    "服裝類型",
    "剪裁版型",
    "設計特點",
    "材質",
    "細節",
  ];
  const specificKeys = clothingType === "top" ? ["褲管"] : ["領子", "袖子"];

  const hasRequiredKeys = requiredKeys.every((key) => key in suggestion);
  const hasSpecificKeys = specificKeys.every((key) => key in suggestion);

  return hasRequiredKeys && hasSpecificKeys;
};

const formatSuggestion = (
  suggestion: any,
  clothingType: ClothingType
): string => {
  return `顏色: ${suggestion.顏色}, 服裝類型: ${
    suggestion.服裝類型
  }, 剪裁版型: ${suggestion.剪裁版型}, 設計特點: ${
    suggestion.設計特點
  }, 材質: ${suggestion.材質}, ${
    suggestion.配件 ? `配件: ${suggestion.配件}, ` : ""
  }細節: ${suggestion.細節}, ${
    clothingType === "top"
      ? `褲管: ${suggestion.褲管}`
      : `領子: ${suggestion.領子}, 袖子: ${suggestion.袖子}`
  }`;
};

// Handles the submission of clothing details and generates recommendations
const handleSubmission = async ({
  clothingType,
  imageUrl,
  height,
  stylePreferences,
  userId,
  maxNumSuggestion,
  maxNumItem,
}: {
  clothingType: ClothingType;
  imageUrl: string;
  height: number | null;
  stylePreferences: string | null;
  userId: number;
  maxNumSuggestion: number;
  maxNumItem: number;
}): Promise<number> => {
  try {
    console.log("Handling submission...");

    // Extract labels from the image
    const labelString: string | null = await extractLabelsFromImage(
      imageUrl,
      clothingType
    );

    console.log("Labels extracted from the clothing:", labelString);

    if (labelString) {
      // Store the upload details
      const uploadId: number = await insertUpload(
        imageUrl,
        labelString,
        userId
      );
      console.log("The generated uploadId:", uploadId);

      // Store the parameters
      const paramId: number = await insertParam(
        height,
        clothingType,
        stylePreferences
      );
      console.log("The generated param_id:", paramId);

      // Store the recommendation
      const recommendationId: number = await insertRecommendation({
        paramId,
        uploadId,
      });
      console.log("The generated recommendation_id:", recommendationId);

      // Generate suggestions
      const suggestedLabelStrings: string[] = await makeSuggestions({
        clothingType,
        height,
        stylePreferences,
        maxNumSuggestion,
        labelString,
      });
      console.log(
        "The generated suggested_label_strings:",
        suggestedLabelStrings
      );
      // Handle suggestion matching
      await handleSuggestionMatching({
        suggestedLabelStrings,
        maxNumItem,
        recommendationId,
      });
      console.log("Done handleSuggestionMatching.");
      return recommendationId;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error in handleSubmission:", error);
    return -1;
  }
};

export { handleSubmission };