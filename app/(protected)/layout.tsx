"use server";

import { createProfile, getPreviewsByUserId } from "@/actions/utils/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // Get the user data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle error if getUser fails
  if (error || !user) {
    // Redirect the user to the login page if not authenticated
    redirect("/login");
    return null; // To prevent rendering if the user is being redirected
  }

  console.log(user);
  await createProfile(user.id);
  // Render the children if the user is authenticated

  const previews = await getPreviewsByUserId(user?.id as string);
  console.log(previews);
  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      {/* Sidebar */}
      <div className='w-16 flex flex-col items-center py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        {/* Search Icon */}
        <Link href='/search'>
          <div className='cursor-pointer flex items-center justify-center w-12 h-12 p-2 mb-4 rounded-full bg-gray-300 hover:bg-gray-400 hover:rounded-2xl transition-all hover:shadow-lg delay-0 duration-300 ease-out'>
            <Search className='w-6 h-6' />
            <span className='sr-only'>Search</span>
          </div>
        </Link>

        <Link href='/upload'>
          <div className='cursor-pointer flex items-center justify-center w-12 h-12 p-2 mb-4 rounded-full bg-gray-300 hover:bg-gray-400 hover:rounded-2xl transition-all hover:shadow-lg delay-0 duration-300 ease-out'>
            <PlusCircle className='w-6 h-6' />
            <span className='sr-only'>Add Server</span>
          </div>
        </Link>
        {previews.map((preview, index) => (
          <Link key={index} href={`/recommendation/${preview.id}`}>
            <Avatar className='border-0 cursor-pointer w-12 h-12 mb-4 flex items-center justify-center text-white font-bold bg-indigo-500 rounded-full hover:rounded-2xl hover:bg-indigo-600 hover:shadow-lg transition-all delay-0 duration-300 ease-out'>
              <AvatarImage
                src={preview.upload.image_url as string}
                alt={`preview ${index}`}
              />
              <AvatarFallback>{index}</AvatarFallback>
            </Avatar>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-y-scroll'>{children}</div>
    </div>
  );
}
