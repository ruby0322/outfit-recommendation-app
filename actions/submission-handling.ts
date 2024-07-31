"use server";

import {
  extractLabelsFromImage,
  validateResponseFormat,
} from "./image-labeling";
import { semanticSearch } from "./outfit-matching";
import { chatCompletionTextAndImage, chatCompletionTextOnly } from "./utils";
import { getItemsByIds } from "./item";
import { ClothingType, ItemTable, ResultTable } from "@/type";
import { v4 as uuidv4 } from "uuid";
import { insertParam, insertUpload } from "./user-input";
import {
  insertRecommendation,
  insertResults,
  insertSuggestion,
} from "./recommendation";

// Handles matching suggestions with results and storing them
const handleSuggestionMatching = async ({
  suggested_label_strings,
  max_num_item,
  recommendation_id,
}: {
  suggested_label_strings: string[];
  max_num_item: number;
  recommendation_id: number;
}): Promise<void> => {
  try {
    for (const s of suggested_label_strings) {
      // Store suggestions and get suggestion IDs
      const suggestion_id: number = await insertSuggestion(
        recommendation_id,
        s
      );

      // Get suggestion results (ResultTable[]) and store them to get result IDs
      const results: ResultTable[] = (await semanticSearch({
        suggestion_id,
        suggested_label_string: s,
        max_num_item,
      })) as ResultTable[];

      await insertResults(results);
    }
  } catch (error) {
    console.error("Error in handleSuggestionMatching:", error);
  }
};

// Constructs a prompt based on input to generate suggestions
const makePrompt = ({
  clothing_type,
  height,
  style_preferences,
  max_num_suggestion,
  label_string,
}: {
  clothing_type: ClothingType;
  height: number | null;
  style_preferences: string | null;
  max_num_suggestion: number;
  label_string: string;
}): string => {
  /* TODO: make a good prompt based on input to generate suggestions */
  const prompt: string = `
  你現在是我的造型師。
  請你根據這件${
    clothing_type === "top" ? "上衣" : "下身"
  }的描述："${label_string}"
  ，並加上我提供的額外資訊輔助判斷，${height === null ? "" : `身高：${height}`}、${style_preferences === null ? "" : `偏好風格：${style_preferences}`}
  推薦我${max_num_suggestion}種與之搭配的${
    clothing_type === "top" ? "下身" : "上衣"
  }
  請仿照以下格式：
  "顏色:[顏色], 服裝類型:[類型], 剪裁版型:[描述], 設計特點:[描述], 材質:[材質], 配件:[描述]（無的話可略）, 細節:[描述], 褲管:[描述]",
  `;
  return prompt;
};

// Generates suggestions based on the clothing details
const makeSuggestions = async ({
  clothing_type,
  height,
  style_preferences,
  max_num_suggestion,
  label_string,
}: {
  clothing_type: ClothingType;
  height: number | null;
  style_preferences: string | null;
  max_num_suggestion: number;
  label_string: string;
}): Promise<string[]> => {
  const model = "gpt-4o-mini";
  const prompt: string = makePrompt({
    clothing_type,
    height,
    style_preferences,
    max_num_suggestion,
    label_string,
  });

  const suggestions = await chatCompletionTextOnly({ model, prompt });
  console.log("Suggestions:", suggestions);

  // Assume data cleansing and format checking is done here
  // Example: Parsing the response into a list of suggested label strings
  const suggestedLabelStrings: string[] = ["藍色襯衫", "白色短踢"];
  /* TODO: some data cleansing and format checking */
  return suggestedLabelStrings;
};

// Handles the submission of clothing details and generates recommendations
const handleSubmission = async ({
  clothing_type,
  image_url,
  height,
  style_preferences,
  user_id,
  max_num_suggestion,
  max_num_item,
}: {
  clothing_type: ClothingType;
  image_url: string;
  height: number | null;
  style_preferences: string | null;
  user_id: number;
  max_num_suggestion: number;
  max_num_item: number;
}): Promise<number> => {
  try {
    console.log("Handling submission...");

    // Extract labels from the image
    const label_string: string | null = await extractLabelsFromImage(
      image_url,
      clothing_type
    );

    console.log(
      "The string of labels extracted from the clothing:",
      label_string
    );

    if (label_string) {
      // Store the upload details
      const upload_id: number = await insertUpload(
        image_url,
        label_string,
        user_id
      );
      console.log("The generated upload_id:", upload_id);

      // Store the parameters
      const param_id: number = await insertParam(
        height,
        clothing_type,
        style_preferences
      );
      console.log("The generated param_id:", param_id);

      // Store the recommendation
      const recommendation_id: number = await insertRecommendation(
        param_id,
        upload_id
      );
      console.log("The generated recommendation_id:", recommendation_id);

      // Generate suggestions
      const suggested_label_strings: string[] = await makeSuggestions({
        clothing_type,
        height,
        style_preferences,
        max_num_suggestion,
        label_string,
      });
      console.log(
        "The generated suggested_label_strings:",
        suggested_label_strings
      );
      // Handle suggestion matching
      await handleSuggestionMatching({
        suggested_label_strings,
        max_num_item,
        recommendation_id,
      });
      console.log("Done handleSuggestionMatching.");
      return recommendation_id;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error in handleSubmission:", error);
    return -1;
  }
};

export { handleSuggestionMatching, makeSuggestions, handleSubmission };
