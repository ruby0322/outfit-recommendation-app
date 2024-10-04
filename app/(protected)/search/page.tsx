"use client";

import { handleTextSearch } from "@/actions/upload";
import ItemList from "@/components/item-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Series } from "@/type";
import { SearchIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

export default function SearchPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Series[]>([]);

  const promptSuggestions = [
    "適合夏天的輕薄白色襯衫，材質要透氣，適合上班穿的。",
    "寬鬆的牛仔褲，藍色，有高腰設計，適合日常穿搭。",
    "適合晚宴的黑色長洋裝，帶有亮片點綴，優雅又不失華麗。",
    "適合運動的無袖T恤，要求是快速排汗的材質，最好是鮮豔的顏色。",
  ];

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchInput(suggestion);
    /* TODO: add gender input */
  };

  const handleImageUpload = async () => {
    setIsDialogOpen(false);
  };

  const onSubmit = async () => {
    const res = await handleTextSearch({
      clothingType: "top",
      query: searchInput,
      model: "gpt-4o-mini",
      gender: "male",
    });
    setResults(res?.series as Series[]);
    console.log(res?.series);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-8 w-full'>
            <Input
              type='search'
              placeholder='Search images...'
              className='w-full pl-10 pr-12'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 top-1/2 transform -translate-y-1/2'
                >
                  <UploadIcon className='h-5 w-5' />
                  <span className='sr-only'>Upload image</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>以服搜服</DialogTitle>
                  <DialogDescription>
                    看中哪件衣服？上傳照片，立即搜尋購買！
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Input
                      id='picture'
                      type='file'
                      accept='image/*'
                      className='col-span-4'
                    />
                  </div>
                </div>
                <Button onClick={handleImageUpload}>上傳並搜尋</Button>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            className='bg-indigo-400 hover:bg-indigo-300'
            onClick={onSubmit}
          >
            <SearchIcon />
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {promptSuggestions.map((suggestion, index) => (
            <Card
              key={index}
              className='bg-indigo-200/50 cursor-pointer hover:bg-indigo-200/20 transition-colors shadow-[3px_3px_0px_0px_rgba(139,92,246)] border-2 border-indigo-500'
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardContent className='p-4 h-full flex items-center justify-center text-center'>
                <p className='text-sm font-semibold'>「{suggestion}」</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {
        <ItemList
          title='搜尋到類似的商品'
          description={""}
          series={results}
          id={""}
          index={0}
        />
      }
    </div>
  );
}
