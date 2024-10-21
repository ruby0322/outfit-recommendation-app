"use client";
import {
    Carousel,
    CarouselMainContainer,
    SliderMainItem,
} from "@/components/extension/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

const ImageCarousel = ({ imageUrls }: { imageUrls: string[] }) => {
  return (
    <Carousel
      plugins={[
        AutoScroll({
          speed: 2,
        }),
      ]}
      carouselOptions={{
        loop: true,
      }}
    >
      <CarouselMainContainer className='h-full'>
        {imageUrls.map((imageUrl, index) => (
          <SliderMainItem key={index} className='max-w-48 bg-transparent'>
            <div className='w-48 h-48 flex items-center justify-center bg-background'>
              <Image
                src={imageUrl}
                width={1024}
                height={1024}
                className='w-full'
                style={{objectFit:"cover"}}
                alt={""}
              />
            </div>
          </SliderMainItem>
        ))}
      </CarouselMainContainer>
    </Carousel>
  );
};

export default ImageCarousel;
