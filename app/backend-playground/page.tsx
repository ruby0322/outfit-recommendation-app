"use client";

import { handleRecommendationWithoutLogin, handleTextSearch, handleImageSearch, getLabelStringForTextSearch, getLabelStringForImageSearch } from "@/actions/upload";

export default async function Playground2() {
  try {
    const labelString = await getLabelStringForImageSearch("male", "gpt-4o-mini", "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-00ee47f4-8768-42d9-b68b-29a0702243ea");
    const result = await handleImageSearch(labelString, "female", 1, 500, 700, ["H&M", "UNIQLO"], "top");
    console.log(result);
    

  // } catch (error) {
  //   console.error("Error during backend function calls", error);
  // }

  const generateEmbedding = async () => {
    await handler();
  }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
      <button onClick={generateEmbedding}>generateEmbedding</button>
    </div>
  );
}
