"use client";
import AnimatedTextCharacter from "@/components/animated-text-character";
import FeatureCard from "@/components/feature-card";
import AssetSelection from "@/components/illustrations/asset-selection";
import People from "@/components/illustrations/people";
import SearchEngine from "@/components/illustrations/search-engine";
import WindowShopping from "@/components/illustrations/window-shopping";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Search, Upload, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Tab } from "@/components/tab";
import { useRef, useState } from "react";

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
            className='bg-gradient-to-r from-indigo-200 to-indigo-500 bg-clip-text text-transparent'
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
    <section className='px-10 flex flex-col gap-12 items-center justify-content bg-indigo-400 py-16 bg-gray-50'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-12 text-white'>
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
  return (
    <section className='px-10 py-16 bg-gray-50'>
      <div className='flex flex-col md:items-start items-center gap-8 mx-auto px-4'>
        <div className='text-start'>
          <h2 className='text-3xl font-bold mb-4'>穿搭建議</h2>
          <p>上傳服飾照片，一鍵為您迅速搜尋全球適配時尚單品</p>
        </div>
        <div className='flex gap-8'>
          <DragAndDropImageUploaderMock
            droppedImage={droppedImage}
            setDroppedImage={setDroppedImage}
          />
          {/* <ResultWindow index={0} /> */}
        </div>
      </div>
    </section>
  );
};

function DragAndDropImageUploaderMock({
  droppedImage,
  setDroppedImage,
}: {
  droppedImage: string | null;
  setDroppedImage: (x: string) => void;
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
          setDroppedImage(draggedImageRef.current);
        }
      }
    }
    draggedImageRef.current = null;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedImageSrc = event.dataTransfer.getData("text/plain");
    if (droppedImageSrc) {
      setDroppedImage(droppedImageSrc);
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
                  droppedImage === src && "hidden"
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
              className='w-full'
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

const tabs = [
  [
    { label: "休閒運動風", images: [] },
    { label: "休閒街頭風", images: [] },
    { label: "簡約商務風", images: [] },
  ],
  [
    { label: "休閒運動風", images: [] },
    { label: "休閒運動風", images: [] },
    { label: "休閒運動風", images: [] },
  ],
  [
    { label: "休閒運動風", images: [] },
    { label: "休閒運動風", images: [] },
    { label: "休閒運動風", images: [] },
  ],
];

const ResultWindow = ({ index }: { index: 0 | 1 | 2 }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[index][0].label);
  return (
    <div className='w-fit h-fit rounded-md bg-white overflow-hidden shadow-[0_1px_1px_hsla(0,_0%,_0%,_0.075),_0_2px_2px_hsla(0,_0%,_0%,_0.075),_0_4px_4px_hsla(0,_0%,_0%,_0.075),_0_8px_8px_hsla(0,_0%,_0%,_0.075),_0_16px_16px_hsla(0,_0%,_0%,_0.075)] flex flex-col'>
      <nav className='flex p-2 rounded-t-2 border-b border-b-[#eeeeee] h-[44px] max-w-[480px] overflow-hidden'>
        {tabs[index].map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            isSelected={selectedTab === tab.label}
            onClick={() => setSelectedTab(tab.label)}
          />
        ))}
      </nav>
      <main>{selectedTab}</main>
    </div>
  );
};

const FakeImageUploader = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (x: boolean) => void;
}) => {
  return (
    <motion.div className='cursor-pointer' onTap={() => setIsVisible(true)}>
      <AnimatePresence>
        <label
          htmlFor='dropzone-file'
          className={cn(
            "flex flex-col items-center justify-center w-64 h-64 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden",
            // isVisible
            // ? "border-4 border-indigo-400 border-solid"
            "border-2 border-gray-300 border-dashed"
          )}
        >
          {isVisible && (
            <motion.div
              className='w-full h-full flex items-center justify-content'
              style={{
                borderRadius: 15,
                backgroundColor: "#fff",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Image
                src='https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-750cc231-23d4-436a-a085-7286e0fdeed3?t=2024-09-25T17%3A20%3A26.729Z'
                width='256'
                height='256'
                objectFit='cover'
                alt='Uploaded image'
              />
            </motion.div>
          )}
          {!isVisible && (
            <div className='animate-pulse flex flex-col items-center justify-center pt-5 pb-6'>
              <Upload className='w-10 h-10 mb-3 text-gray-400' />
              <p className='mb-2 text-sm text-gray-500'>
                <span className='font-semibold'>點擊上傳</span> 或拖放圖片
              </p>
            </div>
          )}
        </label>
      </AnimatePresence>
    </motion.div>
  );
};

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

export default function LandingPage() {
  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col pt-4'>
      {/* Hero Section */}
      <HeroSection />
      {/* Overview Section */}
      <OverviewSection />

      {/* Recommendation Section */}
      <RecommendationSection />

      {/* Features Section */}
      {/* Text Search */}
      <section className='w-full py-16 bg-gray-200/50'>
        <div className='space-y-6'>
          <Input
            type='text'
            placeholder='幫我找一件適合夏天的白色襯衫'
            className='flex-grow'
          />
          <Button type='submit'>
            <Search className='w-4 h-4 mr-2' /> 搜尋
          </Button>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <p>搜尋結果將在這裡動態顯示</p>
          </div>
          <ul className='list-disc list-inside'>
            <li>直接輸入你的需求，系統立刻理解並推薦最適合的商品</li>
          </ul>
        </div>
      </section>

      {/* Image Search */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='space-y-6'>
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <img
                src={""}
                alt='Uploaded'
                className='w-full h-48 object-cover rounded'
              />
              <p className='mt-2'>搜尋結果將在這裡動態顯示</p>
            </div>
            <ul className='list-disc list-inside'>
              <li>一鍵上傳照片，迅速搜尋全球類似款式</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>用戶真心推薦</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                name: "Eva",
                content:
                  '終於可以輕鬆找到路人穿的衣服了！"以服搜服"真的太神了！',
              },
              {
                name: "Kevin",
                content:
                  "我喜歡直接打出我想要的風格，不需要糾結專有名詞，系統懂我！",
              },
              {
                name: "Lily",
                content: "幫我找到很多獨特的品牌，每次穿出去都能引起話題！",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className='p-6 hover:shadow-lg transition-shadow duration-300'
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 rounded-full bg-gray-200 mr-4'></div>
                  <h3 className='font-semibold'>{testimonial.name}</h3>
                </div>
                <p className='text-gray-600'>{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
