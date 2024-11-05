'use client';

import Construction from "./illustrations/construction";

const UnderConstruction = () => {
  return <div className="w-full h-full flex flex-col gap-12 items-center justify-center">
    <Construction />
    <h3 className="text-2xl text-indigo-400/90">頁面建置中，敬請期待！</h3>
  </div>;
}

export default UnderConstruction;