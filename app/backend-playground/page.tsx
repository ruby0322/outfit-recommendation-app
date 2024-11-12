"use server";

import { getFavoriteByUserId, handleFavorite } from "@/actions/favorite";
import { getRecommendationRecordById } from "@/actions/recommendation";
import { getLabelStringForImageSearch, handleSearch } from "@/actions/search";
import { handleRecommendation } from "@/actions/upload";
import { getSeriesForRecommendation } from "@/actions/utils/fetch";


export default async function Playground2() {
  try {
    let user_id = "64d2474a-2ac8-4775-ab5e-2c8a31bb037c";
    let image_url = "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-00e9d366-7707-4eba-a6d9-c500220a8201?t=2024-11-12T05%3A55%3A47.889Z";
    // let series_id = "0475159c-a171-464e-9d09-733839340744";
    // const favorite = await handleFavorite(user_id, "f6bea92c-60c0-4504-ac03-a2fb258df07d");
    // const labelString = await getLabelStringForImageSearch("male", "gpt-4o-mini", image_url);
    // const searchResult = await handleSearch(labelString, "male", 1, 0, 1000, undefined, "top", user_id);
    // // console.log(searchResult?.series[0]);
    // console.log("playground result = ", searchResult);
    // const favorite2 = await handleFavorite(user_id, "c3fa429a-e49c-471a-b67f-c5cedb5e1cb4");
    // const recommendation = await handleRecommendation("top", "female", "gpt-4o-mini", user_id, 3, 10, image_url);
    // const result = await getRecommendationRecordById(recommendation, user_id);
    // const result = await getSeriesForRecommendation(["0475159c-a171-464e-9d09-733839340744", "7f203d4e-ce09-4574-b95c-47898c9adccd"], ["000127e0-6178-461c-966c-dcf6739b5361", "001d5d9b-dd92-4021-a1ad-268232503b33"], "female", "top", user_id);
    // console.log("playground result = ", result);
    // const result = await getFavoriteByUserId("64d2474a-2ac8-4775-ab5e-2c8a31bb037c");
    // console.log(result);
    // const labelString = await getLabelStringForImageSearch("male", "gpt-4o-mini", "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-00ee47f4-8768-42d9-b68b-29a0702243ea");
    // const result = await handleImageSearch(labelString, "female", 1, 500, 700, ["H&M", "UNIQLO"], "top");
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
