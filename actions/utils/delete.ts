"user server";
import { createClient } from "@/utils/supabase/server";

const deleteParamById = async (paramId: number) => {
  const supabase = createClient();
  const response = await supabase.from("param").delete().eq("id", paramId);
  console.log(response);
  return;
};

const deleteUploadById = async (uploadId: number) => {
  const supabase = createClient();
  const response = await supabase.from("upload").delete().eq("id", uploadId);
  console.log(response);
  return;
};

export { deleteParamById, deleteUploadById };
