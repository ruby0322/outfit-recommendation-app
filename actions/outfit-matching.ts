"use server";
import { ResultTable } from '@/type';
import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from './embedding';

// Function to perform semantic search using Supabase API
const semanticSearch = async ({
  suggestion_id,
  suggested_label_string,
  max_num_item,
}: {
  suggestion_id: number;
  suggested_label_string: string;
  max_num_item: number;
}): Promise<ResultTable[] | null> => {
  try {
    const supabase = createClient();

    const calculateDistance = (embedding1: number[], embedding2: number[]): number => {
      if(!Array.isArray(embedding2)){
        throw new TypeError('emb2 is not array');
      }
      if (!Array.isArray(embedding1)) {
        // throw new TypeError('emb1 is not array');
        embedding1 = JSON.parse(embedding1);
      }
      return Math.sqrt(
        embedding1.reduce((sum, value, index) => sum + Math.pow(value - embedding2[index], 2), 0)
      );
    };

    const suggestedEmbedding = await generateEmbedding(suggested_label_string);
    // const embeddingString = JSON.stringify(suggestedEmbedding).replace(/^\[|\]$/g, '');

    // TODO: Replace the query logic below with actual Supabase semantic search query
    // Example: Use supabase.rpc or supabase.from to call a stored procedure or a custom SQL query

    const cat = await supabase.rpc('test');
    console.log(cat)

    const { data, error } = await supabase
      .from('item')
      .select('*')
      // .order(`embedding <=> array[${embeddingString}]`, { ascending: true })
      .order(`embedding <=> '[${suggestedEmbedding}]'`, { ascending: true })
      // Implement your code here
      .limit(max_num_item);
      

    if (error) {
      console.error("Error fetching results from Supabase:", error);
      return null;
    }
    if (suggestedEmbedding){
      // console.log(typeof(data[0].embedding));
      console.log(calculateDistance(data[0].embedding, suggestedEmbedding));
    }

    const resultTable: ResultTable[] = data.map((item: any) => ({
      created_at: item.created_at,
      distance: null, // calculateDistance(item.embedding, suggestedEmbedding); (Distance is already sorted by the query)
      id: Date.now(), // id 還要再想要用啥
      item_id: item.id,
      suggestion_id,
    }));

    return resultTable;
    // return [];
    // END TODO
  } catch (error) {
    console.error("Error in semanticSearch:", error);
    return null;
  }
};



export { semanticSearch };
