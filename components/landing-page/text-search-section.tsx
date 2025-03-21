"use client";

import Section from "./section";

const TextSearchSection: React.FC = () => {
  return (
    <Section
      id='text-search-feature'
      title='🔍 文字搜尋'
      slogan='一句需求，輕鬆找到理想服飾！'
      description={
        `是不是常常腦海中有個穿搭靈感，但找不到對的服飾？
        告訴我們你的需求，輸入一句話，AI 會根據你的描述快速找到符合的衣物，
        幫你省去無數個逛街的時間！輕鬆購物，時尚隨手得！`
      }
      reverse={true}
      darkerBackground={true}
      screenshotUrl='/content/screenshot/text-search.png'
    />
  );
};

export default TextSearchSection;
