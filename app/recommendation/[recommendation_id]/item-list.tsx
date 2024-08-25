"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Series } from "@/type";
import { useRouter } from "next/navigation";
import ItemCard from "./item-card";

const parseTags = (stylePreferencesString: string) => {
  return stylePreferencesString.split(",");
};

const ItemList = ({
  title,
  id,
  series,
  index,
}: {
  title: string;
  id: string;
  series: Series[];
  index: number;
}) => {
  const router = useRouter();

  const seeMore = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("see_more", id);
    currentUrl.hash = id;
    router.push(currentUrl.toString());
  };

  const back = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("see_more");
    currentUrl.hash = "";
    router.push(currentUrl.toString());
  };

  return (
    <div
      id={id}
      className={cn(
        "p-4 flex flex-col gap-6 items-center",
        index !== 0 && index !== -1 && "border-t-[1px] border-gray-800/30"
      )}
    >
      {/* <h3 className='text-xl font-semibold text-muted-foreground'>{title}</h3> */}
      {index === -1 && (
        <div className='w-full flex justify-start'>
          <span
            onClick={back}
            className=' text-sm text-semibold underline text-blue-400 cursor-pointer'
          >
            回上頁
          </span>
        </div>
      )}
      {index !== -1 && (
        <div className='w-full flex justify-end'>
          <span
            onClick={seeMore}
            className=' text-sm text-semibold underline text-blue-400 cursor-pointer'
          >
            查看更多
          </span>
        </div>
      )}
      <div className='flex flex-wrap gap-2'>
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
      </div>

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {series.map((s) => {
          return <ItemCard series={s} key={`item-card-${s.id}`} />;
        })}
      </div>
    </div>
  );
};

export default ItemList;
