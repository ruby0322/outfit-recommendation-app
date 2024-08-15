"use server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const storeImageToStorage = async (base64: string) => {
  const blob: Blob = base64ToBlob(base64);
  const supabase = createClient();
  /* Upload picture to supabase storage */
  const filename = `image-${uuidv4()}`;
  console.log(filename);
  await supabase.storage.from("image").upload(filename, blob);
  /* Retrieve avatar URL */
  const {
    data: { publicUrl },
  } = supabase.storage.from("image").getPublicUrl(filename);
  return publicUrl;
};

const listStorageImageUrls = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("image").list();
  if (error) {
    throw new Error(`Error fetching storage files: ${error.message}`);
  }
  return data?.map((storageImage) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("image").getPublicUrl(storageImage.name);
    return publicUrl;
  });
};

export { listStorageImageUrls, storeImageToStorage };
