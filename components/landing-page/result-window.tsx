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
    { label: "⌚ 街頭潮流風",
      description: "搭配破損設計的牛仔褲，增添街頭及潮流感，非正式場合的時尚選擇。",
      images: [
        "https://www.uniqlo.com/tw/hmall/test/u0000000018513/sku/561/COL65.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02459650004/42-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02459650004/41-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02359651006/42-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02259651006/43-2.jpg",
      ] },
    { label: "🧳 簡約現代風",
      description: "搭配黑色直筒褲，顯得既簡約又時尚，適合多種場合。",
      images: [
        "https://s3.hicloud.net.tw/fifty/new_men/02459350001/11-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02259551003/11-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02458051001/11-2.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02459150003/11-2.jpg",
      ] },
  ],
  [
    { label: "休閒風",
      description: "搭配簡單的T恤可突顯輕鬆隨意的風格，適合日常穿著。",
      images: [
        "https://www.uniqlo.com/tw/hmall/test/u0000000018350/sku/561/COL00.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000018341/sku/561/COL00.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000018350/sku/561/COL03.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000018346/sku/561/COL00.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000018350/sku/561/COL08.jpg",
      ] },
    { label: "都市智慧風",
      description: "淺色襯衫能添加一些正式感且不失時尚感，適合工作與休閒兼具的場合。",
      images: [
        "https://www.uniqlo.com/tw/hmall/test/u0000000019963/sku/561/COL64.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000019965/sku/561/COL63.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000019966/sku/561/COL62.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000019964/sku/561/COL66.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02259031001/43-2.jpg",
      ] },
    { label: "經典時尚風",
      description: "搭配一件深色毛衣增添層次感，且將經典與時尚完美結合。",
      images: [
        "https://s3.hicloud.net.tw/fifty/new_men/02359242002/11.gif",
        "https://www.uniqlo.com/tw/hmall/test/u0000000020358/sku/561/COL05.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000020491/sku/561/COL35.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000020491/sku/561/COL09.jpg",
        "https://s3.hicloud.net.tw/fifty/new_men/02259021002/27-2.jpg",
      ] },
  ],
  [
    { label: "優雅日常",
      description: "搭配高腰直筒褲，展現出乾淨利落的剪裁，讓整體造型更為優雅。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/99/95/999525d146b725feef808d1ae9c9e1596e7f2045.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/b6/b7/b6b77eec81d90e736079a3f367f7d9a6c6663ff6.jpg],origin[dam],category[ladies_trousers_highwaisted],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://s3.hicloud.net.tw/fifty/new_women/02483150001/68-2.jpg",
        "https://lp2.hm.com/hmgoepprod?set=source[/99/95/999525d146b725feef808d1ae9c9e1596e7f2045.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://s3.hicloud.net.tw/fifty/new_women/02483150001/32-2.jpg",
      ] },
    { label: "休閒風",
      description: "搭配修身牛仔褲，營造出輕鬆的休閒氛圍，適合日常出門。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/9c/7f/9c7f32a764635b6ff67fdfc1abbf4dd9069c0c7d.jpg],origin[dam],category[ladies_jeans_skinny],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/9f/16/9f16afb1c7ddff273c9708a62f314f2dd2da342a.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/b9/70/b97093292fb1fb9d406379f3e2e6fc32ead42f9a.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://s3.hicloud.net.tw/fifty/new_women/02489351002/41-2.jpg",
        "https://www.uniqlo.com/tw/hmall/test/u0000000016981/sku/561/COL67.jpg",
      ] },
    { label: "優雅裙裝",
      description: "搭配A字裙，增添女性柔美感，適合正式場合或約會穿搭。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/a6/b4/a6b493bde88c23937ee40647f2d69b1ed02952a6.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/7a/3b/7a3bb9777e267ec169f1a3c4da16248e822929c5.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/80/b3/80b3c78a7553edba0a38edd83a54048f4cbcb204.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/11/96/1196ecd0895816523cc227d7c36213385d266433.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/31/21/31216b51d76987264d27ab3701d1e8505d594683.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
      ] },
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
