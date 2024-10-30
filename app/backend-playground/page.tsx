"use server";

import { handleRecommendationWithoutLogin } from "@/actions/upload";

export default async function Playground2() {
  try {
      // const result = handleRecommendationWithoutLogin("top", "female", "gpt-4o-mini", 3, 10, "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-56522f10-093d-4ddf-b602-8fde70c00e4b");
      // console.log(result);

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

