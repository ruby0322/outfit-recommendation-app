"use server";
import { createClient } from "@/utils/supabase/server";
import { ItemTable } from "@/type";

const getItemById = async (item_id: string): Promise<ItemTable | null> => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', item_id)
          .single();
        
        if (error) {
          console.error('Error fetching item:', error);
          return null;
        }
    
        return data as ItemTable;
      } catch (error) {
        console.error('Unexpected error:', error);
        return null;
      }
};

const getItemsByIds = async (item_ids: string[]): Promise<ItemTable[]> => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .in('id', item_ids);
        
        if (error) {
          console.error('Error fetching items:', error);
          return [];
        }
    
        return data as ItemTable[];
      } catch (error) {
        console.error('Unexpected error:', error);
        return [];
      }
    
};

export { getItemById, getItemsByIds };