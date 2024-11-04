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
import { Gender, Series } from "@/type";
import { SearchIcon, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import imageCompression from 'browser-image-compression';
import { SlidersHorizontal } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  const [gender, setGender] = useState<Gender>('neutral');
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Series[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(""); // 顏色
  const [selectedVersion, setSelectedVersion] = useState<string>(""); // 版型
  const [selectedStyle, setSelectedStyle] = useState<string>(""); // 風格
  const [selectedType, setSelectedType] = useState<string>(""); // 款式
  const [isExpanded, setIsExpanded] = useState(false);

  const searchQueriesDescription = [
    "請給我一件寬鬆、舒適的長褲。",
    "我想要一件合身的西裝。",
    "尋找一件適合運動的T恤。",
    "給我一件風格簡約的襯衫。",
    "找一件有條紋圖案的針織毛衣。",
    "想要一件適合商務場合的黑色長褲。",
    "推薦一件適合約會的浪漫風格裙子。",
  ];
  
  const searchQueriesSituation = [
    "我今天想去野餐，請推薦給我適合戶外活動的上衣。",
    "我要去參加朋友的婚禮，請推薦一件典雅的長裙。",
    "我想找一件適合週末郊遊的輕便外套。",
    "今天我想去健身房，請給我一套運動服裝。",
    "幫我找一件適合正式場合穿的白襯衫。",
    "我需要一條適合夏日海灘穿的短褲。",
    "找一件可以搭配牛仔褲的休閒T恤。",
    "推薦一件適合寒冷天氣穿的高領毛衣。",
    "我接下來要參加會議，請推薦一件合身的黑色西裝外套。",
  ];
  
  const searchQueriesType = [
    "我想要一件街頭風格的灰色T恤。",
    "推薦一件復古風格的格子襯衫。",
    "我需要一件適合極簡風格的白色寬褲。",
    "推薦一件日系風格的寬鬆連帽外套。",
    "我想要一條適合優雅風格的高腰長褲。",
    "幫我找一件美式休閒風的連帽T恤。",
    "推薦一件法式風格的碎花裙。",
    "我需要一件工裝風格的多口袋外套。"
  ];

  const searchQueriesRand = [
    "找一件舒適的針織毛衣，適合秋冬穿搭。",
    "推薦一件高腰設計的短裙，適合夏天穿。",
    "我需要一件有蕾絲細節的白襯衫，優雅又大方。",
    "今天想去爬山，請推薦一件適合戶外活動的運動外套。",
    "我有一場重要的面試，推薦一套合適的正裝給我。",
    "週末要和朋友去逛街，請推薦一件適合的休閒連衣裙。",
    "我需要一件韓系風格的寬鬆T恤。",
    "推薦一件輕奢風格的真絲襯衫。",
  ]

  function getRandomItem(array: string[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  useEffect(() => {
    const randomDescription = getRandomItem(searchQueriesDescription);
    const randomSituation = getRandomItem(searchQueriesSituation);
    const randomType = getRandomItem(searchQueriesType);
    const randomRand = getRandomItem(searchQueriesRand);

    setPromptSuggestions([randomDescription, randomSituation, randomType, randomRand]);
  }, []);

  // const promptSuggestions = [
  //   "適合夏天的輕薄白色襯衫，材質要透氣，適合上班穿的。",
  //   "寬鬆的牛仔褲，藍色，有高腰設計，適合日常穿搭。",
  //   "適合晚宴的黑色長洋裝，帶有亮片點綴，優雅又不失華麗。",
  //   "適合運動的無袖T恤，要求是快速排汗的材質，最好是鮮豔的顏色。",
  // ];

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchInput(suggestion);
    /* TODO: add gender input */
  };

  const handleImageUpload = async () => {
    setIsDialogOpen(false);
    if (!uploadedImageUrl) return;
    setLoading(true);
    const res = await handleImageSearch(
      gender,
      "gpt-4o-mini",
      uploadedImageUrl
    );
    setResults([...(res?.series ?? [])] as Series[]);
    setLoading(false);
    setQuery('');
  };

  const onSubmit = async () => {
    if (!searchInput) return;
    setLoading(true);
    setIsExpanded(false);
    const res = await handleTextSearch(searchInput, "gpt-4o-mini", gender);
    setResults([...(res?.series as Series[])] as Series[]);
    setQuery(searchInput);
    setSearchInput("");
    // console.log(res?.series);
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

  const handleGenerateText = () => {
    const generatedText = `${selectedColor || ''} ${selectedVersion || ''} ${selectedStyle || ''} ${selectedType || ''}`;
    setSearchInput(generatedText.trim());
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-4 w-full'>
            <Input
              type='search'
              placeholder='你今天想找什麼樣的服飾呢？'
              className='w-full pl-10 pr-2'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            
            
          </div>
          <Button
            size='icon'
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn('mb-2 text-gray-700 hover:bg-gray-200 p-1', isExpanded ? 'bg-gray-200' : 'bg-transparnet')}
          >
            <SlidersHorizontal className="w-5" />
          </Button>
          
            
          <Select onValueChange={(value: Gender) => {
            setGender(value);
            console.log(value);
          }}> 
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="性別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">中性</SelectItem>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
            </SelectContent>
          </Select>
          <LoadingButton
            className='bg-indigo-400 hover:bg-indigo-300'
            onClick={onSubmit}
            loading={loading}
          >
            {!loading && <SearchIcon />}
          </LoadingButton>
        </div>

        {isExpanded && (
        <div className="bg-gray-100 p-2 rounded-md">
          <div className="flex gap-2 items-center justify-begin">
            <Select onValueChange={(value: string) => {
              setSelectedColor(value);
              setSearchInput(`${value} ${selectedVersion} ${selectedStyle} ${selectedType}`.trim());
            }}> 
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="顏色" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="黑色">黑色</SelectItem>
              <SelectItem value="白色">白色</SelectItem>
              <SelectItem value="灰色">灰色</SelectItem>
              <SelectItem value="紅色">紅色</SelectItem>
              <SelectItem value="橘色">橘色</SelectItem>
              <SelectItem value="黃色">黃色</SelectItem>
              <SelectItem value="綠色">綠色</SelectItem>
              <SelectItem value="藍色">藍色</SelectItem>
              <SelectItem value="紫色">紫色</SelectItem>
              <SelectItem value="粉色">粉色</SelectItem>
              <SelectItem value="棕色">棕色</SelectItem>
                {/* Add more colors as needed */}
              </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => {
              setSelectedVersion(value);
              setSearchInput(`${selectedColor} ${value} ${selectedStyle} ${selectedType}`.trim());
            }}> 
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="版型" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="短袖">短袖</SelectItem>
              <SelectItem value="長袖">長袖</SelectItem>
              <SelectItem value="短褲">短褲</SelectItem>
              <SelectItem value="長褲">長褲</SelectItem>
              <SelectItem value="短裙">短裙</SelectItem>
              <SelectItem value="長裙">長裙</SelectItem>
                {/* Add more options as needed */}
              </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => {
              setSelectedStyle(value);
              setSearchInput(`${selectedColor} ${selectedVersion} ${value} ${selectedType}`.trim());
            }}> 
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="款式" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="T恤">T恤</SelectItem>
              <SelectItem value="帽T">帽T</SelectItem>
              <SelectItem value="襯衫">襯衫</SelectItem>
              <SelectItem value="針織衫">針織衫</SelectItem>
              <SelectItem value="毛衣">毛衣</SelectItem>
              <SelectItem value="牛仔">牛仔</SelectItem>
                {/* Add more styles as needed */}
              </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => {
              setSelectedType(value);
              setSearchInput(`${selectedColor} ${selectedVersion} ${selectedStyle} ${value}`.trim());
            }}> 
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="風格" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="極簡">極簡</SelectItem>
              <SelectItem value="街頭">街頭</SelectItem>
              <SelectItem value="復古">復古</SelectItem>
              <SelectItem value="工裝">工裝</SelectItem>
              <SelectItem value="優雅">優雅</SelectItem>
              <SelectItem value="日系">日系</SelectItem>
              <SelectItem value="韓系">韓系</SelectItem>
              <SelectItem value="美式">美式</SelectItem>
              <SelectItem value="法式">法式</SelectItem>
                {/* Add more types as needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4'>
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
