"use client";

import { Card } from "@/components/ui/card";
import { Series } from "@/type";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


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
import { Badge } from "./ui/badge";

const PROVIDER_CLASSNAME_MAPPING: { [k: string]: string } = {
  'UNIQLO': 'bg-blue-100 hover:bg-blue-100 text-gray-800',
  'Fifty Percent': 'bg-rose-100 hover:bg-rose-100 text-gray-800',
  'H&M': 'bg-violet-100 hover:bg-violet-100 text-vigray-800'
};  

const ItemCard = ({ series }: { series: Series }) => {
  
  return (
    <Card className='w-64 rounded-none flex flex-col justify-between h-fit gap-1 shadow-none border-0'>
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
              <CarouselMainContainer className='h-full w-full'>
                {series.items.map((item, index) => (
                  <SliderMainItem key={item.id} className='bg-transparent'>
                    <div className='relative w-full h-64'>
                      <Image
                        src={item.image_url as string}
                        className='object-cover'
                        style={{objectFit:"cover"}}
                        fill
                        alt={`Image of product "${item.title}" ${index}`}
                        unoptimized
                      />
                    </div>
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
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
          <div className='relative w-full h-64'>
            <Image
              src={series.items[0].image_url as string}
              className='object-cover'
              style={{objectFit:"cover"}}
              fill
              alt={`Image of product "${series.items[0].title}" 0`}
              unoptimized
            />
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
          <Heart className='text-rose-300' />
          <ShoppingCart className='text-sky-300' />
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
