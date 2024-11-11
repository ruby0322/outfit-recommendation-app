"use server";
import { RecommendationWithoutLogin, SearchResult, UnstoredResult, ValidatedRecommendation } from "@/type";
import { handleDatabaseError } from "./activity";
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
  semanticSearchWithoutLogin
} from "./utils/matching";
import {
  constructPromptForImageSearch,
  constructPromptForRecommendation,
  constructPromptForTextSearch,
} from "./utils/prompt";
import { validateLabelString } from "./utils/validate";

import { ClothingType, Gender } from "@/type";

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
    let recommendations: string | null = null;
    let cleanedRecommendations: ValidatedRecommendation[] = [];

    while (!recommendations || cleanedRecommendations.length === 0) {
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      recommendations = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });
      console.log("GPT recommendations= ", recommendations);

      if (!recommendations) continue;

      cleanedRecommendations = validateLabelString(recommendations, clothingType);
    }
    const uploadId: number = await insertUpload(imageUrl, userId);
    const paramId: number = await insertParam(gender, clothingType, model);
    const recommendationId: number = await insertRecommendation({
      paramId,
      uploadId,
      userId,
    });

    await Promise.all(cleanedRecommendations.map(async (rec) => {
      const suggestionId = await insertSuggestion({
        recommendationId,
        labelString: rec.labelString,
        styleName: rec.styleName,
        description: rec.description,
      });
      
      const results = await semanticSearchForRecommendation({
        suggestionId,
        suggestedLabelString: rec.labelString,
        numMaxItem,
        gender,
        clothing_type: clothingType,
      });
      await insertResults(results as UnstoredResult[]);
    }));

    return recommendationId;
  } catch (error) {
    handleDatabaseError(error, "handleRecommendation");
    return -1;
  }
};

const handleRecommendationWithoutLogin = async (
  clothingType: ClothingType,
  gender: Gender,
  model: string,
  numMaxSuggestion: number,
  numMaxItem: number,
  imageUrl: string
): Promise<RecommendationWithoutLogin[] | null> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      rawLabelString = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString, clothingType);
      }
      console.log("GPT recommendations= ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
    }
    const recommendations: RecommendationWithoutLogin[] = [];

    for (const cleanedLabel of cleanedLabels) {
      const labelString = cleanedLabel.labelString;
      const description = cleanedLabel.description;

      const results = await semanticSearchWithoutLogin({
        suggestedLabelString: labelString,
        numMaxItem,
        gender,
        clothing_type: clothingType,
      });

      if (results) {
        const recommendation: RecommendationWithoutLogin = {
          clothing_type: clothingType,
          gender: gender,
          model: model,
          image_url: imageUrl,
          styles: {
            default: {
              series: results,
              description: description,
            },
          },
        };
        recommendations.push(recommendation);
      } else {
        console.error("No results found in semanticSearchWithoutLogin for label:", labelString);
      }
    }

    return recommendations;
  } catch (error) {
    handleDatabaseError(error, "handleRecommendationWithoutLogin");
    return null;
  }
};

const getLabelStringForImageSearch = async (
  gender: Gender,
  model: string,
  imageUrl: string
): Promise<string> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt: string = constructPromptForImageSearch({ gender });

      rawLabelString = await sendImgURLAndPromptToGPT({
        model,
        prompt,
        imageUrl,
      });

      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }
      console.log("GPT recommendation: ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
    }

    return cleanedLabels[0].labelString;
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForImageSearch");
    return "";
  }
};

const handleImageSearch = async (
  labelString: string,
  gender: Gender,
  page: number,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
): Promise<SearchResult | null> => {
  try {
    const searchResult: SearchResult | null = await semanticSearchForSearching({
      suggestedLabelString: labelString,
      gender,
      priceLowerBound,
      priceUpperBound,
      providers,
      clothingType,
      page,
    });
    console.log("searchResult: ", searchResult);
    return searchResult;
  } catch (error) {
    handleDatabaseError(error, "handleImageSearch");
    return null;
  }
};

const getLabelStringForTextSearch = async (
  gender: Gender,
  model: string,
  query: string,
): Promise<string> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt: string = constructPromptForTextSearch({
        query,
        gender,
      });

      rawLabelString = await sendPromptToGPT({
        model,
        prompt,
      });

      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }
      console.log("GPT recommendation: ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendPromptToGPT due to invalid results...");
      }
    }

    return cleanedLabels[0].labelString;
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForTextSearch");
    return "";
  }
};

const handleTextSearch = async (
  labelString: string,
  gender: Gender,
  page: number,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
): Promise<SearchResult | null> => {
  try {
    const searchResult: SearchResult | null = await semanticSearchForSearching({
      suggestedLabelString: labelString,
      gender,
      priceLowerBound,
      priceUpperBound,
      providers,
      clothingType,
      page,
    });

    return searchResult;
  } catch (error) {
    handleDatabaseError(error, "getSearchResultForTextSearch");
    return null;
  }
};

export { handleImageSearch, handleRecommendation, handleRecommendationWithoutLogin, handleTextSearch, getLabelStringForImageSearch, getLabelStringForTextSearch };

