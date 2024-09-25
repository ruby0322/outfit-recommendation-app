"use client";

import { Facebook, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
const Footer = () => {
  const pathname = usePathname();
  if (pathname !== "/") return <></>;
  return (
    <footer className='flex flex-col w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
      <div className='flex justify-center space-x-4 mb-4'>
        <a href='#' className='text-gray-600 hover:text-gray-400'>
          <Instagram />
        </a>
        <a href='#' className='text-gray-600 hover:text-gray-400'>
          <Facebook />
        </a>
      </div>
      <div className='text-sm text-gray-400'>
        © 2024 Fashion Search. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
