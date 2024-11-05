import TourCard from '@/components/tour-card';
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import Header from "@/components/header";
import { cn } from "@/lib/utils";

import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';
import { Onborda, OnbordaProvider, Step } from "onborda";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Clothing Recommendation",
  description: "Tin can, can you?",
};

const steps: Step[] = [
  // Example steps
  {
    icon: <></>,
    title: "上傳照片",
    content: <div className='flex flex-col gap-4'>
      <p>
        上傳你想要搭配的上衣或下身單品
      </p>
      <Image
        src={'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/Untitled%20design.png'}
        style={{objectFit:"cover"}}
        width={256}
        height={256}
        alt='Example upload image'
      />
      * 照片不可裁切到服飾過多細節，也請確保照明充足
    </div>,
    selector: "#image-uploader",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    nextRoute: '/upload?step=2'
  },
  {
    icon: <></>,
    title: "選擇參數",
    content: <>勾選你的需求</>,
    selector: "#form-fields",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=1',
    nextRoute: '/upload?step=3'
  },
  {
    icon: <></>,
    title: "確認上傳",
    content: <>確認無誤就可以進行推薦啦！</>,
    selector: "#overview",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=2',
    nextRoute: '/upload?step=1'
  },
  {
    icon: <></>,
    title: "歷史紀錄",
    content: <>還可以查看之前的推薦結果唷～</>,
    selector: "#recommendation-tabs-list",
    side: "bottom",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=3',
  },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          fontSans.variable
        )}
      >
        <Header />
        <OnbordaProvider>
          <Onborda
            steps={[{ 'tour': 'test', 'steps': steps }]}
            showOnborda={true}
            // shadowRgb="55,48,163"
            shadowOpacity="0.8"
            cardComponent={TourCard}
            cardTransition={{ duration: 0.5, type: "tween" }}
          >
            <div className='flex-1 flex justify-center min-h-[93vh] items-center overflow-y-scroll overflow-x-hiddena'>
              {children}
            </div>
          </Onborda>
        </OnbordaProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
