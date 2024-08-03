"use client";

import { storeImageToStorage } from "@/actions/storage";
import { handleSubmission } from "@/actions/submission-handling";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";

const schema = z.object({
  clothingType: z.enum(["top", "bottom"], {
    message: "請選擇服飾類型",
  }),
  bodyType: z.enum(["slim", "average", "athletic", "curvy"], {
    message: "請選擇身型",
  }),
  height: z
    .number({ message: "身高必須是數字" })
    .min(120, "至少 120 公分")
    .max(250, "不可超過 250 公分"),
  weight: z
    .number({ message: "體重必須是數字" })
    .min(30, "至少 30 公斤")
    .max(200, "不可超過 200 公斤"),
  stylePreferences: z.array(z.string()).optional(),
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

  const onSubmit = async (data: any) => {
    console.log("data:", data);
    const reader = new FileReader();
    reader.onloadend = async () => {
      /* TODO: Store uploaded image to file storage and retrieve its filepath. */
      // const base64 = reader.result as string;
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        console.log("created base64 url:", base64);
        try {
          console.log("try to convert base64 to blob object");
          const imageUrl = await storeImageToStorage(base64);

          /* upload to file storage here */
          /* END TODO */
          console.log("public image url:", imageUrl);
          const style_preference = data.stylePreferences
            ? data.stylePreferences.join(", ")
            : null;
          console.log(style_preference);
          const recommendationId = await handleSubmission({
            clothing_type: data.clothingType,
            image_url: imageUrl,
            height: data.height,
            style_preferences: style_preference,
            user_id: USER_ID,
            max_num_suggestion: MAX_NUM_SUGGESTION,
            max_num_item: MAX_NUM_ITEM,
          });
          /* TODO: Store submission data to DB and retrieve its corresponding recommendation id. */
          // const recommendationId = "a0091a7b-5d62-4c74-8f0e-b43f686b5331";
          router.push(`/recommendation/${recommendationId}`);
        } catch (error) {
          console.error("Error in onSubmit:", error);
        }
      }
    };
    reader.readAsDataURL(data.uploadedImage[0]);
    const USER_ID: number = 90;
    const MAX_NUM_SUGGESTION: number = 3;
    const MAX_NUM_ITEM: number = 3;
  };

  return (
    <div className='w-full mt-16'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col gap-8 items-center justify-center'>
            <div className='w-full flex flex-col md:flex-row gap-8 justify-center items-center'>
              <ImageUploader />
              <CustomizationFields />
            </div>
            <Button variant='outline' type='submit'>
              一鍵成為穿搭達人！
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UploadPage;
