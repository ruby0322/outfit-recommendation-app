"use server"
import { createClient } from "@/utils/supabase/server";
import { ItemTable } from "@/type";
import { generateEmbedding } from "./embedding";

const handler = async () => {
    const supabase = createClient();
    try {
      let { data, error, status } = await supabase
        .from('item')
        .select('id, label_string')
        .is('embedding', null);
  
      if (error && status !== 406) {
        throw error;
      }
      
      if(data){
        for (const item of data) {
            const embedding = await generateEmbedding(item.label_string);

            if (embedding) {
            const { error } = await supabase
                .from('item')
                .update({ embedding })
                .eq('id', item.id);

            if (error) {
                console.error(`Error updating embedding for item ${item.id}:`, error);
            }
            } else {
            console.error(`Error generating embedding for item ${item.id}`);
            }
        }
      }
      
      console.log('Embeddings generated and saved successfully');
    } catch (error) {
      console.error('Error generating embeddings:', error);
    }
  }

export default handler;