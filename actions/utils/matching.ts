"use server";
import { Gender, ItemTable, SearchResult, ClothingType, Series, SimplifiedItemTable, UnstoredResult } from "@/type";
import { generateEmbedding } from "./embedding";
import prisma from "@/prisma/db";
import fs from 'fs';
import path from 'path';

const vectorSearchForRecommendation = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
  clothing_type: ClothingType,
): Promise<Series[] | null> => {
  try {
    clothing_type = clothing_type === "top" ? "bottom" : "top";
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = 0.2;

    const viewName = `${gender}_${clothing_type}_item_matview`;

    const queryFilePath = path.join(__dirname, 'prisma/sql/querySimilarItems.sql');
    const query = fs.readFileSync(queryFilePath, 'utf8');

    const items: ItemTable[] = await prisma.$queryRawUnsafe<ItemTable[]>(
      query,
      viewName, 
      suggestedEmbedding,
      matchThreshold,
      numMaxItem
    );

    const simplifiedItems: SimplifiedItemTable[] = items.map(item => {
      const { embedding, ...simplifiedItem } = item;
      return simplifiedItem as SimplifiedItemTable;
    });

    const series: Series[] = simplifiedItems.map(simplifiedItem => ({
      items: [simplifiedItem],
    }));

    return series;
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return null;
  }
};

const vectorSearchForSearching = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
): Promise<Series[] | null> => {
  try {
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = 0.2;

    const viewName = `${gender}_item_matview`;

    const queryFilePath = path.join(__dirname, 'prisma/sql/querySimilarItems.sql');
    const query = fs.readFileSync(queryFilePath, 'utf8');

    const items: ItemTable[] = await prisma.$queryRawUnsafe<ItemTable[]>(
      query,
      viewName, 
      suggestedEmbedding,
      matchThreshold,
      numMaxItem
    );

    const simplifiedItems: SimplifiedItemTable[] = items.map(item => {
      const { embedding, ...simplifiedItem } = item;
      return simplifiedItem as SimplifiedItemTable;
    });

    const series: Series[] = simplifiedItems.map(simplifiedItem => ({
      items: [simplifiedItem],
    }));

    return series;
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return null;
  }
};

const getSeriesByIdsForSearching = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string,
): Promise<Series[] | null> => {
  try {
    console.time("getSeries");

    const matViewName = `${gender}_item_matview`;

    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    for (const seriesId of uniqueSeriesIds) {
      const items = await prisma.$queryRawUnsafe<SimplifiedItemTable[]>(
        `SELECT * FROM ${matViewName} WHERE series_id = $1`,
        seriesId
      );

      if (!items || items.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const originalItems = items.filter(item => originalItemIds.includes(item.id));
      const otherItems = items.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ];

      const series: Series = {
        items: sortedItems,
      };
      seriesArray.push(series);
    }

    console.timeEnd("getSeries");
    return seriesArray.length > 0 ? seriesArray : null;
  } catch (error) {
    console.error("Unexpected error in getSeries:", error);
    return null;
  }
};

const semanticSearchForRecommendation = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender,
  clothing_type,
}: {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
  clothing_type: ClothingType;
}): Promise<UnstoredResult[] | null> => {
  try {
    const similarItems = await vectorSearchForRecommendation(
      suggestedLabelString,
      numMaxItem,
      gender,
      clothing_type,
    );

    if (!similarItems) {
      return null;
    }

    const results: UnstoredResult[] = similarItems.map(
      (series: Series, index: number) => ({
        distance: index,
        item_id: Number(series.items[0].id),
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
  gender,
}: {
  suggestedLabelString: string;
  gender: Gender;
}): Promise<SearchResult | null> => {
  try {
    const similarItems = await vectorSearchForSearching(suggestedLabelString, 20, gender);

    if (!similarItems || similarItems.length === 0) {
      return null;
    }

    const uniqueSeriesIds: string[] = [];
    const seenSeriesIds = new Set<string>();

    for (const series of similarItems) {
      for (const item of series.items) {
        const seriesId = item.series_id;
        if (seriesId && !seenSeriesIds.has(seriesId)) {
          uniqueSeriesIds.push(seriesId);
          seenSeriesIds.add(seriesId);
        }
      }
    }
    const similarItemIds = similarItems.flatMap(series => series.items.map(item => item.id));

    const seriesArray = await getSeriesByIdsForSearching(uniqueSeriesIds, similarItemIds, gender);
    const safeSeriesArray: Series[] = seriesArray || [];

    const searchResult: SearchResult = {
      series: safeSeriesArray,
    };
    return searchResult;
  } catch (error) {
    console.error("Error in semanticSearchForSearching:", error);
    return null;
  }
};


export { semanticSearchForRecommendation, semanticSearchForSearching };