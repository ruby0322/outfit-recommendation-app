"use client";

import { Card } from "@/components/ui/card";
import { RecommendationPreview } from "@/type";
import Image from 'next/image';
import Link from "next/link";

const PreviewCard = ({ preview }: { preview: RecommendationPreview }) => {
  
  return (
    <Card className='w-40 md:w-64 rounded-none flex flex-col justify-between h-fit gap-1 shadow-none border-0'>
      <div className='relative inline-block w-full h-full'>
        <div className='relative w-full h-40 md:h-64'>
          <Link
            href={`/recommendation/${preview.id}`}
          >
            <Image
              src={preview.upload.image_url as string}
              className='object-cover'
              style={{ objectFit: "cover" }}
              fill
              alt={`Uploaded Image`}
              unoptimized
            />
          </Link>
        </div>
      </div>
      <div className="flex gap-4 w-full items-center justify-center space-x-4">
        <h3 className='py-2 text-md break-words ...'>
          {`於 ${preview.upload.created_at.toLocaleDateString('zh-TW')} 上傳`}
        </h3>
      </div>
    </Card>
  );
};

export default PreviewCard;
