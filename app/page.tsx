"use client";

import AnimatedTextCharacter from "@/components/animated-text-character";
import FeatureCard from "@/components/feature-card";
import AssetSelection from "@/components/illustrations/asset-selection";
import People from "@/components/illustrations/people";
import SearchEngine from "@/components/illustrations/search-engine";
import WindowShopping from "@/components/illustrations/window-shopping";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Upload, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import ResultWindow from "./result-window";

const HeroSection = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/upload"); // Navigate to the /upload route
  };
  return (
    <section className='md:h-[80vh] h-fit py-32 text-gray-800 relative flex md:flex-row flex-col-reverse  items-center justify-center bg-cover bg-center md:gap-24 gap-8 px-10'>
      <div className='relative z-10 md:text-start text-center'>
        <h1 className='flex text-2xl md:text-4xl font-bold mb-4 animate-fade-in-up'>
          <AnimatedTextCharacter text='輕鬆找到屬於你的' />
          <motion.span
            initial={{ x: 200, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            className='animate-[pulse_0.8s_ease-out_infinite] bg-gradient-to-r from-indigo-200 to-indigo-500 bg-clip-text text-transparent'
          >
            時尚風格
          </motion.span>
        </h1>
        <AnimatedTextCharacter
          className='border-l-4 border-black md:pl-4 pl-2 text-sm md:text-lg mb-16 max-w-3xl mx-auto animate-fade-in-up animation-delay-300'
          text='一鍵找到最適合您的穿搭靈感'
        />
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }}>
          <Button
            size='lg'
            className='bg-indigo-200 hover:bg-indigo-200/80 text-white animate-fade-in-up animation-delay-600 shadow-[3px_3px_0px_0px_rgba(139,92,246)] border-2 border-indigo-500'
            onClick={handleClick}
          >
            <WandSparkles className='text-indigo-600 mr-2 h-4 w-4' />
            <p className='text-indigo-600'>手刀進入，解鎖你的風格！</p>
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <People className='md:w-[30rem] w-[15rem]' />
      </motion.div>
    </section>
  );
};

const OverviewSection = () => {
  return (
    <section className='px-10 flex flex-col gap-12 items-center justify-content bg-indigo-400 py-16'>
      <div className='text-center'>
        <h2 className='animate-pulse text-3xl font-bold mb-12 text-white'>
          時尚。簡單。精準。
        </h2>
        <p className='italic text-white max-w-[30rem] '>
          結合自然語言處理和圖像識別技術，我們專為追求時尚、簡單又精準的您而生！只要一張圖片或一句白話描述，我們就能魔法般地為您鎖定全球知名品牌中最適合您的那一件。不管是日常出行還是特殊場合，讓我們幫您一把，輕鬆展現您的個人風采！
        </p>
      </div>
      <div className='flex md:flex-row flex-col items-center justify-center md:gap-16 gap-10 w-full'>
        {FEATURES.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

const images = [
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-750cc231-23d4-436a-a085-7286e0fdeed3?t=2024-09-25T17%3A20%3A26.729Z",
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-73bd431f-c7b5-41e1-8c23-2843057755bb",
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-6e09494f-9e76-4d52-96c9-dfac2f0b460a",
];

const RecommendationSection = () => {
  const [droppedImage, setDroppedImage] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const handleImageDrop = (imgUrl: string) => {
    setDroppedImage(imgUrl);
    setTimeout(() => {
      setLoaded(true);
    }, 1200);
  };
  return (
    <section className='px-10 py-16 bg-gray-50'>
      <div className='w-full flex md:px-[5rem] md:flex-row flex-col md:items-start items-center justify-center gap-32 mx-auto px-4'>
        <div className='text-start w-fit'>
          <h2 className='text-3xl font-bold mb-4'>穿搭建議</h2>
          <span className='w-full text-gray-600'>
            受夠買衣服一直問店員、跑試衣間了嗎？
            <br />
            沒關係，交給「穿搭推薦」來幫你搞定！
            <br />
            依場合需求，為你量身打造最讚穿搭。
            <br />
            無論是休閒、正式，還是潮流穿搭，
            <br />
            我們都能推薦最適合的風格與單品，
            <br />
            從此穿搭不再煩惱，每天都有新靈感！
          </span>
        </div>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          {!loaded && (
            <DragAndDropImageUploaderMock
              droppedImage={droppedImage}
              handleImageDrop={handleImageDrop}
            />
          )}

          {loaded && (
            <ResultWindow
              close={() => {
                setDroppedImage(null);
                setLoaded(false);
              }}
              index={
                droppedImage ? (images.indexOf(droppedImage) as 0 | 1 | 2) : 0
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

function DragAndDropImageUploaderMock({
  droppedImage,
  handleImageDrop,
}: {
  droppedImage: string | null;
  handleImageDrop: (x: string) => void;
}) {
  const draggedImageRef = useRef<string | null>(null);
  const constraintsRef = useRef(null);

  const handleDragStart =
    (src: string) => (event: MouseEvent | TouchEvent | PointerEvent) => {
      draggedImageRef.current = src;
      // We can't use dataTransfer here because it's not available on PointerEvent
      // Instead, we'll use our ref to store the dragged image source
    };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // Check if the drag ended over the drop zone
    const dropZone = document.getElementById("drop-zone");
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const { clientX, clientY } =
        event instanceof MouseEvent
          ? event
          : (event as unknown as PointerEvent);
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        // The drag ended over the drop zone
        if (draggedImageRef.current) {
          handleImageDrop(draggedImageRef.current);
        }
      }
    }
    draggedImageRef.current = null;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedImageSrc = event.dataTransfer.getData("text/plain");
    if (droppedImageSrc) {
      handleImageDrop(droppedImageSrc);
    }
  };

  return (
    <div className='flex flex-col items-center md:flex-row gap-8'>
      <div
        ref={constraintsRef}
        className='flex flex-row md:flex-col items-center justify-center space-y-4'
      >
        {images.map((src, index) => {
          return (
            <motion.div
              drag
              dragElastic={0.5}
              key={index}
              dragConstraints={constraintsRef}
              onDragStart={handleDragStart(src)}
              onDragEnd={handleDragEnd}
              className='cursor-grab active:cursor-grabbing'
            >
              <motion.img
                src={src}
                alt={`Draggable image ${index + 1}`}
                draggable='false'
                className={cn(
                  "w-24 h-24 rounded-lg shadow-md",
                  droppedImage === src && "hidden",
                  droppedImage && "opacity-50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        id='drop-zone'
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className='w-[20rem] h-[20rem] max-w-[75vw] flex flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 overflow-hidden border-2 border-gray-300 border-dashed'
      >
        {droppedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className=''
          >
            <Image
              src={droppedImage}
              alt='Dropped image'
              width='256'
              height='256'
              objectFit='cover'
              className='w-full animate-pulse'
            />
          </motion.div>
        ) : (
          <div className='animate-pulse flex flex-col items-center justify-center pt-5 pb-6'>
            <Upload className='w-10 h-10 mb-3 text-gray-400' />
            <p className='mb-2 text-sm text-gray-500'>
              <span className='font-semibold'>點擊上傳</span> 或拖放圖片
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const FEATURES = [
  {
    title: "「穿搭推薦」量身打造！",
    description: "基於上傳的服飾圖片及歷史紀錄，我們為您推薦最適配的時尚單品。",
    children: <WindowShopping className='h-40' />,
  },
  {
    title: "「以服搜服」一拍即合！",
    description:
      "只需上傳一張圖片，我們就能為您找到相似的服飾。讓您輕鬆找到心儀的款式！",
    children: <AssetSelection className='h-40' />,
  },
  {
    title: "「白話搜尋」我們懂你！",
    description:
      "使用自然語言描述您想要的服飾，我們的AI將為您找到最匹配的選擇。",
    children: <SearchEngine className='h-40' />,
  },
];

const ImageSearchSection = () => {
  return (
    <section className='px-10 py-16 bg-gray-100 w-full'>
      <div className='w-full flex md:px-[5rem] md:flex-row flex-col md:items-start items-center justify-center gap-32 mx-auto px-4'>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          內容待生成
        </div>
        <div className='text-start'>
          <h2 className='text-3xl font-bold mb-4'>以服搜服</h2>
          <p className='w-full text-gray-600'>
            你是否曾看過路人穿搭超讚，卻不好意思打聽品牌？
            <br />
            那一瞬間的遺憾，夢中單品就這樣擦肩而過。
            <br />
            別擔心，「以服搜服」正是為你而生！
            <br />
            只需一張照片，在全球知名品牌找到相似款式，讓你貨比三家！
            <br />
            從此，讓每一次心動的穿搭都不再是遙不可及的夢！
          </p>
        </div>
      </div>
    </section>
  );
};

{
  /* TODO: Produce content for testimonial */
}

const TESTIMONIALS = [
  {
    name: "Eva",
    content: "終於可以輕鬆找到路人穿的衣服了！以服搜服真的太神了！",
    avatarUrl: "",
  },
  {
    name: "Kevin",
    content: "我喜歡直接打出我想要的風格，不需要糾結用詞，系統懂我！",
    avatarUrl: "",
  },
  {
    name: "Lily",
    content: "幫我找到很多獨特的品牌，每次穿出去都能引起話題！",
    avatarUrl: "",
  },
  {
    name: "Cindy",
    content: "幫我找到很多獨特的品牌，每次穿出去都能引起話題！",
    avatarUrl: "",
  },
  {
    name: "Morris",
    content: "幫我找到很多獨特的品牌，每次穿出去都能引起話題！",
    avatarUrl: "",
  },
];

const TestimonialSection = () => {
  return (
    <section className='py-20 w-full bg-gray-50'>
      <div className='max-w-[85vw] container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>用戶真心推薦</h2>
        <p className='text-gray-600 text-center mb-12'>
          我們的用戶都超愛這個簡單又精準的穿搭神器！
          <br />
          不管是以服搜服還是穿搭推薦，他們都發現了自己的時尚新可能。
          <br />
          聽聽他們怎麼說，感受他們的喜悅，說不定下一個穿搭達人就是你！
        </p>
        <div className='w-full flex flex-wrap gap-8 items-center justify-center'>
          {TESTIMONIALS.map((testimonial, index) => (
            <Card
              key={index}
              className='opacity-95 backdrop-blur-md bg-gray-50 w-[19rem] h-fit flex items-center gap-4 p-6 rounded-l-none rounded-r-sm border-0 border-l-4 border-solide border-indigo-400 shadow-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={
                    (testimonial.avatarUrl as string) ||
                    "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/OIP.jpeg"
                  }
                  alt={`${testimonial.name}'s Avatar`}
                />
                <AvatarFallback>{testimonial.name}</AvatarFallback>
              </Avatar>
              <div className='text-sm'>
                <h3 className='font-semibold'>{testimonial.name}</h3>
                <p className='text-gray-600'>{testimonial.content}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col pt-4'>
      {/* Hero Section */}
      <HeroSection />
      {/* Overview Section */}
      <OverviewSection />

      {/* Recommendation Section */}
      <RecommendationSection />

      {/* Image Search Section */}
      <ImageSearchSection />

      {/* Text Search */}

      {/* Testimonials Section */}
      <TestimonialSection />
    </div>
  );
}
