import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const UploadPreview = ({
  href,
  imageUrl,
}: {
  href: string;
  imageUrl: string;
}) => {
  return (
    <Link href={href}>
      <Avatar className='border-0 cursor-pointer w-12 h-12 mb-4 flex items-center justify-center text-white font-bold bg-indigo-500 rounded-full hover:rounded-2xl hover:bg-indigo-600 hover:shadow-lg transition-all delay-0 duration-300 ease-out'>
        <AvatarImage src={imageUrl} alt='upload preview' />
        <AvatarFallback>{href}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UploadPreview;
