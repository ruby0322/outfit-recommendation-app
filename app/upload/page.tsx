"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";

const schema = z.object({
  clothingType: z.enum(["upper", "lower"], {
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
  uploadedImage: z
    .instanceof(FileList, { message: "請上傳圖片" })
    .refine((files) => files.length > 0, "請上傳圖片"),
});

type FormData = z.infer<typeof schema>;

const UploadPage = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    /* TODO: Store uploaded image to file storage, and store submission to DB and retrieve its corresponding recommendation id. */
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      /* upload to file storage here */
    };
    reader.readAsDataURL(data.uploadedImage[0]);
    /* END TODO */
    const recommendationId = "example-recommendation-id";
    router.push(`/recommendation/${recommendationId}`);
  };

  return (
    <div className='w-full'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col gap-8 items-center justify-center'>
            <div className='w-full flex gap-8 justify-center items-center'>
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
