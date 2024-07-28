"use client";

import { Card } from "@/components/ui/card";
import { ItemTable } from "@/type";
import { ShoppingCart } from "lucide-react";
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
        <h3 className='p-2 text-md'>{item.title}</h3>
      )}
      <div className='flex px-2 pb-2 justify-end text-sky-300'>
        <ShoppingCart />
      </div>
    </Card>
  );
};

export default ItemCard;
