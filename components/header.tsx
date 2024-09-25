"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { WandSparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarMenu from "./avatar-menu";

const LandingPageHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          // if scroll down hide the navbar
          setIsVisible(false);
        } else {
          // if scroll up show the navbar
          setIsVisible(true);
        }

        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);
  return (
    <header>
      <div
        className={cn(
          "fixed w-full top-0 left-0 font-semibold bg-gray-100 bg-opacity-50 flex p-4 py-2 gap-4 h-[7vh] items-center justify-between  transition-transform duration-1000",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className='flex gap-4'>
          <Link href='/'>
            <WandSparkles className='text-indigo-400' />
          </Link>
          <p className='text-lg'>
            會不會<span className='text-indigo-400'>穿搭</span>啊
          </p>
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user: userResponse },
      } = await supabase.auth.getUser();
      console.log(userResponse);
      setUser(userResponse);
    })();
  }, []);
  const pathname = usePathname();
  if (pathname === "/") return <LandingPageHeader />;

  return (
    <header>
      <div className='font-semibold bg-gray-100 border-solid border-b-2 flex p-4 py-2 gap-4 h-[7vh] items-center justify-between shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <div className='flex gap-4'>
          <Link href='/'>
            <WandSparkles className='text-indigo-400' />
          </Link>
          <p className='text-lg'>
            會不會<span className='text-indigo-400'>穿搭</span>啊
          </p>
        </div>
        {user && <AvatarMenu />}
      </div>
    </header>
  );
};

export default Header;
