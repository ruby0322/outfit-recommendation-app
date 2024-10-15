"use server";
import supabase from "@/lib/supabaseClient";
import { ClothingType, Gender, ItemTable, SearchResult } from "@/type";
import { generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

interface Series {
  items: ItemTable[];
}

const vectorSearchForRecommendation = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
  clothing_type: ClothingType
) : Promise<ItemTable[] | null> => {
  try { 
    clothing_type = clothing_type === "top" ? "bottom" : "top";
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const rpcFunctionName = `query_similar_${gender}_${clothing_type}_items`;
    
    const { data: similarItems, error: err } = await supabase.rpc(
      rpcFunctionName,
      {
        query_embedding: suggestedEmbedding,
        match_threshold: 0.2,
        max_item_count: numMaxItem,
      }
    );

    if (err) {
      console.error("Error fetching results from Supabase:", err);
      return null;
    }

    return similarItems as ItemTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const vectorSearchForSearching = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
) : Promise<ItemTable[] | null> => {
  try { 
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const rpcFunctionName = `query_similar_${gender}_items`;
    
    const { data: similarItems, error: err } = await supabase.rpc(
      rpcFunctionName,
      {
        query_embedding: suggestedEmbedding,
        match_threshold: 0.2,
        max_item_count: numMaxItem,
      }
    );

    if (err) {
      console.error("Error fetching results from Supabase:", err);
      return null;
    }

    return similarItems as ItemTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
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
      const { data, error } = await supabase
        .from(matViewName)
        .select("*")
        .eq("series_id", seriesId);

      if (error) {
        console.error(`Error fetching items from ${matViewName}:`, error);
        return null;
      }

      if (data.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const originalItems = data.filter(item => originalItemIds.includes(item.id));
      const otherItems = data.filter(item => !originalItemIds.includes(item.id));

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
      clothing_type
    );

    if (!similarItems) {
      return null;
    }

    const results: UnstoredResult[] = similarItems.map(
      (item: { id: any }, index: any) => ({
        distance: index,
        item_id: item.id,
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

    for (const item of similarItems) {
      const seriesId = item.series_id;
      if (!seenSeriesIds.has(seriesId)) {
        uniqueSeriesIds.push(seriesId);
        seenSeriesIds.add(seriesId);
      }
    }
    // console.log("uniqueSeriesIds: ", uniqueSeriesIds);
    const similarItemIds = similarItems.map(item => item.id);

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
