import ImageCarousel from "@/components/image-carousel";
import { Tab } from "@/components/tab";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ResultWindowSkeleton from "./result-window-skeleton";

{
  /* TODO: Produce content for text search */
}

const TEXT_SEARCH_TABS = [];

{
  /* TODO: Produce content for image search */
}

const IMAGE_SEARCH_TABS = [];

{
  /* TODO: Produce content for recommendation */
}
const RECOMMENDATION_TABS = [
  [
    {
      label: "⚽ 休閒運動風",
      description:
        "帽踢搭配運動長褲，整體看起來輕鬆自在，非常適合日常休閒場合。",
      images: [
        "https://www.uniqlo.com/tw/hmall/test/u0000000020101/main/other3/480/4.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000016800/sku/561/COL08.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000018825/main/other2/480/3.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000019653/main/other1/480/2.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000019586/main/other5/480/6.jpg",
      ],
    },
    { label: "⌚ 休閒街頭風", description: "", images: [] },
    { label: "🧳 簡約商務風", description: "", images: [] },
  ],
  [
    { label: "休閒運動風", description: "", images: [] },
    { label: "休閒運動風", description: "", images: [] },
    { label: "休閒運動風", description: "", images: [] },
  ],
  [
    { label: "休閒運動風", description: "", images: [] },
    { label: "休閒運動風", description: "", images: [] },
    { label: "休閒運動風", description: "", images: [] },
  ],
];

const ResultWindow = ({
  index,
  close,
}: {
  index: 0 | 1 | 2;
  close: () => void;
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <motion.div
          key='skeleton'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultWindowSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key='content'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='w-[32rem] max-w-[85vw] fit rounded-md bg-white overflow-hidden shadow-[0_1px_1px_hsla(0,_0%,_0%,_0.075),_0_2px_2px_hsla(0,_0%,_0%,_0.075),_0_4px_4px_hsla(0,_0%,_0%,_0.075),_0_8px_8px_hsla(0,_0%,_0%,_0.075),_0_16px_16px_hsla(0,_0%,_0%,_0.075)] flex flex-col gap-4 p-4'
        >
          <div className='w-full flex gap-2'>
            <div
              onClick={close}
              className='cursor-pointer w-3 h-3 bg-red-400 rounded-full'
            ></div>
            <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
            <div className='w-3 h-3 bg-green-400 rounded-full'></div>
          </div>
          <nav className='flex rounded-t-2 border-b border-b-[#eeeeee] overflow-hidden h-fit'>
            {RECOMMENDATION_TABS[index].map((tab, idx) => (
              <Tab
                key={`${index}-${tab.label}-${index * idx}`}
                label={tab.label}
                isSelected={selectedTabIndex === idx}
                onClick={() => setSelectedTabIndex(idx)}
              />
            ))}
          </nav>
          <ImageCarousel
            imageUrls={RECOMMENDATION_TABS[index][selectedTabIndex].images}
          />
          <p className='text-gray-600 text-center text-sm italic'>
            {RECOMMENDATION_TABS[index][selectedTabIndex].description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultWindow;
