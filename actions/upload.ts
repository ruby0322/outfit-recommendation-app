"use server";
import supabase from "@/lib/supabaseClient";
import { ClothingType, Gender } from "@/type";
import { sendImgURLAndPromptToGPT } from "./utils/chat";
import {
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
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

//以圖搜圖
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
    並且提供詳盡的描述。
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
              ? '"褲管": "[描述]", "裙擺": "[描述]"'
              : '"領子": "[描述]", "袖子": "[描述]"'
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
  isSimilar: boolean,
): { styleName: string; description: string; labelString: string }[] => {
  try {
    const cleanedString = recommendations
      .replace(/```json\n?|\n?```/g, "")
      .trim();
    const recommendationsArray: any[] = JSON.parse(cleanedString);
    if (!Array.isArray(recommendationsArray)) {
      throw new Error("Invalid recommendation format: " + cleanedString);
    }

    return recommendationsArray
      .filter((recommendation) =>
        validateRecommendationFormat(recommendation.item, clothingType, isSimilar)
      )
      .map((recommendation) => ({
        styleName: recommendation.styleName,
        description: recommendation.description,
        labelString: formatRecommendation(recommendation.item, clothingType, isSimilar),
      }));
  } catch (error) {
    console.error("Error in validateAndCleanRecommendations", error);
    return [];
  }
};

const validateRecommendationFormat = (
  recommendation: any,
  clothingType: ClothingType,
  isSimilar: boolean
): boolean => {
  const requiredKeys = [
    "顏色",
    "服裝類型",
    "剪裁版型",
    "設計特點",
    "材質",
    "細節",
  ];
  let specificKeys: string[] = [];

  if (isSimilar) {
    specificKeys = clothingType === "top" ? ["領子", "袖子"] : ["褲管", "裙擺"];
  } else {
    specificKeys = clothingType === "top" ? ["褲管", "裙擺"] : ["領子", "袖子"];
  }

  const hasRequiredKeys = requiredKeys.every((key) => key in recommendation);
  const hasSpecificKeys = specificKeys.every((key) => key in recommendation);

  return hasRequiredKeys && hasSpecificKeys;
};

const formatRecommendation = (
  recommendation: any,
  clothingType: ClothingType,
  isSimilar: boolean
): string => {
  return `顏色: ${recommendation.顏色}, 服裝類型: ${
    recommendation.服裝類型
  }, 剪裁版型: ${recommendation.剪裁版型}, 設計特點: ${
    recommendation.設計特點
  }, 材質: ${recommendation.材質}, 細節: ${recommendation.細節}, ${
    isSimilar
      ? clothingType === "top"
        ? `領子: ${recommendation.領子}, 袖子: ${recommendation.袖子}`
        : `褲管: ${recommendation.褲管}, 裙擺: ${recommendation.裙擺}`
      : clothingType === "top"
      ? `褲管: ${recommendation.褲管}, 裙擺: ${recommendation.裙擺}`
      : `領子: ${recommendation.領子}, 袖子: ${recommendation.袖子}`
  }`;
};


const insertParameters = async (
  gender: Gender,
  clothingType: ClothingType,
  model: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("param")
    .insert([
      {
        gender,
        clothing_type: clothingType,
        model,
      },
    ])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const paramId = data[0].id;
    return paramId as number;
  } else {
    return -1;
  }
};

// Handles matching suggestions with results and storing them
const handleSuggestionMatching = async ({
  recommendations,
  numMaxItem,
  recommendationId,
  gender,
}: {
  recommendations: {
    styleName: string;
    description: string;
    labelString: string;
  }[];
  numMaxItem: number;
  recommendationId: number;
  gender: Gender;
}): Promise<void> => {
  try {
    for (const rec of recommendations) {
      // Store suggestions and get suggestion IDs
      const suggestionId: number = await insertSuggestion({
        recommendationId,
        labelString: rec.labelString,
        styleName: rec.styleName,
        description: rec.description,
      });

      // Get suggestion results (ResultTable[]) and store them to get result IDs
      const results: UnstoredResult[] = (await semanticSearch({
        suggestionId: suggestionId,
        suggestedLabelString: rec.labelString,
        numMaxItem,
        gender,
      })) as UnstoredResult[];

      await insertResults(results);
    }
  } catch (error) {
    console.error("Error in handleSuggestionMatching:", error);
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
  recommendationType //多傳一個參數 'recommendation', 'image', 'text'
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
    if(recommendationType === 'recommendation'){
      //推薦穿搭
      prompt = constructPromptForRecommendation({
        clothingType,
        gender,
        numMaxSuggestion,
      });
    }
    else if(recommendationType === 'image'){
      //圖片搜尋
      prompt = constructPromptForImage({
        clothingType,
        gender,
      });
      isSimilar = true;
    }
    else{
      //文字搜尋
      //TODO
    }

    // 將做好的 prompt 結合 imgurl 送給 GPT
    const recommendations: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    // 得到 GPT 的推薦
    if (recommendations) {
      const cleanedRecommendations = validateAndCleanRecommendations(
        recommendations,
        clothingType,
        isSimilar //if recommendation than false, else true
      );

      // 把 upload 存到 supabase
      const uploadId: number = await insertUpload(imageUrl, userId);

      // 把 parameters 存到 supabase
      const paramId: number = await insertParameters(
        gender,
        clothingType,
        model
      );

      // 把 recommendations 存到 supabase
      const recommendationId: number = await insertRecommendation({
        paramId,
        uploadId,
        userId,
      });

      // matching
      await handleSuggestionMatching({
        recommendations: cleanedRecommendations,
        numMaxItem,
        recommendationId,
        gender,
      });

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
