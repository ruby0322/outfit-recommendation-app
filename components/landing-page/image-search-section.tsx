"use client";

const ImageSearchSection = () => {
  return (
    <section
      id='image-search-feature'
      className='px-10 py-16 bg-gray-100 w-full'
    >
      <div className='w-full flex md:px-[5rem] md:flex-row flex-col md:items-start items-center justify-center gap-32 mx-auto px-4'>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          內容待生成
        </div>
        <div className='text-start'>
          <h2 className='text-3xl font-bold mb-4'>以服搜服</h2>
          <p className='w-full text-gray-600'>
            你是否曾看過路人穿搭超讚，卻不好意思打聽品牌？
            <br />
            那一瞬間的遺憾，夢中單品就這樣擦肩而過。
            <br />
            別擔心，「以服搜服」正是為你而生！
            <br />
            只需一張照片，在全球知名品牌找到相似款式，讓你貨比三家！
            <br />
            從此，讓每一次心動的穿搭都不再是遙不可及的夢！
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageSearchSection;
