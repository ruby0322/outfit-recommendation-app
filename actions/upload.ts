"use server";
import { SearchResult, UnstoredResult } from "@/type";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
} from "./utils/insert";
import {
  semanticSearchForRecommendation,
  semanticSearchForSearching,
} from "./utils/matching";
import {
  constructPromptForImageSearch,
  constructPromptForRecommendation,
  constructPromptForTextSearch,
} from "./utils/prompt";

import { ClothingType, Gender } from "@prisma/client";

const validateForRecommendation = (
  recommendations: string,
  clothingType: ClothingType
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
        
        const specificKeys = clothingType === "top"
          ? ["褲管", "裙擺"]
          : ["領子", "袖子"];

        return [...requiredKeys, ...specificKeys].every(
          (key) => key in rec.item
        );
      })
      .map((rec) => {
        const specificInfo = clothingType === "top"
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


const validateForSearching = (
  recommendations: string,
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

        return requiredKeys.every((key) => key in rec.item);
      })
      .map((rec) => {
        const optionalFields = [];
        if (rec.item.領子) optionalFields.push(`領子: ${rec.item.領子}`);
        if (rec.item.袖子) optionalFields.push(`袖子: ${rec.item.袖子}`);
        if (rec.item.褲管) optionalFields.push(`褲管: ${rec.item.褲管}`);
        if (rec.item.裙擺) optionalFields.push(`裙擺: ${rec.item.裙擺}`);

        const optionalInfo = optionalFields.length > 0 ? `, ${optionalFields.join(", ")}` : "";

        return {
          styleName: rec.styleName,
          description: rec.description,
          labelString: `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}${optionalInfo}`,
        };
      });
  } catch (error) {
    console.error("Error in validateAndCleanLabelString", error);
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
      const cleanedRecommendations = validateForRecommendation(
        recommendations,
        clothingType,
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
      const cleanedLabels = validateForSearching(
        rawLabelString,
      );

      console.log("Cleaned labels in image search: ", cleanedLabels);

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
    const prompt: string = constructPromptForTextSearch({
      query,
      gender,
    });

    const rawLabelString: string | null = await sendPromptToGPT({
      model,
      prompt,
    });

    if (rawLabelString) {
      const cleanedLabels = validateForSearching(
        rawLabelString,
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
