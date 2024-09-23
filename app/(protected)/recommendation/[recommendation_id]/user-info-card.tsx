import { ParamTable, UploadTable } from "@/type";
import Image from "next/image";

const UserInfoCard = ({
  upload,
  params,
}: {
  upload: UploadTable;
  params: ParamTable;
}) => {
  return (
    <div className='rounded-sm max-w-[92vw] p-4 flex flex-col items-center justify-center gap-4 border-0 shadow-none'>
      <Image
        src={upload.image_url as string}
        alt='User Photo'
        width={256}
        height={256}
        className='object-cover'
      />
      <div className='flex gap-4 flex-wrap'>
        <div className='flex items-center justify-center gap-2'>
          <div className='text-sm font-medium text-muted-foreground'>性別</div>
          <div className='text-md'>
            {params?.gender === "male" ? "男性" : "女性"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
