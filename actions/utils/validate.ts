"use server";
import { ClothingType, ValidatedRecommendation } from "@/type";

const validateLabelString = (
  recommendations: string,
  clothingType?: ClothingType
): ValidatedRecommendation[] => {
  try {
    const recommendationsArray = JSON.parse(
      recommendations.replace(/```json\n?|\n?```/g, "").trim()
    );
    if (!Array.isArray(recommendationsArray))
      throw new Error("Invalid recommendation format");

    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];
    const specificKeys = ["褲管", "裙擺", "領子", "袖子"];
    const hasBaseInfo = recommendationsArray.every((rec) =>
      requiredKeys.every((key) => key in rec.item)
    );

    if (!hasBaseInfo) return [];

    let cleanedLabel = recommendationsArray
      .filter((rec) =>
        [...requiredKeys, ...specificKeys].every((key) => key in rec.item)
      )
      .map((rec) => ({
        styleName: rec.styleName,
        description: rec.description,
        labelString: generateLabelString(rec, clothingType),
      }));
    // console.log("validated result = ", cleanedLabel);
    return cleanedLabel;
  } catch (error) {
    console.error("Error in validateRecommendation:", error);
    return [];
  }
};

const generateLabelString = (
  rec: { item: { [key: string]: string } },
  clothingType?: ClothingType
): string => {
  const baseInfo = `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}`;

  let specificInfo = "";
  if (clothingType === "top") {
    specificInfo = `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}`;
  } else if (clothingType === "bottom") {
    specificInfo = `領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`;
  } else {
    specificInfo = `褲管: ${rec.item.褲管}, 裙擺: ${rec.item.裙擺}, 領子: ${rec.item.領子}, 袖子: ${rec.item.袖子}`;
  }

  return `${baseInfo}, ${specificInfo}`;
};

export { validateLabelString };
