"use server";
import { Gender, SearchResult } from "@/type";
import supabase from "@/lib/supabaseClient";
import { calculateDistance, generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

const semanticSearch = async ({
  suggestedLabelString,
  numMaxItem,
  gender = "male",
}: {
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
}): Promise<SearchResult[] | null> => {
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

    return similarItems;
  } catch (error) {
    console.error("Error in semanticSearch:", error);
    return null;
  }
};


export { semanticSearch };
