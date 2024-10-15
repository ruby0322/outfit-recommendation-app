"use server";
import { Gender, ItemTable, SearchResult, ClothingType } from "@/type";
import { generateEmbedding } from "./embedding";
import prisma from "@/prisma/db";
import fs from 'fs';
import path from 'path';

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

const vectorSearch = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
  clothingType: ClothingType,
): Promise<ItemTable[] | null> => {
  try {
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = 0.2;

    const viewName = `${gender}_${clothingType}_item_matview`;

    const queryFilePath = path.join(__dirname, 'prisma/sql/querySimilarItems.sql');
    const query = fs.readFileSync(queryFilePath, 'utf8');

    const similarItems: ItemTable[] = await prisma.$queryRawUnsafe(query, {
      view_name: viewName,
      query_embedding: suggestedEmbedding,
      match_threshold: matchThreshold,
      max_item_count: numMaxItem,
    });

    return similarItems;
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return null;
  }
};

const getSeriesByIds = async (
  seriesIds: string[]
): Promise<SearchResult | null> => {
  try {
    const items = await prisma.item.findMany({
      where: {
        series_id: {
          in: seriesIds, 
        },
      },
    });

    if (!items) {
      console.error("No items found for the provided series IDs");
      return null;
    }
    return {
      series: seriesIds.map((seriesId) => {
        return { 
          items: items.filter((item) => item.series_id === seriesId)
        };
      }),
    };
  } catch (error) {
    console.error("Unexpected error in getSeriesByIds:", error);
    return null;
  }
};

const semanticSearchForRecommendation = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender = "male",
  clothing_type = "top",
}: {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
  clothing_type: ClothingType;
}): Promise<UnstoredResult[] | null> => {
  try {
    const similarItems = await vectorSearch(
      suggestedLabelString,
      numMaxItem,
      gender,
      clothing_type,
    );

    if (!similarItems) {
      return null;
    }

    const results: UnstoredResult[] = similarItems.map(
      (item: ItemTable, index: number) => ({
        distance: index,
        item_id: Number(item.id),
        suggestion_id: suggestionId,
      })
    );

    return results;
  } catch (error) {
    console.error("Error in semanticSearchForRecommendation:", error);
    return null;
  }
};

const semanticSearchForSearching = async ({
  suggestedLabelString,
}: {
  suggestedLabelString: string;
  gender: Gender;
  clothing_type: ClothingType; 
}): Promise<SearchResult | null> => {
  try {
    const similarItems = await vectorSearch(
      suggestedLabelString,
      20,
    );

    if (!similarItems) {
      return null;
    }

    const seriesIds = similarItems.map(
      (similarItem: ItemTable) => similarItem.series_id 
    );

    const result = await getSeriesByIds(seriesIds);
    return result;
  } catch (error) {
    console.error("Error in semanticSearchForSearching:", error);
    return null;
  }
};

export { semanticSearchForRecommendation, semanticSearchForSearching };