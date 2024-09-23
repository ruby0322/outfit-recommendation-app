"use server";

import { createClient } from "@/utils/supabase/server";
import { Shirt } from "lucide-react";
import Link from "next/link";
import AvatarMenu from "./avatar-menu";

const Header = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className='flex p-4 gap-4 justify-between'>
      <div className='flex gap-4'>
        <Link href='/'>
          <Shirt fill='#111' />
        </Link>
        <Link href='/upload'>推薦</Link>
      </div>
      {user && <AvatarMenu />}
    </header>
  );
};

export default Header;
