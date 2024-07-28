"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

const ImageUploader = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setValue("uploadedImage", files);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <div
        onClick={handleFileClick}
        className='cursor-pointer w-80 h-80 border-2 flex items-center justify-center relative'
      >
        {preview ? (
          <Image
            src={preview}
            alt='Uploaded Image'
            layout='fill'
            objectFit='cover'
          />
        ) : (
          <Upload className='w-12 h-12 text-gray-300' />
        )}
        <input
          {...register("uploadedImage")}
          ref={fileInputRef}
          id='uploadedImage'
          className='hidden'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>
      {errors.uploadedImage && (
        <span className='text-red-600'>
          {errors.uploadedImage.message?.toString()}
        </span>
      )}
    </div>
  );
};

export default ImageUploader;
