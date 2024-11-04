"use client";

import Section from "./section";

const ImageSearchSection = () => {
  return (
    <Section
      id='image-search-feature'
      title='以服搜服'
      slogan='簡單一句話，尋找理想單品！'
      description={
        `輸入一句簡單的搜尋詞，如衣物的細節、搭配的情境等，
        系統會根據您的描述推薦合適的單品，讓搜尋更加符合您的需求。
        邀請您在左側區塊進行試用，探索這項便捷的搜尋體驗！`
      }
      buttonText="探索相似款式！"
      buttonLink="/search"
      reverse={true}
      darkerBackground={true}
    >
      內容待生成
    </Section>
  );
};

export default ImageSearchSection;
