import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ItemListSkeleton({
  index,
  title,
}: {
  index: number;
  title?: string;
}) {
  return (
    <div
      className={cn(
        "p-4 flex flex-col gap-6 items-center",
        index !== 0 && "border-t-[1px] border-gray-800/30"
      )}
    >
      <div className='w-full flex justify-between items-center'>
        {title ? <Skeleton className='h-8 w-48' /> : <div></div>}
      </div>
      <Skeleton className='h-4 w-3/4' />
      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='w-64 flex flex-col gap-2'>
              <Skeleton className='h-64 w-full' />
              <Skeleton className='h-4 w-full' />
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-20' />
                <div className='flex gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-4 w-4' />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
