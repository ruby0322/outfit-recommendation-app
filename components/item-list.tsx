"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Series } from "@/type";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ItemCard from "./item-card";

const parseTags = (stylePreferencesString: string) => {
  return stylePreferencesString.split(",");
};

const ItemList = ({
  title,
  id,
  series,
  index,
  description,
  expandOnMount,
}: {
  title: string;
  id: string;
  series: Series[];
  index: number;
  description: string;
  expandOnMount?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(expandOnMount || false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const router = useRouter();

  return (
    <div
      id={id}
      className={cn(
        "p-4 flex flex-col gap-6 items-center",
        index !== 0 && "border-t-[1px] border-gray-800/30"
      )}
    >
      <div className='w-full flex justify-between items-center'>
        <h3 className='text-xl font-semibold text-primary'>{title}</h3>
        <Button
          variant='ghost'
          size='sm'
          className={cn("text-primary", series.length === 0 && "hidden")}
          onClick={toggleExpand}
          disabled={series.length <= 4}
          aria-expanded={isExpanded}
          aria-controls={`item-list-${id}`}
        >
          {isExpanded ? (
            <>
              收起 <ChevronUp className='ml-2 h-4 w-4' />
            </>
          ) : (
            <>
              展開 <ChevronDown className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </div>
      {description && (
        <p className='text-center italic text-gray-600 m-4'>
          {`「${description}」`}
        </p>
      )}

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {(isExpanded ? series : series.slice(0, 4)).map((s) => {
          return <ItemCard series={s} key={`item-card-${s.items[0].id}`} />;
        })}
      </div>

      {isExpanded && series.length > 4 && (
        <Button className='bg-red-400 hover:bg-red-300' onClick={toggleExpand}>
          收起列表
        </Button>
      )}
    </div>
  );
};

export default ItemList;
