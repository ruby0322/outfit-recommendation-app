"use server";

import { handleRecommendation, handleImageSearch } from "@/actions/upload";
import supabase from "@/lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { storeImageToStorage } from "@/actions/utils/insert";
import { cookies } from "next/headers";
import { getRecommendationRecordById } from "@/actions/recommendation";

export default async function Playground(){
  const recommendationId = await handleRecommendation({
    clothingType: 'bottom',
    imageUrl: 'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660',
    gender: 'female',
    model: 'gpt-4o-mini',
    userId: '64d2474a-2ac8-4775-ab5e-2c8a31bb037c',
    numMaxSuggestion: 3,
    numMaxItem: 10,
  });
  // router.push(`/recommendation/${recommendationId}`);
  console.log("recommendation_id = ", recommendationId);
  const Recommendation = await getRecommendationRecordById(recommendationId);
  console.log("recommendation for image = ", Recommendation);

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
};

