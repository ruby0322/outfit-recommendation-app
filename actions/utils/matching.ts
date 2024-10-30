"use server";
import { SearchResult, Series, SimplifiedItemTable, UnstoredResult, ClothingType, Gender, ItemTable } from "@/type";
import { getSeriesByIdsForSearching } from "./fetch";
import { generateEmbedding } from "./embedding";
import prisma from "@/prisma/db";

const vectorSearchForRecommendation = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
  clothing_type: ClothingType,
): Promise<Series[] | null> => {
  try {
    clothing_type = clothing_type === "top" ? "bottom" : "top";
    let genderString = gender === "neutral" ? "all" : gender;
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = 0.2;

    const viewName = `${genderString}_${clothing_type}_item_matview`;

    const items: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(`
      SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
      FROM ${viewName}
      WHERE ${viewName}.embedding <#> $1::vector < $2
      ORDER BY ${viewName}.embedding <#> $1::vector
      LIMIT $3;
    `, suggestedEmbedding, matchThreshold, numMaxItem);

    const series: Series[] = items.map(simplifiedItem => ({
      items: [{
        ...simplifiedItem,
        price: simplifiedItem.price ? Number(simplifiedItem.price) : 0,
      }],
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
    let genderString = gender === "neutral" ? "all" : gender;
    const viewName = `${genderString}_item_matview`;

    const items: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(`
      SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
      FROM ${viewName}
      WHERE ${viewName}.embedding <#> $1::vector < $2
      ORDER BY ${viewName}.embedding <#> $1::vector
      LIMIT $3;
    `, suggestedEmbedding, matchThreshold, numMaxItem);
    
    const series: Series[] = items.map(simplifiedItem => ({
      items: [{
        ...simplifiedItem,
        price: simplifiedItem.price ? Number(simplifiedItem.price) : 0,
      }],
    }));

    return series;
  } catch (error) {
    console.error("Error fetching similar items:", error);
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
        item_id: series.items[0].id,
        suggestion_id: suggestionId,
      })
    );

    return results;
  } catch (error) {
    console.error("Error in semanticSearchForRecommendation:", error);
    return null;
  }
};

const semanticSearchWithoutLogin = async ({
  suggestedLabelString,
  numMaxItem,
  gender,
  clothing_type,
}: {
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
  clothing_type: ClothingType;
}): Promise<Series[] | null> => {
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

    const itemIds = similarItems.flatMap(series => series.items.map(item => item.id));

    const items: ItemTable[] = await prisma.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    });

    const simplifiedItems: SimplifiedItemTable[] = items.map(item => ({
      clothing_type: item.clothing_type,
      gender: item.gender,
      id: item.id,
      color: item.color,
      external_link: item.external_link,
      image_url: item.image_url,
      label_string: item.label_string,
      price: item.price,
      provider: item.provider,
      series_id: item.series_id,
      title: item.title,
    }));

    const seriesArray: Series[] = [{
      items: simplifiedItems,
    }];

    return seriesArray;
  } catch (error) {
    console.error("Error in semanticSearchWithoutLogin:", error);
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

export { semanticSearchForRecommendation, semanticSearchForSearching, semanticSearchWithoutLogin };