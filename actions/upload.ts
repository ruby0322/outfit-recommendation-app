"use server";
import { ClothingType, Gender, SearchResult } from "@/type";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
  insertParam
} from "./utils/insert";
import { UnstoredResult, semanticSearch } from "./utils/matching";
import { constructPromptForRecommendation, constructPromptForImage } from "./utils/prompt";

const validateAndCleanRecommendations = (
  recommendations: string,
  clothingType: ClothingType,
  isSimilar: boolean
) => {
  try {
    const recommendationsArray = JSON.parse(recommendations.replace(/```json\n?|\n?```/g, "").trim());
    if (!Array.isArray(recommendationsArray)) throw new Error("Invalid recommendation format");

    return recommendationsArray
      .filter((rec) => {
        const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];
        const specificKeys = isSimilar
          ? clothingType === "top" ? ["領子", "袖子"] : ["褲管", "裙擺"]
          : clothingType === "top" ? ["褲管", "裙擺"] : ["領子", "袖子"];

        return [...requiredKeys, ...specificKeys].every((key) => key in rec.item);
      })
      .map((rec) => {
        const specificInfo = isSimilar
          ? clothingType === "top" ? `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}` : `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}`
          : clothingType === "top" ? `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}` : `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`;

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

const handleRecommendation = async ({
  clothingType,
  gender,
  model,
  userId,
  numMaxSuggestion,
  numMaxItem,
  imageUrl,
}: {
  clothingType: ClothingType;
  gender: Gender;
  model: string;
  userId: string;
  numMaxSuggestion: number;
  numMaxItem: number;
  imageUrl: string;
}): Promise<number> => {
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
      const cleanedRecommendations = validateAndCleanRecommendations(
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

        const similarItems = await semanticSearch({
          suggestedLabelString: rec.labelString,
          numMaxItem,
          gender,
        });
        console.log("similarItem = ", similarItems);

        if (similarItems) {
          // how to map similarItems to results
          // const results = ...
          // await insertResults(results);
        }
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

const handleImageSearch = async ({
  clothingType,
  gender,
  model,
  numMaxItem,
  imageUrl,
}: {
  clothingType: ClothingType;
  gender: Gender;
  model: string;
  numMaxItem: number;
  imageUrl: string;
}): Promise<SearchResult[] | number> => {
  try {
    const prompt: string = constructPromptForImage({
      clothingType,
      gender,
    });

    const recommendations: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    if (recommendations) {
      const cleanedRecommendations = validateAndCleanRecommendations(
        recommendations,
        clothingType,
        false
      );
      let similarItems: SearchResult[] = []; // Initialize as an empty array

      for (const rec of cleanedRecommendations) {
        const results = await semanticSearch({
          suggestedLabelString: rec.labelString,
          numMaxItem,
          gender,
        });

        if (results) {
          similarItems = similarItems.concat(results);
        }
      }

      return similarItems.length > 0 ? similarItems : -1;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error in handleRecommendation:", error);
    return -1;
  }
};

export { handleRecommendation, handleImageSearch };
