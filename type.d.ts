import { Tables } from "@/types/supabase";

export type ItemsTable = Tables<"items">;
export type ParamsTable = Tables<"params">;
export type RecommendationsTable = Tables<"recommendations">;
export type SuggestionsTable = Tables<"suggestions">;
export type UploadsTable = Tables<"uploads">;
export type ResultsTable = Tables<"results">;

export interface Recommendation {
  params: ParamsTable;
  upload: UploadsTable;
  items: {
    [style: string]: ItemsTable[];
  };
}
