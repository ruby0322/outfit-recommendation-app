"use server";

import { createProfile } from "@/actions/utils/user";
import { createClient } from "@/utils/supabase/server";
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
  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      {/* <div className='w-16 p-2 flex flex-col items-center py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-y-scroll scrollbar-hide'>
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
