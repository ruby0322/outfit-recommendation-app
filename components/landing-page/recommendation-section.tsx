"use client";

import Section from "./section";

const RecommendationSection = () => {
  return (
    <Section
      id='recommendation-feature'
      title='✨ 推薦功能'
      slogan='上半身搭配下半身，讓搭配更有創意！'
      description={
        `還在為怎麼搭配衣服煩惱嗎？只要上傳你的上半身或下半身服飾，
        AI 智能馬上為你推薦最合適的下半身或上半身，給你最時尚的搭配建議！
        不論是正式場合還是休閒日常，瞬間變身穿搭達人！`
      }
      screenshotUrl='/content/screenshot/recommendation.png'
    />
  );
};

export default RecommendationSection;
