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
    // console.log(`Starting getSeries with ${series_ids.length} series IDs, gender: ${gender}`);
    const seriesArray: Series[] = [];
    const threads: Promise<void>[] = [];
    const dbGender = gender === "man" ? "male" : "female";

    for (const seriesId of series_ids) {
      const thread = async (): Promise<void> => {
        try {
          console.log(`Processing seriesId: ${seriesId}`);
          const seriesTable = await getSeriesById(seriesId);
          if (!seriesTable) {
            console.log(`No series found for ID: ${seriesId}`);
            return;
          }
          if (seriesTable.gender !== dbGender) {
            console.log(`Series ${seriesId} gender mismatch: ${seriesTable.gender} !== ${dbGender}`);
            return;
          }
          const itemIds = await getItemsIDBySeriesId(seriesId);
          if (!itemIds || itemIds.length === 0) {
            console.log(`No items found for series ${seriesId}`);
            return;
          }
          console.log(`Found ${itemIds.length} items for series ${seriesId}`);
          let items = await getItemsByIds(itemIds);
          if (!items || items.length === 0) {
            console.log(`Failed to fetch items for series ${seriesId}`);
            return;
          }
          items = items.sort((a, b) => 
            originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)
          );

          const series: Series = {
            ...seriesTable,
            items: items as ItemTable[],
          };

          seriesArray.push(series);
          // console.log(`Successfully added series ${seriesId} with ${items.length} items`);
        } catch (error) {
          console.error(`Error processing series ${seriesId}:`, error);
        }
      };
      threads.push(thread());
    }
    await Promise.all(threads);
    // console.log(`Finished processing. Found ${seriesArray.length} matching series.`);
    console.timeEnd("getSeries");
    return seriesArray.length > 0 ? seriesArray : null;
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
      const results = (await getResults(s.id)) as ResultTable[];
      if (!results) throw new Error("No results found");

      const item_ids = results.map((r) => r.item_id) as string[];
      // console.log("item_ids: " + item_ids) 有東西

      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      if (!series_ids.length) throw new Error("No series IDs found");

      const gender = recommendation_record.param.gender === "male" ? "man" : "woman";
      const series = (await getSeries(series_ids, item_ids, gender)) as Series[];
      if (!series) throw new Error("No series found");

      recommendation_record.series![label_string] = series;
    }
    console.timeEnd("get results, series, items");
    console.timeEnd("getRecommendationRecordById");
    // console.log("recommendation record", recommendation_record)
    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

export { getRecommendationRecordById };
