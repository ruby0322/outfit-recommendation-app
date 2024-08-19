"user server";
import { createClient } from "@/utils/supabase/server";

const deleteParamById = async (param_id: number) => {
  const supabase = createClient();
  const response = await supabase.from("param").delete().eq("id", param_id);
  console.log(response);
  return;
};

const deleteUploadById = async (upload_id: number) => {
  const supabase = createClient();
  const response = await supabase.from("upload").delete().eq("id", upload_id);
  console.log(response);
  return;
};

export { deleteParamById, deleteUploadById };
