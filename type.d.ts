import { Enums, Tables } from "@/types/supabase";

export type ItemTable = Tables<"item">;
export type ParamTable = Tables<"param">;
export type RecommendationTable = Tables<"recommendation">;
export type SuggestionTable = Tables<"suggestion">;
export type UploadTable = Tables<"upload">;
export type ResultTable = Tables<"result">;
export type ProfileTable = Tables<"profile">;

export type ClothingType = Enums<"clothing_type">;
export type BodyType = Enums<"body_type">;
export type Gender = Enums<"gender">;

export type Series = { items: ItemTable[]};

export interface Recommendation {
  param: ParamTable;
  upload: UploadTable;
  styles: {
    [styleName: string]: { series: Series[], description: string };
  };
}

export type RecommendationPreview = RecommendationTable & {
  upload: UploadTable;
};
