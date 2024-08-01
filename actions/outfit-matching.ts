"use server";
import { ResultTable } from '@/type';
import { createClient } from "@/utils/supabase/server";

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

    // TODO: Replace the query logic below with actual Supabase semantic search query
    // Example: Use supabase.rpc or supabase.from to call a stored procedure or a custom SQL query
    const { data, error } = await supabase
      .from('your_table_name') // Replace with the actual table name
      .select('*')
      .ilike('label_string_column', `%${suggested_label_string}%`) // Replace with actual column
      .limit(max_num_item);

    if (error) {
      console.error("Error fetching results from Supabase:", error);
      return null;
    }

    return [];
    // END TODO
  } catch (error) {
    console.error("Error in semanticSearch:", error);
    return null;
  }
};



export { semanticSearch };
