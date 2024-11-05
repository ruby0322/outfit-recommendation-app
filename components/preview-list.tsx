"use client";

import { cn } from "@/lib/utils";
import { RecommendationPreview } from "@/type";
import { useRouter } from "next/navigation";
import PreviewCard from "./preview-card";


const PreviewList = ({
  title,
  id,
  previews,
  index,
  description,
}: {
  title: string;
  id: string;
  previews: RecommendationPreview[];
  index: number;
  description: string;
}) => {
  const router = useRouter();

  return (
    <div
      id={id}
      className={cn(
        "px-4 flex flex-col gap-6 items-center pt-6",
        index !== 0 && "border-t-[1px] border-gray-800/30"
      )}
    >
      <h3 className='text-2xl font-semibold text-primary border-b-2 border-indigo-400'>{title}</h3>
      {description && (
        <p className='text-center italic text-gray-600 m-4'>
          {`「${description}」`}
        </p>
      )}

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {previews.map((p) => {
          return <PreviewCard preview={p} key={`preview-card-${p.id}`} />;
        })}
      </div>
    </div>
  );
};

export default PreviewList;
