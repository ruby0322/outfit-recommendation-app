import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

const Section = ({ children, title, slogan, description, buttonText, buttonLink, reverse, darkerBackground, id }: { children?: React.ReactNode, title?: string, description?: string, slogan?: string, buttonText?: string, buttonLink?: string, reverse?: boolean, darkerBackground?: boolean, id: string }) => {
  return (
    <section id={id} className={cn('px-10 py-16 flex flex-col gap-12 items-center', darkerBackground ? 'bg-gray-100' : 'bg-gray-50')}>
      <div className={cn('w-full flex md:px-[5rem]  md:items-start items-center justify-center gap-32 mx-auto px-4', reverse ? 'md:flex-row-reverse flex-col' : 'md:flex-row flex-col')}>
        <div className='text-start w-fit flex flex-col gap-6'>
          <h2 className='text-3xl font-bold'>{ title }</h2>
          <h3 className='text-4xl font-bold'>{ slogan }</h3>
          <span className='w-full text-gray-600 text-lg'>
            {
              description?.split('\n').map(line => {
                return <>
                  {line}
                  <br />
                </>;
              })
            }
          </span>
          {
            buttonText &&
            <Link href={buttonLink || '/'}>
              <Button className="w-fit text-md bg-indigo-400 hover:bg-indigo-400/80 text-white">
                { buttonText }
              </Button>
            </Link>
          }
        </div>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          { children }
        </div>
      </div>
      
    </section>
  );
};

export default Section;
