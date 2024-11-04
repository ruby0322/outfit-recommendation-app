"use server";

import { createProfile, getPreviewsByUserId } from "@/actions/utils/user";
import UploadPreview from "@/components/upload-preview";
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

  await createProfile(user.id);
  // Render the children if the user is authenticated

  // const previews = await getPreviewsByUserId(user?.id as string);
  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      {/* <div className='w-16 flex flex-col items-center py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-y-scroll scrollbar-hide'>
        <Link href='/search'>
          <div className='bg-indigo-400 text-white cursor-pointer flex items-center justify-center w-12 h-12 p-2 mb-4 rounded-full hover:bg-indigo-400/80 hover:rounded-2xl transition-all hover:shadow-lg delay-0 duration-300 ease-out'>
            <Search className='w-6 h-6' />
            <span className='sr-only'>Search</span>
          </div>
        </Link>

        <Link href='/upload'>
          <div className='bg-indigo-400 text-white cursor-pointer flex items-center justify-center w-12 h-12 p-2 mb-4 rounded-full hover:bg-indigo-400/80 hover:rounded-2xl transition-all hover:shadow-lg delay-0 duration-300 ease-out'>
            <PlusCircle className='w-6 h-6' />
            <span className='sr-only'>Add Server</span>
          </div>
        </Link>
        {previews
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((preview, index) => (
            <UploadPreview
              key={`preview-${index}`}
              href={`/recommendation/${preview.id}`}
              imageUrl={preview.upload.image_url as string}
            />
          ))}
      </div> */}

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-y-scroll'>{children}</div>
    </div>
  );
}
