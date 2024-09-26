"use client";

import { Facebook, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
const Footer = () => {
  const pathname = usePathname();
  if (pathname !== "/") return <></>;
  return (
    <footer className='bg-indigo-400 flex flex-col w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
      <div className='flex justify-center space-x-4 mb-4'>
        <a href='#' className='text-white hover:text-gray-400'>
          <Instagram />
        </a>
        <a href='#' className='text-white hover:text-gray-400'>
          <Facebook />
        </a>
      </div>
      <div className='text-sm text-white'>
        © 2024 你會不會穿搭啊｜All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
