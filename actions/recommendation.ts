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
const getSeries = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string
): Promise<Series[] | null> => {
  try {
    console.time("getSeries");
    const seriesArray: Series[] = [];
    const threads: Promise<void>[] = [];

    for (const seriesId of series_ids) {
      const thread = async (): Promise<void> => {
        const seriesTable = await getSeriesById(seriesId);
        if (!seriesTable) {
          return;
        }
        if (seriesTable.gender !== gender) {
          return;
        }
        const itemIds = await getItemsIDBySeriesId(seriesId);
        if (itemIds) {
          let items = await getItemsByIds(itemIds);

          // items = items.sort((a, b) => {
          //   const aIndex = originalItemIds.indexOf(a.item_id);
          //   const bIndex = originalItemIds.indexOf(b.item_id);
          //   return aIndex - bIndex;
          // });
          if (items) {
            originalItemIds.forEach((originalItemId) => {
              const index = items.findIndex(
                (item) => item.id === originalItemId
              );
              if (index !== -1) {
                const [matchedItem] = items.splice(index, 1);
                items.unshift(matchedItem);
              }
            });

            const series: Series = {
              ...seriesTable,
              items: items as ItemTable[],
            };
            seriesArray.push(series);
          }
        }
      };
      threads.push(thread());
    }
    await Promise.all(threads);
    console.timeEnd("getSeries");
    return seriesArray;
  } catch (error) {
    console.error("Unexpected error in getSeries:", error);
    return null;
  }
};

// Fetches a recommendation by its ID
const getRecommendationRecordById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  try {
    console.time("getRecommendationRecordById");
    console.time("get param, upload, suggestion");
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
    recommendation_record.series = {};

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    console.timeEnd("get param, upload, suggestion");

    console.time("get results, series, items");
    for (const s of suggestions) {
      const label_string = s.label_string as string;
      const results = (await getResults(s.id)) as ResultTable[]; // getResults()'s return type: Series[]
      console.log(results);
      const item_ids = results.map((r) => r.item_id) as string[];
      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      const gender =
        recommendation_record.param.gender === "male" ? "man" : "woman";
      const series = (await getSeries(
        series_ids,
        item_ids,
        gender
      )) as Series[];
      const items = (await getItemsByIds(item_ids)) as ItemTable[];

      // Create a map to associate item_id with distance
      const itemIdToDistance: { [key: string]: number } = results.reduce(
        (acc, item) => {
          acc[item.item_id as string] = item.distance as number;
          return acc;
        },
        {} as { [key: string]: number }
      );
      // Sort items by distance
      items.sort((a, b) => itemIdToDistance[a.id] - itemIdToDistance[b.id]);
      
      recommendation_record.series![label_string] = series; // { [style: string]: Series[] }
    }
    console.timeEnd("get results, series, items");
    console.timeEnd("getRecommendationRecordById");
    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

export { getRecommendationRecordById };
