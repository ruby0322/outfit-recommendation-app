"use server";
import supabase from "@/lib/supabaseClient";
import { ClothingType, Gender } from "@/type";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
  insertParam
} from "./utils/insert";
import { UnstoredResult, semanticSearch } from "./utils/matching";

//prompt for recommendation
const constructPromptForRecommendation = ({
  clothingType,
  gender,
  numMaxSuggestion,
}: {
  clothingType: ClothingType;
  gender: Gender;
  numMaxSuggestion: number;
}): string => {
  const prompt: string = `
    請擔任我的造型師，仔細觀察這張圖片中的${
      clothingType === "top" ? "上衣" : "下身類衣物"
    }，
    並根據以下提供的額外資訊：
    {
      性別: ${gender === "male" ? "男性" : "女性"},
    }
    請推薦${numMaxSuggestion}種與之搭配的${
    clothingType === "top" ? "下身類衣物" : "上衣"
  }。
    對於每一種搭配，請提供一個風格名稱和推薦的原因。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "styleName": "[風格名稱]",
        "description": "[推薦原因]",
        "item": {
          "顏色": "[顏色]", 
          "服裝類型": "[類型]", 
          "剪裁版型": "[描述]", 
          "設計特點": "[描述]", 
          "材質": "[材質]", 
          "細節": "[描述]", 
          ${
            clothingType === "top"
              ? '"褲管": "[描述]", "裙擺": "[描述]"'
              : '"領子": "[描述]", "袖子": "[描述]"'
          }
        }
      }
    ]
  `;
  return prompt;
};

//prompt for image
const constructPromptForImage = ({
  clothingType,
  gender,
}: {
  clothingType: ClothingType;
  gender: Gender;
}): string => {
  const prompt: string = `
    請擔任我的造型師，仔細觀察這張圖片中的${
      clothingType === "top" ? "上衣" : "下身類衣物"
    }，
    並根據以下提供的額外資訊：
    {
      性別: ${gender === "male" ? "男性" : "女性"},
    }
    請詳細描述圖中的${clothingType === "top" ? "上衣" : "下身類衣物"}，
    並且提供一組詳盡的描述。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "styleName": "[衣物風格]",
        "description": "[衣物描述]",
        "item": {
          "顏色": "[顏色]", 
          "服裝類型": "[類型]", 
          "剪裁版型": "[描述]", 
          "設計特點": "[描述]", 
          "材質": "[材質]", 
          "細節": "[描述]", 
          ${
            clothingType === "top"
              ? '"領子": "[描述]", "袖子": "[描述]"'
              : '"褲管": "[描述]", "裙擺": "[描述]"'
          }
        }
      }
    ]
  `;
  return prompt;
};

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

const handleSubmission = async ({
  clothingType,
  imageUrl,
  gender,
  model,
  userId,
  numMaxSuggestion,
  numMaxItem,
  recommendationType, // 'recommendation', 'image'
}: {
  clothingType: ClothingType;
  imageUrl: string;
  gender: Gender;
  model: string;
  userId: string;
  numMaxSuggestion: number;
  numMaxItem: number;
  recommendationType: string;
}): Promise<number> => {
  try {
    let prompt: string = "";
    let isSimilar = false;

    if (recommendationType === 'recommendation') {
      prompt = constructPromptForRecommendation({
        clothingType,
        gender,
        numMaxSuggestion,
      });
    } else if (recommendationType === 'image') {
      prompt = constructPromptForImage({
        clothingType,
        gender,
      });
      isSimilar = true;
    }

    const recommendations: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    if (recommendations) {
      const cleanedRecommendations = validateAndCleanRecommendations(
        recommendations,
        clothingType,
        isSimilar
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

        const results: UnstoredResult[] = (await semanticSearch({
          suggestionId,
          suggestedLabelString: rec.labelString,
          numMaxItem,
          gender,
        })) as UnstoredResult[];

        await insertResults(results);
      }

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
