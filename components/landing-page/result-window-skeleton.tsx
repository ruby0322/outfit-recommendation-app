"use client";

import { motion } from "framer-motion";

const ResultWindowSkeleton = () => {
  return (
    <div className='w-[32rem] max-w-[85vw] h-fit rounded-md bg-white overflow-hidden shadow-[0_1px_1px_hsla(0,_0%,_0%,_0.075),_0_2px_2px_hsla(0,_0%,_0%,_0.075),_0_4px_4px_hsla(0,_0%,_0%,_0.075),_0_8px_8px_hsla(0,_0%,_0%,_0.075),_0_16px_16px_hsla(0,_0%,_0%,_0.075)] flex flex-col gap-4 p-4'>
      <div className='w-full flex gap-2'>
        <div className='w-3 h-3 bg-gray-200 rounded-full'></div>
        <div className='w-3 h-3 bg-gray-200 rounded-full'></div>
        <div className='w-3 h-3 bg-gray-200 rounded-full'></div>
      </div>
      <nav className='flex rounded-t-2 border-b border-b-[#eeeeee] overflow-hidden h-fit'>
        {[1, 2, 3].map((_, idx) => (
          <motion.div
            key={idx}
            className='h-10 w-24 bg-gray-200 rounded-t-md mr-2'
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </nav>
      <motion.div
        className='w-full h-48 bg-gray-200 rounded-md'
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className='w-3/4 h-4 bg-gray-200 rounded-md mx-auto'
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ResultWindowSkeleton;
