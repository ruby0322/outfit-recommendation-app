"use client";

import { handleImageSearch, handleTextSearch } from "@/actions/upload";
import { storeImageToStorage } from "@/actions/utils/insert";
import ItemList from "@/components/item-list";
import ItemListSkeleton from "@/components/item-list-skeleton";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Gender, Series } from "@/type";
import { SearchIcon, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import imageCompression from 'browser-image-compression';
import ImageUploader from "../upload/image-uploader";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const schema = z.object({
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

export default function ImageSearch() {
  const [gender, setGender] = useState<Gender>('neutral');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Series[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);


  const handleImageUpload = async () => {
    if (!uploadedImageUrl) return;
    setLoading(true);
    const res = await handleImageSearch(
      gender,
      "gpt-4o-mini",
      uploadedImageUrl
    );
    setResults([...(res?.series ?? [])] as Series[]);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }
    setImageUploading(true);
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        try {
          const imageUrl = await storeImageToStorage(base64);
          /* TODO: Perform image search with the image uarl */
          setUploadedImageUrl(imageUrl);
          setImageUploading(false);
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
      const compressedFile = await imageCompression(file, options);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-8 w-full'>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Input
                  id='picture'
                  type='file'
                  accept='image/*'
                  className='col-span-4'
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            {/* <Select onValueChange={(value: Gender) => {
            setGender(value);
            console.log(value);
          }}> 
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="性別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">中性</SelectItem>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
            </SelectContent>
          </Select> */}
          <div className='flex items-center gap-4 pl-2'>
            <label htmlFor='gender'>我想搜尋的服飾性別為</label>
            <div className='flex gap-2'>
              <label
                htmlFor='gender-neutral'
                className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                  gender === "neutral" ? "bg-indigo-300" : ""
                }`}
              >
                <input
                  id='gender-neutral'
                  type='radio'
                  value='neutral'
                  checked={gender === "neutral"}
                  onChange={() => setGender("neutral")}
                  className='hidden'
                />
                中性
              </label>
              <label
                htmlFor='gender-male'
                className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                  gender === "male" ? "bg-indigo-300" : ""
                }`}
              >
                <input
                  id='gender-male'
                  type='radio'
                  value='male'
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className='hidden'
                />
                男性
              </label>
              <label
                htmlFor='gender-female'
                className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                  gender === "female" ? "bg-indigo-300" : ""
                }`}
              >
                <input
                  id='gender-female'
                  type='radio'
                  value='female'
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className='hidden'
                />
                女性
              </label>
            </div>
          </div>
          
          </div>
          <div className="flex py-4">
          {/* <LoadingButton
              disabled={imageUploading}
              loading={imageUploading}
              onClick={handleImageUpload}
            >
              上傳並搜尋
            </LoadingButton> */}
            <LoadingButton
              className='bg-indigo-400 hover:bg-indigo-300'
              disabled={imageUploading}
              loading={loading}
              onClick={handleImageUpload}
            >
              {!loading && <SearchIcon />}
            </LoadingButton>
          </div>
        </div>


      </div>
      {loading ? (
        <ItemListSkeleton index={0} />
      ) : (
        <ItemList
          title=''
          description={""}
          series={results}
          id={""}
          index={0}
          expandOnMount={true}
        />
      )}
    </div>
  );
}
