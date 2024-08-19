"use server";
import {
  ResultTable,
  SuggestionTable,
  RecommendationTable,
  Recommendation,
  ParamTable,
  UploadTable,
  ItemTable,
} from "@/type";
import { createClient } from "@/utils/supabase/server";

// Fetches results based on a suggestion ID
const getResults = async (
  suggestion_id: number
): Promise<ResultTable[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("result")
      .select("*")
      .eq("suggestion_id", suggestion_id);

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

// Fetches suggestions based on a recommendation ID
const getSuggestion = async (
  recommendation_id: number
): Promise<SuggestionTable[] | null> => {
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

const getRecommendationById = async (
  recommendation_id: number
): Promise<RecommendationTable | null> => {
  try {
    const supabase = createClient();
    const { data: recommendation, error } = await supabase
      .from("recommendation")
      .select("*")
      .eq("id", recommendation_id)
      .returns<RecommendationTable[]>();

    if (!recommendation || recommendation.length === 0) {
      return null;
    }
    return recommendation[0];
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return null;
  }
};



const getParamById = async (param_id: number): Promise<ParamTable | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("param")
      .select("*")
      .eq("id", param_id)
      .single();
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as ParamTable;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const getUploadById = async (
  upload_id: number
): Promise<UploadTable | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("upload")
      .select("*")
      .eq("id", upload_id)
      .single();
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as UploadTable;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch a single item by its ID
const getItemById = async (item_id: number): Promise<ItemTable | null> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .eq("id", item_id)
      .single();

    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }

    return data as ItemTable;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch multiple items by their IDs
const getItemsByIds = async (
  item_ids: number[]
): Promise<ItemTable[] | null> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .in("id", item_ids);

    if (error) {
      console.error("Error fetching items:", error);
      return null;
    }

    return data as ItemTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

export {
  getParamById,
  getRecommendationById,
  getResults,
  getSuggestion,
  getUploadById,
  getItemById,
  getItemsByIds,
};
