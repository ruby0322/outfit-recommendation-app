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
}: {
  title: string;
  id: string;
  series: Series[];
  index: number;
  description: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          className='text-primary'
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
      <p className='text-center italic text-gray-600 m-4'>「{description}」</p>
      {/* <div className='flex flex-wrap gap-2'>
        {parseTags(title).map((tag, index) => {
          return (
            <Badge
            className='bg-white'
              variant='outline'
              key={`style-preference-badge-${index}`}
            >
              {tag}
            </Badge>
          );
        })}
      </div> */}

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {(isExpanded ? series : series.slice(0, 4)).map((s) => {
          return <ItemCard series={s} key={`item-card-${s.id}`} />;
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
