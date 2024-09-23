"use client";

import { handleSubmission } from "@/actions/upload";
import { storeImageToStorage } from "@/actions/utils/insert";
import { LoadingButton } from "@/components/ui/loading-button";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";

const schema = z.object({
  clothingType: z.enum(["top", "bottom"], {
    message: "請選擇服飾類型",
  }),
  // bodyType: z.enum(["slim", "average", "athletic", "curvy"], {
  //   message: "請選擇身型",
  // }),
  gender: z.enum(["male", "female"], { message: "請選擇性別" }),
  // height: z
  //   .number({ message: "身高必須是數字" })
  //   .min(120, "至少 120 公分")
  //   .max(250, "不可超過 250 公分"),
  // weight: z
  //   .number({ message: "體重必須是數字" })
  //   .min(30, "至少 30 公斤")
  //   .max(200, "不可超過 200 公斤"),
  // stylePreferences: z.array(z.string()).optional(),
  model: z.string().default("gpt-4o"),
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

type FormData = z.infer<typeof schema>;

const UploadPage = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    // console.log("data:", data);
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const supabase = createClient();
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        try {
          const imageUrl = await storeImageToStorage(base64);
          // console.log("public image url:", imageUrl);
          const style_preference = data.stylePreferences
            ? data.stylePreferences.join(", ")
            : null;
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const recommendationId = await handleSubmission({
            clothingType: data.clothingType,
            imageUrl: imageUrl,
            gender: data.gender,
            model: data.model,
            userId: user?.id as string,
            numMaxSuggestion: NUM_MAX_SUGGESTION,
            numMaxItem: NUM_MAX_ITEM,
          });
          router.push(`/recommendation/${recommendationId}`);
        } catch (error) {
          console.error("Error in onSubmit:", error);
        }
      }
    };
    reader.readAsDataURL(data.uploadedImage[0]);
    const USER_ID: string = "8a6e0804-2bd0-4672-b79d-d97027f9071a";
    const NUM_MAX_SUGGESTION: number = 3;
    const NUM_MAX_ITEM: number = 10;
  };

  return (
    <div className='w-full mt-16'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col gap-8 items-center justify-center'>
            <div className='w-full flex flex-col md:flex-row gap-8 justify-center items-center'>
              <div className='flex flex-col items-center gap-4'>
                <ImageUploader />
              </div>
              <CustomizationFields />
            </div>
            <LoadingButton variant='outline' loading={loading} type='submit'>
              一鍵成為穿搭達人！
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UploadPage;
