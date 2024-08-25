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
import { createClient } from "@/utils/supabase/server";
import {
  getItemsByIds,
  getItemsIDBySeriesId,
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesById,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
} from "./utils/fetch";

// util function for getRecommendationRecordById()
const getSeries = async (series_ids: string[]): Promise<Series[] | null> => {
  try {
    const seriesArray: Series[] = [];
    const threads = [];

    for (const seriesId of series_ids) {
      const thread = async () => {
        const seriesTable = await getSeriesById(seriesId);
        if (!seriesTable) {
          return;
        }
        const itemIds = await getItemsIDBySeriesId(seriesId);
        if (itemIds) {
          const items = await getItemsByIds(itemIds);

          const series: Series = {
            ...seriesTable,
            items: items as ItemTable[],
          };
          seriesArray.push(series);
        }
      };
      threads.push(thread());
    }
    await Promise.all(threads);
    return seriesArray;
  } catch (error) {
    console.error("Unexpected error in getSeries:", error);
    return null;
  }
  return null;
};

// Fetches a recommendation by its ID
const getRecommendationRecordById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  try {
    const supabase = createClient();
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
    recommendation_record.items = {};

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    for (const s of suggestions) {
      const label_string = s.label_string as string;
      const results = (await getResults(s.id)) as ResultTable[]; // getResults()'s return type: Series[]
      const item_ids = results.map((r) => r.item_id) as string[];
      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      const series = (await getSeries(series_ids)) as Series[];
      const items = (await getItemsByIds(item_ids)) as ItemTable[];

      // Create a map to associate item_id with distance
      const itemIdToDistanceMapper: { [key: string]: ResultTable } =
        results.reduce((acc, item) => {
          acc[item.item_id as string] = item;
          return acc;
        }, {} as { [key: string]: ResultTable });

      // Sort items by distance
      items.sort(
        (a, b) =>
          (itemIdToDistanceMapper[a.id].distance as number) -
          (itemIdToDistanceMapper[b.id].distance as number)
      );

      recommendation_record.items![label_string] = series; // { [style: string]: Series[] }
    }

    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

export { getRecommendationRecordById };
