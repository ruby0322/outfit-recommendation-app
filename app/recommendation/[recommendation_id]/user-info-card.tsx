import { Card } from "@/components/ui/card";
import { UploadTable } from "@/type";
import Image from "next/image";

const UserInfoCard = ({ upload }: { upload: UploadTable }) => {
  return (
    <Card className='w-full p-4 flex gap-4'>
      <Image
        src='https://media.discordapp.net/attachments/893439505988743178/1267077952181506168/DALLE_2024-07-05_20.15.01_-_Create_a_high-quality_product_photo_of_a_casual_T-shirt._The_T-shirt_should_feature_a_simple_modern_design_made_from_high-quality_soft_fabric._Disp.webp?ex=66a779cc&is=66a6284c&hm=0a9c00dcfb8d12563edade2afb0e5950ffa7db6224db85bdbf78f7b1906d8a16&=&format=webp&width=1124&height=1124'
        alt='User Photo'
        width={256}
        height={256}
        className='object-cover rounded-sm'
      />
      <div className='grid gap-4'>
        <div className='grid gap-1'>
          <div className='text-sm font-medium text-muted-foreground'>身高</div>
          <div className='text-xl font-semibold'>175 公分</div>
        </div>
        <div className='grid gap-1'>
          <div className='text-sm font-medium text-muted-foreground'>體重</div>
          <div className='text-xl font-semibold'>70 公斤</div>
        </div>
        <div className='grid gap-1'>
          <div className='text-sm font-medium text-muted-foreground'>身型</div>
          <div className='text-xl font-semibold'>適中</div>
        </div>
      </div>
    </Card>
  );
};

export default UserInfoCard;
