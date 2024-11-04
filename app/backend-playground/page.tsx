"use server";

import { handleRecommendationWithoutLogin, handleTextSearch } from "@/actions/upload";

export default async function Playground2() {
  try {
      const result = handleTextSearch("請給我藍色清爽襯衫", "gpt-4o-mini", "male", 500, 700, ["H&M", "UNIQLO"], "top");
      console.log(result);

  } catch (error) {
      console.error("Error during backend function calls", error);
  }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
}

