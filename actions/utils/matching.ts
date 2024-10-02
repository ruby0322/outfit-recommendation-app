"use server";
import { Gender, SearchResult } from "@/type";
import supabase from "@/lib/supabaseClient";
import { calculateDistance, generateEmbedding } from "./embedding";

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

  if(err) {
    console.error("Error fetching results from Supabase:", err);
    return null;
  }

  return similarItems;
}

const semanticSearchForRecommendation = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender = "male",
} : {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
}) : Promise<UnstoredResult[] | null> => {
  try {
    const similarItems = await vectorSearch(
      suggestedLabelString,
      numMaxItem,
      gender
    );

    if (!similarItems) {
      return null;
    }

    const results: UnstoredResult[] = similarItems.map((item: { id: any; }, index: any) => ({
      distance: index,
      item_id: item.id,
      suggestion_id: suggestionId,
    }));

    return results;
  } catch (error) {
    console.error("Error in semanticSearchForRecommendation:", error);
    return null;
  }
};

const semanticSearchForImageAndTextSearch = async ({
  suggestedLabelString,
  numMaxItem,
  gender = "male",
} : {
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;  
}) : Promise<SearchResult | null> => {
  try {
    const similarItems = await vectorSearch(
      suggestedLabelString,
      numMaxItem,
      gender
    );

    if (!similarItems) {
      return null;
    }

    const result: SearchResult = {
      series: similarItems
    };
    
    return result;
  } catch (error) {
    console.error("Error in semanticSearchForImageSearch:", error);
    return null;
  }
};


export { semanticSearchForImageAndTextSearch, semanticSearchForRecommendation };
