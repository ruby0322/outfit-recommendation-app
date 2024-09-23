"use client";

import { getProfileByUserId, signOut } from "@/actions/utils/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileTable } from "@/type";
import { createClient } from "@/utils/supabase/client";
import { User as UserType } from "@supabase/supabase-js";
import { Camera, LogOut, Settings, Tag } from "lucide-react";
import { useEffect, useState } from "react";

export default function AvatarMenu() {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileTable | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = await getProfileByUserId(user?.id as string);
      setUser(user);
      setProfile(profile);
    })();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleChangeProfilePicture = () => {
    console.log("Change profile picture clicked");
    // Implement profile picture change logic here
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={profile?.avatar_url as string}
              alt={`${profile?.username}'s Avatar`}
            />
            <AvatarFallback>{profile?.username}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profile?.username}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleChangeProfilePicture}>
          <Tag className='mr-2 h-4 w-4' />
          <span>更改使用者名稱</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleChangeProfilePicture}>
          <Camera className='mr-2 h-4 w-4' />
          <span>更改使用者頭像</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className='mr-2 h-4 w-4' />
          <span>查看更多設定</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
