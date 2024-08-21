"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ItemTable } from "@/type";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({ item }: { item: ItemTable }) => {
  // console.log("This is the item image url: ");
  // console.log(item.image_url);
  return (
    <Card className='w-64 rounded-none flex flex-col justify-between h-full gap-1 shadow-none border-0'>
      <div className='relative inline-block'>
        <Badge className='bg-muted text-muted-foreground border-0 shadow-none absolute top-0 left-0 m-2'>
          {item.provider}
        </Badge>
        <Image
          src={item.image_url as string}
          width={256}
          height={256}
          className='object-cover'
          alt={`Image of product "${item.title}"`}
        />
      </div>
      <Link href={item.external_link ? item.external_link : "#"}>
        <h3 className='py-2 text-md underline break-words ...'>{item.title}</h3>
      </Link>
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
