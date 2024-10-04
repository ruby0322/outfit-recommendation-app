"use server";

import { handleRecommendation, handleImageSearch, handleTextSearch } from "@/actions/upload";
import supabase from "@/lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { storeImageToStorage } from "@/actions/utils/insert";
import { cookies } from "next/headers";
import { getRecommendationRecordById } from "@/actions/recommendation";

export default async function Playground(){
  // const recommendationId = await handleRecommendation(
  //   'bottom',
  //   'female',
  //   'gpt-4o-mini',
  //   '64d2474a-2ac8-4775-ab5e-2c8a31bb037c',
  //   3,
  //   10,
  //   'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660',
  // );

  // const imgSearchResult = await handleImageSearch (
  //   'bottom',
  //   'female',
  //   'gpt-4o-mini',
  //   'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660',
  // )

  const textSearchResult = await handleTextSearch (
    'bottom',
    '我想要找一件黑色牛仔長褲，可以用來搭配我的白色 T-shirt',
    'gpt-4o-mini',
    'female',
  )

  // router.push(`/recommendation/${recommendationId}`);
  // console.log("recommendation_id = ", recommendationId);
  // const Recommendation = await getRecommendationRecordById(recommendationId);
  // console.log("recommendation for image = ", Recommendation);
  // console.log("image search result = ", imgSearchResult);
  console.log("text search result = ", textSearchResult);

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
};

