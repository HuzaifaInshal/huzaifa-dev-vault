"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

const LoadingComponent = () => {
  return (
    <>
      <style>
        {`
        @keyframes shine {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}
      .animate-shine-loading {
  animation: shine 1.2s infinite linear;
}
      `}
      </style>
      <div className="container flex flex-col gap-6 justify-center h-[100dvh] w-full items-center mx-auto relative">
        <div className="relative h-[50px] lg:h-14 2xl:h-[70px] w-auto overflow-hidden">
          <Image
            src={"/AppW"}
            alt="App logo"
            height={500}
            width={500}
            className={cn("h-full w-auto", "dark:block", "hidden")}
          />
          <Image
            src={"/AppB"}
            alt="App logo"
            height={500}
            width={500}
            className={cn("h-full w-auto", "dark:hidden", "block")}
          />
          <div className="absolute inset-0 animate-shine-loading">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-safed/40 dark:via-background/80 to-transparent skew-x-[-20deg]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingComponent;
