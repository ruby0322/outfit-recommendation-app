"use server";
import openai from "@/utils/openai";
import supabase from "@/lib/supabaseClient";

interface Item {
  id: string;
  label_string: string;
  embedding?: number[] | null;
}


const getAllItems = async (start: number = 1000, end: number = 2000): Promise<Item[] | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("id, label_string")
      .range(start, end);
    
    if(error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting items:", error);
    return null;
  }
};

const generateEmbedding = async (text: string): Promise<number[] | null> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

const handler = async (): Promise<void> => {
  try {
    const { data, error, status } = await supabase
      .from("item")
      .select("id, label_string")
      .is("embedding", null);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const updates = data.map(async (item) => {
        const embedding = await generateEmbedding(item.label_string);

        if (embedding) {
          const { error } = await supabase
            .from("item")
            .update({ embedding })
            .eq("id", item.id);
        
          if(error) {
            console.error(`Error updating embedding for item ${item.id}:`, error);
          }
        } else {
          console.error(`Error generating embedding for item ${item.id}`);
        }
      });
    
      await Promise.all(updates);
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
};

const calculateDistance = (
  embedding1: number[] | string,
  embedding2: number[]
): number => {
  const emb1 = Array.isArray(embedding1) ? embedding1 : JSON.parse(embedding1);

  if (!Array.isArray(emb1) || !Array.isArray(embedding2)) {
    throw new TypeError("Both embeddings should be arrays");
  }

  if (emb1.length !== embedding2.length) {
    throw new Error("Embeddings must have the same length");
  }

  return 1 - emb1.reduce((sum, value, index) => sum + value * embedding2[index], 0);
};

export { calculateDistance, generateEmbedding, getAllItems, handler };
