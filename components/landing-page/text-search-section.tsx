"use client";

const TextSearchSection = () => {
  return (
    <section id='text-search-feature' className='px-10 py-16 bg-gray-50 w-full'>
      <div className='w-full flex md:px-[5rem] md:flex-row flex-col md:items-start items-center justify-center gap-32 mx-auto px-4'>
        <div className='text-start'>
          <h2 className='text-3xl font-bold mb-4'>白話搜尋</h2>
          <p className='w-full text-gray-600'>
            你是否曾想找心中完美的服飾，找遍各服飾店卻以失敗告終？
            <br />
            那種苦尋無果的挫折感，想必你一定懂。
            <br />
            有了「白話搜尋」，這些困擾再也不是問題！
            <br />
            只要輸入一句白話的描述，不需要琢磨用詞，
            <br />
            我們都能找到最符合的商品，讓找衣服變得輕鬆又高效！
          </p>
        </div>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          內容待生成
        </div>
      </div>
    </section>
  );
};

export default TextSearchSection;
