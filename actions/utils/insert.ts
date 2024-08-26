"use server";
import { BodyType, ClothingType, Gender } from "@/type";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { UnstoredResult } from "./matching";

const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const storeImageToStorage = async (base64: string) => {
  const blob: Blob = base64ToBlob(base64);
  const supabase = createClient();
  const filename = `image-${uuidv4()}`;
  console.log(filename);
  await supabase.storage.from("image").upload(filename, blob, {
    cacheControl: "3600",
    upsert: false,
  });
  const {
    data: { publicUrl },
  } = supabase.storage.from("image").getPublicUrl(filename);
  return publicUrl;
};

// Inserts results into the database
const insertResults = async (
  results: UnstoredResult[]
): Promise<number[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("result")
      .insert(results)
      .select("id");

    if (error) {
      console.error("Error inserting results:", error);
      return null;
    }

    return data ? data.map((obj) => obj.id) : [];
  } catch (error) {
    console.error("Unexpected error in insertResults:", error);
    return null;
  }
};

// Inserts a suggestion into the database
const insertSuggestion = async ({
  recommendationId,
  labelString,
}: {
  recommendationId: number;
  labelString: string;
}): Promise<number> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("suggestion")
      .insert({
        recommendation_id: recommendationId,
        label_string: labelString,
      })
      .select("id");

    if (error) {
      console.error("Error inserting suggestion:", error);
      return -1;
    }

    return data && data.length > 0 ? data[0].id : -1;
  } catch (error) {
    console.error("Unexpected error in insertSuggestion:", error);
    return -1;
  }
};

// Inserts a new recommendation into the database
const insertRecommendation = async ({
  paramId,
  uploadId,
}: {
  paramId: number;
  uploadId: number;
}): Promise<number> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("recommendation")
      .insert([{ param_id: paramId, upload_id: uploadId }])
      .select("id");

    if (error) {
      console.error("Error inserting recommendation:", error);
      return -1;
    }

    return data && data.length > 0 ? data[0].id : -1;
  } catch (error) {
    console.error("Unexpected error in insertRecommendation:", error);
    return -1;
  }
};

const insertParam = async (
  height: number | null,
  weight: number | null,
  gender: Gender,
  bodyType: BodyType,
  clothinType: ClothingType,
  stylePreferences: string | null,
  model: string
): Promise<number> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("param")
    .insert([
      {
        height,
        weight,
        gender,
        body_type: bodyType,
        clothing_type: clothinType,
        style_preferences: stylePreferences,
        model,
      },
    ])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const paramId = data[0].id;
    return paramId as number;
  } else {
    return -1;
  }
};

const insertUpload = async (
  imageUrl: string,
  labelString: string,
  userId: number
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("upload")
    .insert([
      { image_url: imageUrl, label_string: labelString, user_id: userId },
    ])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const uploadId = data[0].id;
    return uploadId as number;
  } else {
    return -1;
  }
};

export {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
  storeImageToStorage,
};
