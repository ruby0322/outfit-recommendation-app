"use client";

import { handleImageSearch, handleTextSearch } from "@/actions/upload";
import { storeImageToStorage } from "@/actions/utils/insert";
import ItemList from "@/components/item-list";
import ItemListSkeleton from "@/components/item-list-skeleton";
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
import { LoadingButton } from "@/components/ui/loading-button";
import { Series } from "@/type";
import { SearchIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import imageCompression from 'browser-image-compression';

const schema = z.object({
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Series[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);

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
    if (!uploadedImageUrl) return;
    setLoading(true);
    const res = await handleImageSearch(
      "male",
      "gpt-4o-mini",
      uploadedImageUrl
    );
    setResults([...(res?.series as Series[])] as Series[]);
    setLoading(false);
    setQuery('');
  };

  const onSubmit = async () => {
    if (!searchInput) return;
    setLoading(true);
    const res = await handleTextSearch(searchInput, "gpt-4o-mini", "male");
    setResults([...(res?.series as Series[])] as Series[]);
    setQuery(searchInput);
    setSearchInput("");
    console.log(res?.series);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }
    setImageUploading(true);
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        try {
          const imageUrl = await storeImageToStorage(base64);
          /* TODO: Perform image search with the image uarl */
          setUploadedImageUrl(imageUrl);
          setImageUploading(false);
        } catch (error) {
          console.error("Error in onSubmit:", error);
        }
      }
    };
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      const compressedFile = await imageCompression(file, options);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-8 w-full'>
            <Input
              type='search'
              placeholder='你今天想找什麼樣的服飾呢？'
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
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                <LoadingButton
                  disabled={imageUploading}
                  loading={imageUploading}
                  onClick={handleImageUpload}
                >
                  上傳並搜尋
                </LoadingButton>
              </DialogContent>
            </Dialog>
          </div>
          <LoadingButton
            className='bg-indigo-400 hover:bg-indigo-300'
            onClick={onSubmit}
            loading={loading}
          >
            {!loading && <SearchIcon />}
          </LoadingButton>
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
      {loading ? (
        <ItemListSkeleton index={0} />
      ) : (
        <ItemList
          title=''
          description={query}
          series={results}
          id={""}
          index={0}
          expandOnMount={true}
        />
      )}
    </div>
  );
}
