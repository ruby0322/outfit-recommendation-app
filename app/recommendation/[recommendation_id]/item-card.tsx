"use client";

import { Card } from "@/components/ui/card";
import { ItemTable } from "@/type";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({ item }: { item: ItemTable }) => {
  return (
    <Card className='cursor-pointer overflow-hidden rounded-none flex flex-col gap-1 shadow-none border-0'>
      <Image
        src={item.image_url as string}
        width={256}
        height={256}
        className='object-cover'
        alt={`Image of product "${item.title}"`}
      />
      {item.external_link ? (
        <Link href={item.external_link}>
          <h3 className='p-2 text-md'>{item.title}</h3>
        </Link>
      ) : (
        <h3 className='p-2 text-md underline'>{item.title}</h3>
      )}
      <div className='px-2 pb-2 flex justify-between'>
        <p>NTD {item.price}</p>
        <div className='flex justify-end gap-1'>
          <Heart className='text-rose-300' />
          <ShoppingCart className='text-sky-300' />
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
