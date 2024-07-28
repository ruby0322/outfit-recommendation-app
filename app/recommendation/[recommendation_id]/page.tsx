import { Button } from "@/components/ui/button";
import UserInfoCard from "./user-info-card";

export default function Component() {
  return (
    <div className='flex flex-col gap-8 max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12'>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='flex flex-col gap-4 justify-center items-center'>
          <UserInfoCard />
          <div className='w-full justify-between bg-muted rounded-lg p-4 flex items-center gap-4'>
            <div className='flex gap-4'></div>
            <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
              <h3 className='font-semibold'>Not what you were looking for?</h3>
              <p className='text-sm text-muted-foreground'>
                Refine your search and get new recommendations.
              </p>
              <Button>Redo</Button>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
              <h3 className='font-semibold'>Casual Summer Looks</h3>
              <p className='text-sm text-muted-foreground'>
                Relaxed and comfortable outfits perfect for warm weather.
              </p>
              <div className='flex flex-wrap gap-2'>
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 1'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 2'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 3'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 4'
                  className='rounded-md'
                />
              </div>
              <div className='flex items-center justify-between'>
                <Button variant='outline'>View More</Button>
              </div>
            </div>
            <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
              <h3 className='font-semibold'>Colorful Outfits</h3>
              <p className='text-sm text-muted-foreground'>
                Vibrant and eye-catching looks to make a statement.
              </p>
              <div className='flex flex-wrap gap-2'>
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 1'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 2'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 3'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 4'
                  className='rounded-md'
                />
              </div>
              <div className='flex items-center justify-between'>
                <Button variant='outline'>View More</Button>
              </div>
            </div>
            <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
              <h3 className='font-semibold'>Summer Dresses</h3>
              <p className='text-sm text-muted-foreground'>
                Lightweight and breezy dresses perfect for warm weather.
              </p>
              <div className='flex flex-wrap gap-2'>
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 1'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 2'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 3'
                  className='rounded-md'
                />
                <img
                  src='/placeholder.svg'
                  width={150}
                  height={150}
                  alt='Product 4'
                  className='rounded-md'
                />
              </div>
              <div className='flex items-center justify-between'>
                <Button variant='outline'>View More</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
