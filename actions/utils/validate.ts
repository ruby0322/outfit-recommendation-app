"use server";
import { ClothingType } from "@/type";

const validateLabelString = (
  recommendations: string,
  clothingType?: ClothingType
) => {
  try {
    const recommendationsArray = JSON.parse(
      recommendations.replace(/```json\n?|\n?```/g, "").trim()
    );
    if (!Array.isArray(recommendationsArray))
      throw new Error("Invalid recommendation format");

    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];
    const specificKeys = clothingType === "top" ? ["褲管", "裙擺"] : ["領子", "袖子"];

    return recommendationsArray
      .filter((rec) => [...requiredKeys, ...specificKeys].every((key) => key in rec.item))
      .map((rec) => ({
        styleName: rec.styleName,
        description: rec.description,
        labelString: generateLabelString(rec, clothingType),
      }));
  } catch (error) {
    console.error("Error in validateRecommendation:", error);
    return [];
  }
};

const generateLabelString = (rec: { item: { [key: string]: string } }, clothingType: ClothingType): string => {
  const specificInfo = clothingType === "top"
    ? `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}`
    : `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`;
    
  return `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}, ${specificInfo}`;
};

export { validateLabelString };
