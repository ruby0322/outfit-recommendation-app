"user server";
import supabase from "@/lib/supabaseClient";

const deleteParamById = async (paramId: number) => {
  const response = await supabase.from("param").delete().eq("id", paramId);
  // console.log(response);
  return;
};

const deleteUploadById = async (uploadId: number) => {
  const response = await supabase.from("upload").delete().eq("id", uploadId);
  // console.log(response);
  return;
};

export { deleteParamById, deleteUploadById };
