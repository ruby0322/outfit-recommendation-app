"use server";
import { Gender } from "@/type";
import { createClient } from "@/utils/supabase/server";
import { calculateDistance, generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

// Function to perform semantic search using Supabase API
const semanticSearch = async ({
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
    const supabase = createClient();

    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    // const embeddingString = JSON.stringify(suggestedEmbedding).replace(/^\[|\]$/g, '');

    // TODO: Replace the query logic below with actual Supabase semantic search query
    // Example: Use supabase.rpc or supabase.from to call a stored procedure or a custom SQL query
    const { data: similarItems, error: err } = await supabase.rpc(
      `query_similar_${gender}_items`,
      // `query_similar_items`,
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

    let results: UnstoredResult[] = [];

    for (const item of similarItems) {
      const result: UnstoredResult = {
        distance: calculateDistance(
          item.embedding,
          suggestedEmbedding as number[]
        ),
        item_id: item.id,
        suggestion_id: suggestionId,
      };
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error("Error in semanticSearch:", error);
    return null;
  }
};

export { semanticSearch };
