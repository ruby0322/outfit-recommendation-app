"use client";

import FeatureCard from "../feature-card";
import AssetSelection from "../illustrations/asset-selection";
import SearchEngine from "../illustrations/search-engine";
import WindowShopping from "../illustrations/window-shopping";

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

const OverviewSection = () => {
  return (
    <section
      id='overview'
      className='px-10 flex flex-col gap-12 items-center justify-content bg-indigo-400 py-16'
    >
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

export default OverviewSection;
