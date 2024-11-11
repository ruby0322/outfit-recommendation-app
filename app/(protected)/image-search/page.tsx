"use client";

import { handleImageSearch } from "@/actions/upload";
import { storeImageToStorage } from "@/actions/utils/insert";
import TourButton from '@/components/tour-button';
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from 'browser-image-compression';
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";
import Skeleton from "./skeleton";
import { Gender, Series } from "@/type";
import ItemListSkeleton from "@/components/item-list-skeleton";
import ItemList from "@/components/item-list";
import PaginationBar from "@/components/pagination-bar";


const schema = z.object({
  // clothingType: z.enum(["top", "bottom"], {
  //   message: "請選擇服飾類型",
  // }),
  gender: z.enum(["male", "female"], { message: "請選擇性別" }),
  // model: z.string().default("gpt-4o"),
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

// ProgressBar Component
const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return <Progress value={progress} className='w-full rounded-none h-4' />;
};

// ImageUpload Component
const ImageUpload = ({ onImageUpload }: { onImageUpload: () => void }) => {
  
  return (
    <div id='image-uploader' className='w-full flex-1 flex flex-col gap-4 items-center justify-center h-auto'>
      <div className="w-full flex text-gray-600 items-center justify-start gap-2">
        <h1 className='text-start text-2xl'>
          ➊ 照片上傳
        </h1>
        {/* <TourButton tourName='recommendation' /> */}
      </div>
      <ImageUploader onImageUpload={onImageUpload} />
    </div>
  );
};

// FormFields Component
const FormFields = ({ nextStep }: { nextStep: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { getValues } = useFormContext();

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    if (Object.keys(values).every((key) => values[key])) {
      nextStep();
    } else {
      setErrorMessage("請輸入必要欄位");
    }
  };

  return (
    <div id='form-fields' className='flex-1 flex gap-4 flex-col items-center justify-center h-auto'>
      <h1 className='w-full text-start text-2xl text-gray-600'>➋ 基本資訊</h1>
      <CustomizationFields />
      <motion.button
        className='bg-indigo-400 hover:bg-indigo-300 font-bold w-full text-white py-2 rounded-md'
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        下一步
      </motion.button>
      <p className='text-red-400 text-sm'>{errorMessage}</p>
    </div>
  );
};

const toHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

// Overview Component
const Overview = ({
  onConfirm,
  loading,
  isConfirmed
}: {
  onConfirm?: () => void;
  loading: boolean;
  isConfirmed: boolean;
}) => {
  const { getValues } = useFormContext();
  const formData = getValues();
  // console.log(formData.uploadedImage[0]);
  return (
    <div id='overview' className='flex-1 flex flex-col items-center justify-center h-auto gap-4'>
      <h1 className='w-full text-start text-2xl text-gray-600'>➌ 確認上傳</h1>
      <div>
        <Image
          src={formData.uploadedImage ? URL.createObjectURL(formData.uploadedImage[0]) : 'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660'}
          alt='Uploaded'
          className='w-80 h-80 object-cover rounded-lg mb-4'
          width={128}
          height={128}
        />
        <div className='flex'>
          <div className='flex flex-row w-full items-center gap-4'>
            <Badge className='bg-indigo-300 hover:bg-indigo-300'>性別</Badge>
            <p>{formData.gender === "male" ? "男性 🙋‍♂️" : "女性 🙋‍♀️"}</p>
          </div>
          {/* <div className='flex flex-row w-full items-center gap-4'>
            <Badge className='bg-indigo-300 hover:bg-indigo-300'>類別</Badge>
            <p>{formData.clothingType === "top" ? "上衣 👕" : "下身 👖"}</p>
          </div> */}
        </div>
      </div>
      <ConfirmButton isConfirmed={isConfirmed}/>
    </div>
  );
};

// function ConfirmButton() {
//   const router = useRouter();
//   const [secondsSpent, setSecondsSpent] = useState<number>(0);
//   return (
//     <motion.button
//       whileTap={{ scale: 0.95 }}
//       type='submit'
//       className='w-full text-white font-bold rounded-lg bg-indigo-400'
//     >
//       <LoadingButton
//         className={cn(
//           "transition-opacity duration-300 w-full px-8 py-2 rounded-md",
//           secondsSpent > 0
//             ? "bg-red-400 hover:bg-red-300"
//             : "bg-indigo-400 hover:bg-indigo-300"
//         )}
//         // onClick={() => {
//         //   if (secondsSpent > 0) {
//         //     window.location.reload();
//         //     router.push('/image-search?step=1')
//         //   } else {
//         //     setInterval(() => {
//         //       setSecondsSpent((s) => s + 1);
//         //     }, 1000);
//         //   }
//         // }}
//         loading={secondsSpent > 0}
//         disabled={false}
//       >
//         {secondsSpent > 0
//           ? `終止並退出`
//           : "一鍵尋找類似的服飾！"}
//       </LoadingButton>
//     </motion.button>
//   );
// }
function ConfirmButton({ isConfirmed }: { isConfirmed: boolean }) {
  const router = useRouter();
  const [secondsSpent, setSecondsSpent] = useState<number>(0);
  console.log('isConfirmed', isConfirmed);
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className='w-full text-white font-bold rounded-lg bg-indigo-400'
    >
      <LoadingButton
        className={cn(
          "transition-opacity duration-300 w-full px-8 py-2 rounded-md",
          isConfirmed
          ? "bg-red-400 hover:bg-red-300"
          : "bg-indigo-400 hover:bg-indigo-300"
        )}
        {...{ type: isConfirmed ? 'button' : 'submit'}}
        onClick={async () => {
          if (secondsSpent > 0) {
            router.push('/image-search?step=1');
          } else {
            setInterval(() => {
              setSecondsSpent((s) => s + 1);
            }, 1000);
          }
        }}
        loading={secondsSpent > 0}
        disabled={false}
      >
        {secondsSpent > 0
          ? `終止並退出`
          : "一鍵尋找類似的服飾！"}
      </LoadingButton>
    </motion.div>
  );
}


// ConfirmationAnimation Component
const ConfirmationAnimation = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
      <CheckCircle size={64} className='text-green-500 animate-bounce' />
    </div>
  );
};

// Main Component
export default function UploadPage() {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') as string) || 1;
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  // const [currentStep, setCurrentStep] = useState<number>(currentStep ? parseInt(currentStep) : 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);


  const [results, setResults] = useState<Series[]>([]);
  const [image, setImage] = useState<string>("");
  const [gender, setGender] = useState<string>("neutral");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (!image) {
      router.push('/image-search');
    }
  }, []);

  const setCurrentStep = (step: number) => {
    router.push(`/image-search?step=${step}`);
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = useCallback(() => {
    setIsLoading(true);
    setCurrentStep(2);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFormSubmission = async () => {
    setCurrentStep(3);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleConfirm = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConfirmed(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(">> submit");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const supabase = createClient();
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        try {
          const imageUrl = await storeImageToStorage(base64);
          setImage(imageUrl);
          setGender(data.gender)
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const res = await handleImageSearch(
            data.gender,
            "gpt-4o-mini",
            imageUrl,
            1
          );
          setCurrentStep(4);
          setResults([...(res?.series ?? [])] as Series[]);
          setTotalPages(res?.totalPages as number);
          setLoading(false)
        } catch (error) {
          console.error("Error in onSubmit:", error);
        }
      }
    };

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      const compressedFile = await imageCompression(data.uploadedImage[0], options);
      reader.readAsDataURL(compressedFile);
  
    } catch (error) {
      console.log(error);
    }
    
    const NUM_MAX_SUGGESTION: number = 3;
    const NUM_MAX_ITEM: number = 10;
  };

  if (isConfirmed) {
    return <ConfirmationAnimation />;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  if(currentStep <= 3){
    return (
      <div className='relative w-full h-screen flex flex-col items-center justify-center'>
        <div className='w-full flex-1 h-auto flex flex-col items-center justify-center gap-4'>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {currentStep > 1 && (
                <div
                  onClick={prevStep}
                  className='text-sm font-bold mb-2 flex items-center text-gray-600 cursor-pointer'
                >
                  <ChevronLeft className='w-4 h-4' /> 上一步
                </div>
              )}
              {currentStep === 1 && (
                <div className="flex flex-col gap-4">
                  
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
              )}
              {currentStep === 2 && <FormFields nextStep={nextStep} />}
              {currentStep === 3 && (
                <Overview loading={loading} isConfirmed={isConfirmed}/>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    )
  }else {
    return (
      <div className='w-full flex flex-col items-center justify-center'>
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <h2 className='text-lg text-muted-foreground'>
            您上傳的服飾
          </h2>
          <div className='rounded-sm max-w-[92vw] m-0 px-4 flex flex-col items-center justify-center gap-4 border-0 shadow-none py-4'>
            <Image
              src={image}
              alt="上傳的照片"
              className="w-60 h-60 object-cover rounded-lg"
              width={256}
              height={256}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 justify-center items-center md:max-w-[80vw]'>
        {loading ? (
            <ItemListSkeleton index={0} />
          ) : (
            <div className='flex flex-col gap-4 justify-center items-center md:max-w-[80vw]'>
              <ItemList
                title='搜尋結果'
                description={""}
                series={results}
                id={""}
                index={0}
                expandOnMount={true} expandable={false} />
            </div>
          )}
        </div>
      </div>
      
    )
  }
}