"use server";

import {
  ItemTable,
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  SuggestionTable,
  UploadTable,
} from "@/type";
import { createClient } from "@/utils/supabase/server";
import { getParamById, getUploadById } from "./user-input";
import { getItemsByIds } from "./item";

// Fetches results based on a suggestion ID
const getResults = async (suggestion_id: number): Promise<ResultTable[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("result")
      .select("*")
      .eq("id", suggestion_id)
      .single();
    
    if (error) {
      console.error("Error fetching results:", error);
      return null;
    }
    
    return data as ResultTable[];
  } catch (error) {
    console.error("Unexpected error in getResults:", error);
    return null;
  }
};

// Inserts results into the database
const insertResults = async (results: ResultTable[]): Promise<number[] | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("result")
      .insert(results)
      .select("id");

    if (error) {
      console.error("Error inserting results:", error);
      return null;
    }

    return data ? data.map(o => o.id) : null;
  } catch (error) {
    console.error("Unexpected error in insertResults:", error);
    return null;
  }
};

// Fetches suggestions based on a recommendation ID
const getSuggestion = async (recommendation_id: number): Promise<SuggestionTable[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("suggestion")
      .select("*")
      .eq("recommendation_id", recommendation_id);

    if (error) {
      console.error("Error fetching suggestions:", error);
      return null;
    }

    return data as SuggestionTable[];
  } catch (error) {
    console.error("Unexpected error in getSuggestion:", error);
    return null;
  }
};

// Inserts a suggestion into the database
const insertSuggestion = async (
  recommendation_id: number,
  label_string: string
): Promise<number> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("suggestion")
      .insert({ recommendation_id, label_string })
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

// Fetches a recommendation by its ID
const getRecommendationById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  const supabase = createClient();

  try {
    const { data: recommendation, error } = await supabase
      .from("recommendation")
      .select("*")
      .eq("id", recommendation_id)
      .returns<RecommendationTable[]>();

    if (error) {
      console.error("Error fetching recommendation:", error);
      return null;
    }

    if (!recommendation || recommendation.length === 0) {
      return null;
    }

    const recommendation_record: Partial<Recommendation> = {};

    const param_id = recommendation[0].param_id as number;
    const upload_id = recommendation[0].upload_id as number;
    const param = await getParamById(param_id) as ParamTable;
    const upload = await getUploadById(upload_id) as UploadTable;

    recommendation_record.params = param;
    recommendation_record.upload = upload;
    recommendation_record.items = {};

    const suggestions = await getSuggestion(recommendation_id) as SuggestionTable[];
    for (const s of suggestions) {
      const label_string = s.label_string as string;
      const results = await getResults(s.id) as ResultTable[];
      const item_ids = results.map(r => r.item_id) as number[];
      const items = await getItemsByIds(item_ids) as ItemTable[];

      // Create a map to associate item_id with distance
      const itemIdToDistanceMapper: { [key: number]: ResultTable } = results.reduce(
        (acc, item) => {
          acc[item.item_id as number] = item;
          return acc;
        }, 
        {} as { [key: number]: ResultTable }
      );

      // Sort items by distance
      items.sort(
        (a, b) =>
          (itemIdToDistanceMapper[a.id].distance as number) -
          (itemIdToDistanceMapper[b.id].distance as number)
      );

      recommendation_record.items![label_string] = items;
    }

    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

// Inserts a new recommendation into the database
const insertRecommendation = async (param_id: number, upload_id: number): Promise<number> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("recommendation")
      .insert([{ param_id, upload_id }])
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

export {
  getRecommendationById,
  insertRecommendation,
  insertSuggestion,
  insertResults,
};
