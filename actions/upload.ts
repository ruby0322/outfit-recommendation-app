"use server";
import { BodyType, ClothingType, Gender } from "@/type";
import { chatCompletionTextOnly } from "./utils/chat";
import {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
} from "./utils/insert";
import { extractLabelsFromImage } from "./utils/labeling";
import { UnstoredResult, semanticSearch } from "./utils/matching";

// Handles matching suggestions with results and storing them
const handleSuggestionMatching = async ({
  suggestedLabelStrings,
  numMaxItem,
  recommendationId,
}: {
  suggestedLabelStrings: string[];
  numMaxItem: number;
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
        numMaxItem,
      })) as UnstoredResult[];

      await insertResults(results);
    }
  } catch (error) {
    console.error("Error in handleSuggestionMatching:", error);
  }
};

// Constructs a prompt based on input to generate suggestions
const makePromptForSuggestions = ({
  height,
  weight,
  gender,
  bodyType,
  clothingType,
  stylePreferences,
  numMaxSuggestion,
  labelString,
}: {
  height: number | null;
  weight: number | null;
  gender: Gender;
  bodyType: BodyType | null;
  clothingType: ClothingType;
  stylePreferences: string | null;
  numMaxSuggestion: number;
  labelString: string;
}): string => {
  const prompt: string = `
    請擔任我的造型師，根據這件${
      clothingType === "top" ? "上衣" : "下身類衣物"
    }的描述："${labelString}"，並加上我提供的額外資訊輔助判斷，
    {
      性別: ${gender === "male" ? "男性" : "女性"},
      身高: ${height ? `${height}公分`: "未知"},
      體重: ${weight ? `${weight}公斤`: "未知"},
      偏好風格: ${stylePreferences ? `${stylePreferences}`: "無"},
      身材: ${bodyType ? `${bodyType}公斤`: "未知"}
    }
    ，推薦${numMaxSuggestion}種與之搭配的${
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
        "細節: "[描述]", 
        ${
          clothingType === "top"
            ? '"褲管": "[描述]", "裙擺": "[描述]"'
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
        "細節": "有破洞",
        "褲管": "直筒",
        "裙擺": "無"
      },
      {
        "顏色": "黑色",
        "服裝類型": "運動褲",
        "剪裁版型": "寬鬆",
        "設計特點": "抽繩",
        "材質": "聚酯纖維",
        "細節": "有條紋",
        "褲管": "窄口",
        "裙擺": "無"
      }
    ]
  `;
  return prompt;
};

// Generates suggestions based on the clothing details
const makeSuggestions = async ({
  height,
  weight,
  gender,
  bodyType,
  clothingType,
  stylePreferences,
  numMaxSuggestion,
  labelString,
  model,
}: {
  height: number | null;
  weight: number | null;
  gender: Gender;
  bodyType: BodyType | null;
  clothingType: ClothingType;
  stylePreferences: string | null;
  numMaxSuggestion: number;
  labelString: string;
  model: string;
}): Promise<string[]> => {
  // const model = "gpt-4o-mini";
  const prompt: string = makePromptForSuggestions({
    height,
    weight,
    gender,
    bodyType,
    clothingType,
    stylePreferences,
    numMaxSuggestion,
    labelString,
  });

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
  gender,
  bodyType,
  height,
  weight,
  model,
  stylePreferences,
  userId,
  numMaxSuggestion,
  numMaxItem,
}: {
  clothingType: ClothingType;
  imageUrl: string;
  gender: Gender;
  bodyType: BodyType | null;
  height: number | null;
  weight: number | null;
  model: string;
  stylePreferences: string | null;
  userId: number;
  numMaxSuggestion: number;
  numMaxItem: number;
}): Promise<number> => {
  try {
    console.log("Handling submission...");

    // Extract labels from the image
    console.log("imageUrl in handleSubmission:", imageUrl);
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
        weight,
        gender,
        bodyType,
        clothingType,
        stylePreferences,
        model
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
        height,
        weight,
        gender,
        bodyType,
        clothingType,
        stylePreferences,
        numMaxSuggestion,
        labelString,
        model,
      });
      console.log(
        "The generated suggested_label_strings:",
        suggestedLabelStrings
      );
      // Handle suggestion matching
      await handleSuggestionMatching({
        suggestedLabelStrings,
        numMaxItem,
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
