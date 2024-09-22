"use server";
import { ClothingType, Gender } from "@/type";
import { sendImgURLAndPromptToGPT } from "./utils/chat";
import { insertUpload, insertResults, insertSuggestion, insertRecommendation } from "./utils/insert";
import supabase from "@/lib/supabaseClient";
import { UnstoredResult, semanticSearch } from "./utils/matching";

const constructPrompt = ({
    clothingType,
    gender,
    numMaxSuggestion
}: {
    clothingType: ClothingType;
    gender: Gender;
    numMaxSuggestion: number;
}): string => {
    const prompt: string = `
    請擔任我的造型師，仔細觀察這張圖片中的${clothingType === "top" ? "上衣" : "下身類衣物"}，
    並根據以下提供的額外資訊：
    {
      性別: ${gender === "male" ? "男性" : "女性"},
    }
    請推薦${numMaxSuggestion}種與之搭配的${clothingType === "top" ? "下身類衣物" : "上衣"}。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "顏色": "[顏色]", 
        "服裝類型": "[類型]", 
        "剪裁版型": "[描述]", 
        "設計特點": "[描述]", 
        "材質": "[材質]", 
        "細節": "[描述]", 
        ${clothingType === "top"
            ? '"褲管": "[描述]", "裙擺": "[描述]"'
            : '"領子": "[描述]", "袖子": "[描述]"'
        }
      }
    ]
  `;
    return prompt;
}

const validateAndCleanRecommendations = (
    recommendations: string,
    clothingType: ClothingType
): string[] => {
    try {
        const cleanedString = recommendations.replace(/```json\n?|\n?```/g, "").trim();
        const recommendationsArray: any[] = JSON.parse(cleanedString);
        if (!Array.isArray(recommendationsArray)) {
            throw new Error("Invalid recommendation format: " + cleanedString);
        }

        return recommendationsArray
            .filter((recommendation) => validateRecommendationFormat(recommendation, clothingType))
            .map((recommendation) => formatRecommendation(recommendation, clothingType));
    } catch (error) {
        console.error("Error in validateAndCleanRecommendations", error);
        return [];
    }
};

const validateRecommendationFormat = (
    recommendation: any,
    clothingType: ClothingType
): boolean => {
    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];
    const specificKeys = clothingType === "top" ? ["褲管", "裙擺"] : ["領子", "袖子"];

    const hasRequiredKeys = requiredKeys.every((key) => key in recommendation);
    const hasSpecificKeys = specificKeys.every((key) => key in recommendation);

    return hasRequiredKeys && hasSpecificKeys;
};

const formatRecommendation = (
    recommendation: any,
    clothingType: ClothingType
): string => {
    return `顏色: ${recommendation.顏色}, 服裝類型: ${recommendation.服裝類型}, 剪裁版型: ${recommendation.剪裁版型}, 設計特點: ${recommendation.設計特點}, 材質: ${recommendation.材質}, 細節: ${recommendation.細節}, ${clothingType === "top"
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
    suggestedLabelStrings,
    numMaxItem,
    recommendationId,
    gender,
}: {
    suggestedLabelStrings: string[];
    numMaxItem: number;
    recommendationId: number;
    gender: Gender;
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
}: {
    clothingType: ClothingType;
    imageUrl: string;
    gender: Gender;
    model: string;
    userId: number;
    numMaxSuggestion: number;
    numMaxItem: number;
}): Promise<number> => {
    try {
        // 結合 parameters 做出 prompt  
        const prompt: string = constructPrompt({
            clothingType,
            gender,
            numMaxSuggestion,
        });

        // 將做好的 prompt 結合 imgurl 送給 GPT
        const recommendations: string | null = await sendImgURLAndPromptToGPT({
            model,
            prompt,
            imageUrl,
        });

        // 得到 GPT 的推薦
        if (recommendations) {

            // 整理成 string[]
            const suggestedLabelStrings: string[] = validateAndCleanRecommendations(
                recommendations,
                clothingType
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
            });

            // matching
            await handleSuggestionMatching({
                suggestedLabelStrings,
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