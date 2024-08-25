"use server";
import openai from "@/utils/openai";
import { createClient } from "@/utils/supabase/server";

const getAllItems = async () => {
  const supabase = createClient();
  try {
    let { data, error, status } = await supabase
      .from("item")
      .select("id, label_string")
      .range(1000, 2000);
  } catch (error) {
    console.error("Error getting items:", error);
  }
};

const generateEmbedding = async (text: string) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const embedding = response.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

const handler = async () => {
  const supabase = createClient();
  try {
    let { data, error, status } = await supabase
      .from("item")
      .select("id, label_string")
      .is("embedding", null);

    if (error && status !== 406) {
      throw error;
    }
    console.log(data?.length);

    if (data) {
      for (const item of data) {
        const embedding = await generateEmbedding(item.label_string);

        if (embedding) {
          const { error } = await supabase
            .from("item")
            .update({ embedding })
            .eq("id", item.id);

          if (error) {
            console.error(
              `Error updating embedding for item ${item.id}:`,
              error
            );
          }
        } else {
          console.error(`Error generating embedding for item ${item.id}`);
        }
      }
    }

    console.log("Embeddings generated and saved successfully");
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
};

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

export { calculateDistance, generateEmbedding, getAllItems, handler };
