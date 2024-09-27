"use server";
import {
  Gender,
  ItemTable,
  ParamTable,
  RecommendationTable,
  ResultTable,
  SuggestionTable,
  UploadTable,
} from "@/type";
import supabase from "@/lib/supabaseClient";

// Fetches results based on a suggestion ID
const getResults = async (
  suggestionId: number
): Promise<ResultTable[] | null> => {
  try {
    const { data, error } = await supabase
      .from("result")
      .select("*")
      .eq("suggestion_id", suggestionId);

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
  recommendationId: number
): Promise<SuggestionTable[] | null> => {
  try {
    const { data, error } = await supabase
      .from("suggestion")
      .select("*")
      .eq("recommendation_id", recommendationId);

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
  recommendationId: number
): Promise<RecommendationTable | null> => {
  try {
    const { data: recommendation, error } = await supabase
      .from("recommendation")
      .select("*")
      .eq("id", recommendationId)
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

const getParamById = async (paramId: number): Promise<ParamTable | null> => {
  try {
    const { data, error } = await supabase
      .from("param")
      .select("*")
      .eq("id", paramId)
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

const getUploadById = async (uploadId: number): Promise<UploadTable | null> => {
  try {
    const { data, error } = await supabase
      .from("upload")
      .select("*")
      .eq("id", uploadId)
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
const getItemById = async (itemId: string): Promise<ItemTable | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .eq("id", itemId)
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
  itemIds: string[]
): Promise<ItemTable[] | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .in("id", itemIds);

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

// Fetch the series ID by item ID
const getSeriesIDByItemId = async (itemId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("series_id")
      .eq("item_id", itemId)
      .single();

    if (error) {
      console.error("Error fetching series ID:", error);
      return null;
    }

    return data.series_id as string;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const getSeriesIdsByItemIds = async (item_ids: string[]): Promise<string[]> => {
  const seriesIdsSet = new Set<string>();

  for (const itemId of item_ids) {
    const seriesId = await getSeriesIDByItemId(itemId);
    if (seriesId) {
      seriesIdsSet.add(seriesId);
    }
  }

  return Array.from(seriesIdsSet);
};

// Fetch the series by series ID
const getSeriesById = async (seriesId: string): Promise<ItemTable[] | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .eq("series_id", seriesId);

    if (error) {
      console.error("Error fetching series ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Fetch the items by series ID
const getItemsIDBySeriesId = async (
  seriesId: string
): Promise<string[] | null> => {
  try {
    const { data, error } = await supabase
      .from("item")
      .select("item_id")
      .eq("series_id", seriesId);

    if (error) {
      console.error("Error fetching series ID:", error);
      return null;
    }
    const itemIDs = data.map((item) => item.item_id);

    return itemIDs;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

export {
  getItemById,
  getItemsByIds,
  getItemsIDBySeriesId,
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesById,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
};