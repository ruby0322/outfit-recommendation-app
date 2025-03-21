"use client";

import Section from "./section";

const ImageSearchSection = () => {

  return (
    <Section
      id="image-search-feature"
      title="📸 以服搜服"
      slogan='隨拍隨搜，輕鬆找到同款！'
      description={
        `在路上看到心儀的服飾，卻不知道哪裡買？
        別擔心，拿起手機隨拍隨搜，AI 會立刻幫你找到相似款，
        告訴你在哪裡購買，省時又省力！
        即使是街頭看到的時尚，也能輕鬆擁有！`
      }
      reverse={false}
      darkerBackground={false}
      screenshotUrl='/content/screenshot/image-search.png'
    />
  );
};

export default ImageSearchSection;
