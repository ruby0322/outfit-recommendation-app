'use client'

import { CircleHelp } from "lucide-react";
import { useOnborda } from "onborda";

const TourButton = ({ tourName }: { tourName: string; }) => {
  const { startOnborda } = useOnborda();
  return <span className="w-fit flex items-center justify-center text-gray-600">
    <CircleHelp className="absolute animate-ping duration-1000 w-3 cursor-pointer" />
    <CircleHelp className="z-10 w-4 cursor-pointer" onClick={() => { startOnborda(tourName) }} />
  </span>;
};

export default TourButton;