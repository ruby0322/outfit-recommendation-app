"use client";
import { Upload } from "lucide-react";

const PictureUploader = () => {
  /* TODO: Picture Uploader */
  const handleUpload = async () => {
    /* TODO: Upload Handler */
  };
  return (
    <div
      onClick={handleUpload}
      className='cursor-pointer w-64 h-64 border-2 flex items-center justify-center'
    >
      <Upload className='w-12 h-12 text-gray-300' />
    </div>
  );
};

export default PictureUploader;
