"use client";

import { Card } from "@/components/ui/card";
import { Series } from "@/type";
import { EllipsisVertical, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


import { handleFavorite } from "@/actions/favorite";
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from "@/components/ui/extension/carousel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

const PROVIDER_CLASSNAME_MAPPING: { [k: string]: string } = {
  'UNIQLO': 'bg-blue-100 hover:bg-blue-100 text-gray-800',
  'Fifty Percent': 'bg-rose-100 hover:bg-rose-100 text-gray-800',
  'H&M': 'bg-violet-100 hover:bg-violet-100 text-vigray-800'
};  

const ItemCard = ({ series, userId }: { series: Series, userId?: string }) => {

  const [isFavorite, setIsFavorite] = useState<boolean>(series.isFavorite);

  const toggleFavorite = async () => {
    if (!userId) return;
    setIsFavorite(!isFavorite);
    await handleFavorite(userId, series.items[0].id);
  }
  
  return (
    <Card className='w-40 md:w-64 rounded-none flex flex-col justify-between h-fit gap-1 shadow-none border-0'>
      <div className='relative inline-block w-full h-full'>
        {
          series.items.length > 0 &&
          <Badge className={cn(
            'border-0 shadow-none absolute top-0 left-0 m-2 z-10',
            PROVIDER_CLASSNAME_MAPPING[series.items[0].provider as string]
          )}>
            {series.items[0].provider}
          </Badge>
        }
        {series.items.length > 1 ? (
          <Carousel>
            <CarouselNext />
            <CarouselPrevious />
            <div className='relative w-full'>
              <Link
                target="_blank"
                href={
                  series.items[0].external_link ? series.items[0].external_link : "#"
                }
              >
                <CarouselMainContainer className='h-full w-full'>
                  {series.items.map((item, index) => (
                    <SliderMainItem key={item.id} className='bg-transparent'>
                      <div className='relative w-full h-40 md:h-64'>
                        <Image
                          src={item.image_url as string}
                          className='object-cover'
                          style={{ objectFit: "cover" }}
                          fill
                          alt={`Image of product "${item.title}" ${index}`}
                          unoptimized
                        />
                      </div>
                    </SliderMainItem>
                  ))}
                </CarouselMainContainer>
              </Link>
              <div className='relative w-full bottom-2 left-1/2 -translate-x-1/2'>
                <CarouselThumbsContainer className='gap-x-1 w-full'>
                  {series.items.map((_, index) => (
                    <CarouselIndicator
                      key={index}
                      index={index}
                    />
                  ))}
                </CarouselThumbsContainer>
              </div>
            </div>
          </Carousel>
        ) : (
          <div className='relative w-full h-40 md:h-64'>
            <Link
              target="_blank"
              href={
                series.items[0].external_link ? series.items[0].external_link : "#"
              }
            >
              <Image
                src={series.items[0].image_url as string}
                className='object-cover'
                style={{ objectFit: "cover" }}
                fill
                alt={`Image of product "${series.items[0].title}" 0`}
                unoptimized
              />
            </Link>
          </div>
        )}
      </div>
      <Link
        target="_blank"
        href={
          series.items[0].external_link ? series.items[0].external_link : "#"
        }
      >
        <h3 className='py-2 text-md underline break-words ...'>
          {series.items[0].title}
        </h3>
      </Link>
      <div className='pb-2 flex justify-between'>
        <p>NTD {series.items[0].price as number}</p>
        <div className='flex justify-end gap-1'>
          <motion.button>
            <Heart onClick={toggleFavorite} className='text-rose-300 cursor-pointer' {...(isFavorite ? { fill: '#fca5a5' } : { })} />
          </motion.button>
          <EllipsisVertical className='text-indigo-300 cursor-pointer' />
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
