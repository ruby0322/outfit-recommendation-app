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
) : Promise<ItemTable[] | null> => {
  try { 
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const rpcFunctionName = `query_similar_items`;
    
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

const getSeriesByIds = async (
  seriesIds: string[]
): Promise<SearchResult | null> => {
  try {
    const { data: items, error } = await supabase
      .from("item")
      .select("*")
      .in("series_id", seriesIds);
    
    if (error) {
      console.error("Error fetching series:", error);
      return null;
    }

    const seriesMap = new Map<string, ItemTable[]>();
    for(const item of items) {
      if(!seriesMap.has(item.series_id)) {
        seriesMap.set(item.series_id, []);
      }
      seriesMap.get(item.series_id)!.push(item);
    }

    const seriesArray: Series[] = seriesIds.map((seriesId) => ({
      items: seriesMap.get(seriesId) || [],
    }));

    return {series: seriesArray};
  } catch (error) {
    console.error("Unexpected error in getSeriesByIds:", error);
    return null;
  }
};

const semanticSearchForRecommendation = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender = "neutral",
  clothing_type = "top",
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
}: {
  suggestedLabelString: string;
}): Promise<SearchResult | null> => {
  try {
    const similarItems = await vectorSearchForSearching(suggestedLabelString, 20);

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

    const result = await getSeriesByIds(uniqueSeriesIds);

    return result;
  } catch (error) {
    console.error("Error in semanticSearchForSearching:", error);
    return null;
  }
};

export { semanticSearchForRecommendation, semanticSearchForSearching };
