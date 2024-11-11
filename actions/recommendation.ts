"use server";
import prisma from "@/prisma/db";
import {
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  Series,
  SuggestionTable,
  UploadTable,
} from "@/type";
import { handleDatabaseError } from "./activity";
import { deleteParamById, deleteUploadById } from "./utils/delete";
import {
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesForRecommendation,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById
} from "./utils/fetch";

const getRecommendationRecordById = async (
  recommendation_id: number,
  user_id: string,
): Promise<Recommendation | null> => {
  try {
    const recommendation = await getRecommendationById(recommendation_id) as RecommendationTable;
    if (!recommendation || recommendation.user_id !== user_id) return null;

    const param = await getParamById(recommendation.param_id as number) as ParamTable;
    if (!param) throw new Error("Parameter not found for given param_id");

    const upload = await getUploadById(recommendation.upload_id as number) as UploadTable;
    if (!upload) throw new Error("Upload not found for given upload_id");

    const recommendation_record: Partial<Recommendation> = {
      param: param,
      upload: upload,
      styles: {},
    };

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    for (const s of suggestions) {
      const styleName = s.style_name as string;
      const description = s.description as string;
      const results = (await getResults(s.id)) as ResultTable[];
      if (!results.length) throw new Error("No results found");

      const item_ids = results.map((r) => r.item_id) as string[];

      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      if (!series_ids.length) throw new Error("No series IDs found");

      const gender = recommendation_record.param?.gender ?? "neutral";
      const clothingType = recommendation_record.param?.clothing_type ?? "top";
      const series = (await getSeriesForRecommendation(series_ids, item_ids, gender, clothingType, user_id)) as Series[];
      if (!series) throw new Error("No series found");

      recommendation_record.styles![styleName] = {
        series,
        description
      };
    }

    return recommendation_record as Recommendation;
  } catch (error) {
    handleDatabaseError(error, "getRecommendationRecordById");
    return null;
  }
};

const bruteForceAction = async (recommendationId: number) => {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
      select: { id: true },
    });
    const suggestionIds = suggestions.map((s) => s.id);

    await prisma.result.deleteMany({
      where: { suggestion_id: { in: suggestionIds } },
    });

    await prisma.suggestion.deleteMany({
      where: { id: { in: suggestionIds } },
    });

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      select: { param_id: true, upload_id: true },
    });

    if (!recommendation) {
      console.error("Recommendation not found");
      return;
    }

    const { param_id: paramId, upload_id: uploadId } = recommendation;

    await prisma.recommendation.delete({
      where: { id: recommendationId },
    });

    if (paramId) await deleteParamById(paramId);
    if (uploadId) await deleteUploadById(uploadId);
  } catch (error) {
    handleDatabaseError(error, 'bruteForceAction');
  }
};


export { bruteForceAction, getRecommendationRecordById };

