"use server";
import supabase from "@/lib/supabaseClient";
import { Gender, ItemTable, SearchResult } from "@/type";
import { generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

const vectorSearch = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender
) => {
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

  return similarItems;
};

const getSeriesByIds = async (
  seriesIds: string[]
): Promise<SearchResult | null> => {
  try {
    const { data: items, error } = await supabase
      .from("item")
      .select("*")
      .in("series_id", seriesIds);

    console.log("items", items);

    if (error) {
      console.error("Error fetching series:", error);
      return null;
    }

    return {
      series: seriesIds.map((seriesId) => {
        return { items: items?.filter((item) => item.series_id === seriesId) };
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
}: {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
}): Promise<UnstoredResult[] | null> => {
  try {
    const similarItems = await vectorSearch(
      suggestedLabelString,
      numMaxItem,
      gender
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
  gender = "male",
}: {
  suggestedLabelString: string;
  gender: Gender;
}): Promise<SearchResult | null> => {
  try {
    const similarItems = await vectorSearch(suggestedLabelString, 20, gender);

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
