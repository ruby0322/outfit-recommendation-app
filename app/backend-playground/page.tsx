"use client";

import { handleRecommendationWithoutLogin, handleTextSearch } from "@/actions/upload";
import { handler } from "@/actions/utils/embedding";

export default async function Playground2() {
  // try {
  //   const result = await handleTextSearch("請給我藍色清爽襯衫", "gpt-4o-mini", "male", 1, 500, 700, ["H&M", "UNIQLO"], "top");
  //   console.log(result);
    

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
