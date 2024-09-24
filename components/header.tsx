"use server";

import { createClient } from "@/utils/supabase/server";
import { WandSparkles } from "lucide-react";
import Link from "next/link";
import AvatarMenu from "./avatar-menu";

const Header = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header>
      <div className='font-semibold bg-gray-100 border-solid border-b-2 flex p-4 py-2 gap-4 h-[7vh] items-center justify-between shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <div className='flex gap-4'>
          <Link href='/'>
            <WandSparkles className='text-indigo-400' />
          </Link>
          你會不會穿搭啊
        </div>
        {user && <AvatarMenu />}
      </div>
    </header>
  );
};

export default Header;
