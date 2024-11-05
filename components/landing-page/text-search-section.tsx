"use client";

import Section from "./section";

const TextSearchSection = () => {
  return (
    <Section
      id='text-search-feature'
      title='白話搜尋'
      slogan='簡單一句話，尋找理想單品！'
      description={
        `輸入一句簡單的搜尋詞，如衣物的細節、搭配的情境等，
        系統會根據您的描述推薦合適的單品，讓搜尋更加符合您的需求。
        邀請您在左側區塊進行試用，探索這項便捷的搜尋體驗！`
      }
      buttonText="快速找到理想的單品！"
      buttonLink="/search"
    >
      內容待生成
    </Section>
  );
};

export default TextSearchSection;
