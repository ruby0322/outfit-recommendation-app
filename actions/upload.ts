"use server";
import { ClothingType, Gender, SearchResult } from "@/type";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
} from "./utils/insert";
import {
  UnstoredResult,
  semanticSearchForRecommendation,
  semanticSearchForSearching,
} from "./utils/matching";
import {
  constructPromptForImageSearch,
  constructPromptForRecommendation,
  constructPromptForTextSearch,
} from "./utils/prompt";

const validateAndCleanLabelString = (
  recommendations: string,
  clothingType: ClothingType,
  isSimilar: boolean
) => {
  try {
    const recommendationsArray = JSON.parse(
      recommendations.replace(/```json\n?|\n?```/g, "").trim()
    );
    if (!Array.isArray(recommendationsArray))
      throw new Error("Invalid recommendation format");

    return recommendationsArray
      .filter((rec) => {
        const requiredKeys = [
          "顏色",
          "服裝類型",
          "剪裁版型",
          "設計特點",
          "材質",
          "細節",
        ];
        const specificKeys = isSimilar
          ? clothingType === "top"
            ? ["領子", "袖子"]
            : ["褲管", "裙擺"]
          : clothingType === "top"
          ? ["褲管", "裙擺"]
          : ["領子", "袖子"];

        return [...requiredKeys, ...specificKeys].every(
          (key) => key in rec.item
        );
      })
      .map((rec) => {
        const specificInfo = isSimilar
          ? clothingType === "top"
            ? `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`
            : `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}`
          : clothingType === "top"
          ? `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}`
          : `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`;

        return {
          styleName: rec.styleName,
          description: rec.description,
          labelString: `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}, ${specificInfo}`,
        };
      });
  } catch (error) {
    console.error("Error in validateAndCleanRecommendations", error);
    return [];
  }
};

const handleRecommendation = async (
  clothingType: ClothingType,
  gender: Gender,
  model: string,
  userId: string,
  numMaxSuggestion: number,
  numMaxItem: number,
  imageUrl: string
): Promise<number> => {
  try {
    const prompt: string = constructPromptForRecommendation({
      clothingType,
      gender,
      numMaxSuggestion,
    });

    const recommendations: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    if (recommendations) {
      const cleanedRecommendations = validateAndCleanLabelString(
        recommendations,
        clothingType,
        false
      );

      const uploadId: number = await insertUpload(imageUrl, userId);
      const paramId: number = await insertParam(gender, clothingType, model);
      const recommendationId: number = await insertRecommendation({
        paramId,
        uploadId,
        userId,
      });

      for (const rec of cleanedRecommendations) {
        const suggestionId: number = await insertSuggestion({
          recommendationId,
          labelString: rec.labelString,
          styleName: rec.styleName,
          description: rec.description,
        });

        const results: UnstoredResult[] =
          (await semanticSearchForRecommendation({
            suggestionId,
            suggestedLabelString: rec.labelString,
            numMaxItem,
            gender,
            clothing_type: clothingType,
          })) as UnstoredResult[];
        // console.log("results: ", results);
        await insertResults(results);
      }
      return recommendationId;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error in handleRecommendation:", error);
    return -1;
  }
};

const handleImageSearch = async (
  gender: Gender,
  model: string,
  imageUrl: string
): Promise<SearchResult | null> => {
  try {
    const prompt: string = constructPromptForImageSearch({
      gender,
    });

    const rawLabelString: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    if (rawLabelString) {
      const cleanedLabels = validateAndCleanLabelString(
        rawLabelString,
        "top",
        true
      );

      console.log("Cleaned labels in image search: ", cleanedLabels);

      if (cleanedLabels.length > 0) {
        const labelString = cleanedLabels[0].labelString;
        const searchResult: SearchResult | null =
          await semanticSearchForSearching({
            suggestedLabelString: labelString
          });
        return searchResult;
      } else {
        console.error("No valid labels found after cleaning");
        return null;
      }
    } else {
      console.error("No label string returned from GPT");
      return null;
    }
  } catch (error) {
    console.error("Error in handleSearch:", error);
    return null;
  }
};

const handleTextSearch = async (
  query: string,
  model: string,
  gender: Gender
): Promise<SearchResult | null> => {
  try {
    console.log("user query", query);
    const prompt: string = constructPromptForTextSearch({
      query,
      gender,
    });
    console.log("prompt", prompt);

    const rawLabelString: string | null = await sendPromptToGPT({
      model,
      prompt,
    });
    console.log("Raw labels in text search: ", rawLabelString);

    if (rawLabelString) {
      const cleanedLabels = validateAndCleanLabelString(
        rawLabelString,
        "top",
        true
      );

      console.log("Cleaned labels in text search: ", cleanedLabels);

      if (cleanedLabels.length > 0) {
        const labelString = cleanedLabels[0].labelString;

        const searchResult: SearchResult | null =
          await semanticSearchForSearching({
            suggestedLabelString: labelString,
            gender,
          });
        return searchResult;
      } else {
        console.error("No valid labels found after cleaning");
        return null;
      }
    } else {
      console.error("No label string returned from GPT");
      return null;
    }
  } catch (error) {
    console.error("Error in handleTextSearch:", error);
    return null;
  }
};

export { handleImageSearch, handleRecommendation, handleTextSearch };
