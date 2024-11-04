"use client";

import Section from "./section";

const TextSearchSection = () => {
  return (
    <Section
      id='text-search-feature'
      title='白話搜尋'
      slogan='上傳圖片，精準搜出相似風格！'
      description={
        `上傳任意衣物圖片，我們將即時搜尋同款或相似風格的單品，
        讓您輕鬆找到滿意的結果。右側的小視窗讓您即刻試用並體驗這項功能效的果！`
      }
      buttonText="快速找到理想的單品！"
      buttonLink="/search"
    >
      內容待生成
    </Section>
  );
};

export default TextSearchSection;
