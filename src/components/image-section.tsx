/* eslint-disable @next/next/no-img-element */
"use client";

import { Skeleton } from "./ui/skeleton";
export const ImageSectionSkeleton = () => {
  return (
    <>
      <div className="my-4 grid grid-cols-1 gap-2 lg:grid-cols-2 w-full">
        {[...Array(4)].map((_, index) => (
          <div className="w-full h-full" key={`image-skeleton-${index}`}>
            <Skeleton className="rounded-md object-cover shadow-none border-none w-full bg-card h-[160px] " />
          </div>
        ))}
      </div>
    </>
  );
};

export function ImagePreload({ images }: { images: string[] }) {
  if (images && images.length > 0) {
    return (
      <div className="flex flex-wrap">
        {images.map((image) => (
          <img key={image} src={image} className="w-1 h-1 opacity-0" />
        ))}
      </div>
    );
  }
  return null;
}
