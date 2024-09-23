"use client";

import { Badge } from "@/components/ui/badge";
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

const ItemCard = ({ series }: { series: Series }) => {
  // console.log("This is the item image url: ");
  // console.log(item.image_url);
  return (
    <Card className='w-64 rounded-none flex flex-col justify-between h-fit gap-1 shadow-none border-0'>
      <div className='relative inline-block w-full h-full'>
        <Badge className='bg-muted text-muted-foreground border-0 shadow-none absolute top-0 left-0 m-2'>
          {series.provider}
        </Badge>
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
                        src={item.image_url}
                        className='object-cover'
                        objectFit='cover'
                        layout='fill'
                        alt={`Image of product "${series.title}" ${index}`}
                      />
                    </div>
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <div className='absolute bottom-2 left-1/2 -translate-x-1/2'>
                <CarouselThumbsContainer className='gap-x-1'>
                  {series.items.map((_, index) => (
                    <CarouselIndicator key={index} index={index} />
                  ))}
                </CarouselThumbsContainer>
              </div>
            </div>
          </Carousel>
        ) : (
          <div className='relative w-full h-64'>
            <Image
              src={series.items[0].image_url}
              className='object-cover'
              objectFit='cover'
              layout='fill'
              alt={`Image of product "${series.title}" 0`}
            />
          </div>
        )}
      </div>
      <Link href={series.external_link ? series.external_link : "#"}>
        <h3 className='py-2 text-md underline break-words ...'>
          {series.title}
        </h3>
      </Link>
      <div className='px-2 pb-2 flex justify-between'>
        <p>{series.price}</p>
        <div className='flex justify-end gap-1'>
          <Heart className='text-rose-300' />
          <ShoppingCart className='text-sky-300' />
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
