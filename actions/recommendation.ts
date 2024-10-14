"use server";
import {
  ItemTable,
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  Series,
  SuggestionTable,
  UploadTable,
} from "@/type";
import {
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
} from "./utils/fetch";
import supabase from "@/lib/supabaseClient";

const getSeries = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string,
  clothingType: string
): Promise<Series[] | null> => {
  try {
    console.time("getSeries");
    
    const matViewName = `${gender}_${clothingType}_item_matview`;

    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    for (const seriesId of uniqueSeriesIds) {
      const { data, error } = await supabase
        .from(matViewName)
        .select("*")
        .eq("series_id", seriesId);

      if (error) {
        console.error(`Error fetching items from ${matViewName}:`, error);
        return null;
      }

      if (data.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const originalItems = data.filter(item => originalItemIds.includes(item.id));
      const otherItems = data.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ];

      const series: Series = {
        items: sortedItems,
      };
      seriesArray.push(series);
    }
    console.timeEnd("getSeries");
    return seriesArray.length > 0 ? seriesArray : null;
  } catch (error) {
    console.error("Unexpected error in getSeries:", error);
    return null;
  }
};

const getRecommendationRecordById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  try {
    // console.time("getRecommendationRecordById");
    // console.time("get param, upload, suggestion");
    const recommendation = (await getRecommendationById(
      recommendation_id
    )) as RecommendationTable;
    const recommendation_record: Partial<Recommendation> = {};

    const param_id = recommendation.param_id as number;
    const upload_id = recommendation.upload_id as number;
    const param = (await getParamById(param_id)) as ParamTable;
    const upload = (await getUploadById(upload_id)) as UploadTable;

    recommendation_record.param = param;
    recommendation_record.upload = upload;
    recommendation_record.styles = {};

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    // console.timeEnd("get param, upload, suggestion");
    // console.time("get results, series, items");
    for (const s of suggestions) {
      const styleName = s.style_name as string;
      const description = s.description as string;
      // console.log("styleName", styleName);
      // console.log("description", description);
      const results = (await getResults(s.id)) as ResultTable[];
      if (!results) throw new Error("No results found");

      const item_ids = results.map((r) => r.item_id) as string[];

      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      if (!series_ids.length) throw new Error("No series IDs found");

      const gender = recommendation_record.param.gender ?? "neutral";
      const clothingType = recommendation_record.param.clothing_type ?? "top";
      const series = (await getSeries(series_ids, item_ids, gender, clothingType)) as Series[];
      if (!series) throw new Error("No series found");

      recommendation_record.styles![styleName] = {
        series,
        description
      };
    }
    // console.timeEnd("get results, series, items");
    // console.timeEnd("getRecommendationRecordById");

    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

export { getRecommendationRecordById };
