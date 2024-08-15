"use server";
import { ResultTable } from "@/type";
import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

const calculateDistance = (
  embedding1: number[],
  embedding2: number[]
): number => {
  if (!Array.isArray(embedding2)) {
    throw new TypeError("emb2 is not array");
  }
  if (!Array.isArray(embedding1)) {
    // throw new TypeError('emb1 is not array');
    embedding1 = JSON.parse(embedding1);
  }
  return (
    1 -
    embedding1.reduce((sum, value, index) => sum + value * embedding2[index], 0)
  );
};

// Function to perform semantic search using Supabase API
const semanticSearch = async ({
  suggestion_id,
  suggested_label_string,
  max_num_item,
}: {
  suggestion_id: number;
  suggested_label_string: string;
  max_num_item: number;
}): Promise<UnstoredResult[] | null> => {
  try {
    const supabase = createClient();

    const suggestedEmbedding = await generateEmbedding(suggested_label_string);
    // const embeddingString = JSON.stringify(suggestedEmbedding).replace(/^\[|\]$/g, '');

    // TODO: Replace the query logic below with actual Supabase semantic search query
    // Example: Use supabase.rpc or supabase.from to call a stored procedure or a custom SQL query
    const { data: similarItems, error: err } = await supabase.rpc(
      "query_similar_items",
      {
        query_embedding: suggestedEmbedding,
        match_threshold: 0.2,
        max_item_count: 5,
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
        suggestion_id,
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
