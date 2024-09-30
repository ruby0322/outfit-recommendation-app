"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedTextCharacter from "../animated-text-character";
import People from "../illustrations/people";

const HeroSection = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/upload"); // Navigate to the /upload route
  };
  return (
    <section className='md:h-[80vh] h-fit py-32 text-gray-800 relative flex md:flex-row flex-col-reverse  items-center justify-center bg-cover bg-center md:gap-24 gap-8 px-10'>
      <div className='relative z-10 md:text-start text-center'>
        <h1 className='flex text-2xl md:text-4xl font-bold mb-4 animate-fade-in-up'>
          <AnimatedTextCharacter text='輕鬆找到屬於你的' />
          <motion.span
            initial={{ x: 200, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            className='animate-[pulse_0.8s_ease-out_infinite] bg-gradient-to-r from-indigo-200 to-indigo-500 bg-clip-text text-transparent'
          >
            時尚風格
          </motion.span>
        </h1>
        <AnimatedTextCharacter
          className='border-l-4 border-black md:pl-4 pl-2 text-sm md:text-lg mb-16 max-w-3xl mx-auto animate-fade-in-up animation-delay-300'
          text='一鍵找到最適合您的穿搭靈感'
        />
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }}>
          <Button
            size='lg'
            className='bg-indigo-200 hover:bg-indigo-200/80 text-white animate-fade-in-up animation-delay-600 shadow-[3px_3px_0px_0px_rgba(139,92,246)] border-2 border-indigo-500'
            onClick={handleClick}
          >
            <WandSparkles className='text-indigo-600 mr-2 h-4 w-4' />
            <p className='text-indigo-600'>手刀進入，解鎖你的風格！</p>
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <People className='md:w-[30rem] w-[15rem]' />
      </motion.div>
    </section>
  );
};

export default HeroSection;
