"use server";
import prisma from '@/prisma/db';
import {
  ItemTable,
  ParamTable,
  RecommendationTable,
  ResultTable,
  SuggestionTable,
  UploadTable,
} from "@/type";

// Fetches results based on a suggestion ID
const getResults = async (
  suggestionId: number
): Promise<ResultTable[] | null> => {
  try {
    const results = await prisma.result.findMany({
      where: { suggestion_id: suggestionId },
      select: {
        created_at: true,
        id: true,
        distance: true,
        item_id: true,
        suggestion_id: true,
      },
    });

    return results;
  } catch (error) {
    console.error("Unexpected error in getResults:", error);
    return null;
  }
};

// Fetches suggestions based on a recommendation ID
const getSuggestion = async (
  recommendationId: number
): Promise<SuggestionTable[] | null> => {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
    });

    return suggestions;
  } catch (error) {
    console.error("Unexpected error in getSuggestion:", error);
    return null;
  }
};


const getRecommendationById = async (
  recommendationId: number
): Promise<RecommendationTable | null> => {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    return recommendation as RecommendationTable | null;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return null;
  }
};

const getParamById = async (paramId: number): Promise<ParamTable | null> => {
  try {
    const param = await prisma.param.findUnique({
      where: { id: paramId },
    });

    return param as ParamTable | null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const getUploadById = async (uploadId: number): Promise<UploadTable | null> => {
  try {
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    return upload as UploadTable | null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch a single item by its ID
const getItemById = async (itemId: string): Promise<ItemTable | null> => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    return item as ItemTable | null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch multiple items by their IDs
const getItemsByIds = async (itemIds: string[]): Promise<ItemTable[] | null> => {
  try {
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });

    return items as ItemTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch the series ID by item ID
const getSeriesIDByItemId = async (itemId: string): Promise<string | null> => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { series_id: true },
    });

    return item?.series_id ?? null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const getSeriesIdsByItemIds = async (itemIds: string[]): Promise<string[]> => {
  const seriesIdsSet = new Set<string>();

  for (const itemId of itemIds) {
    const seriesId = await getSeriesIDByItemId(itemId);
    if (seriesId) {
      seriesIdsSet.add(seriesId);
    }
  }

  return Array.from(seriesIdsSet);
};

// Fetch the series by series ID
const getSeriesById = async (seriesId: string): Promise<ItemTable[] | null> => {
  try {
    const items = await prisma.item.findMany({
      where: { series_id: seriesId },
    });

    return items as ItemTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch the items by series ID
const getItemsIDBySeriesId = async (
  seriesId: string
): Promise<string[] | null> => {
  try {
    const items = await prisma.item.findMany({
      where: { series_id: seriesId },
      select: { id: true },
    });

    const itemIDs = items.map((item: { id: string }) => item.id);

    return itemIDs;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

export {
  getItemById,
  getItemsByIds,
  getItemsIDBySeriesId,
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesById,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
};