"use server";
import {
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  Series,
  SuggestionTable,
  UploadTable,
  SimplifiedItemTable
} from "@/type";
import {
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
} from "./utils/fetch";
import prisma from "@/prisma/db";

const getSeries = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string,
  clothingType: string
): Promise<Series[] | null> => {
  try {
    console.time("getSeriesForRecommendation");
    clothingType = clothingType === "top" ? "bottom" : "top";
    let genderString = gender === "neutral" ? "all" : gender;

    const viewName = `${genderString}_${clothingType}_item_matview`;
  
    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    for (const seriesId of uniqueSeriesIds) {
      const data: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(
        `SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
        FROM ${viewName} WHERE series_id = $1::uuid;`, seriesId
      );

      if (data.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const originalItems = data.filter(item => originalItemIds.includes(item.id));
      const otherItems = data.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ].map(item => ({
        ...item,
        price: item.price ? Number(item.price) : 0,
      }));

      const series: Series = {
        items: sortedItems,
      };
      seriesArray.push(series);
    }
    
    console.timeEnd("getSeriesForRecommendation");
    return seriesArray.length > 0 ? seriesArray : null;
  } catch (error) {
    console.error("Unexpected error in getSeries for Recommendation:", error);
    return null;
  }
};

const getRecommendationRecordById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  try {
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
    for (const s of suggestions) {
      const styleName = s.style_name as string;
      const description = s.description as string;
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

    return recommendation_record as Recommendation;
  } catch (error) {
    console.error("Unexpected error in getRecommendationById:", error);
    return null;
  }
};

export { getRecommendationRecordById };
