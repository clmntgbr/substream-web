"use client";

import Upload from "@/components/home/Upload";
import { Process } from "@/components/Process";

const HomePage = () => {
  return (
    <>
      <Upload />
      <Process />

      {/* <div
        className="pointer-events-none fixed left-1/2 top-[-100px] -z-10 aspect-square w-[350%] -translate-x-1/2 overflow-hidden md:w-[190%] lg:w-[190%] xl:w-[190%] 2xl:mx-auto"
        style={{
          backgroundImage: "url(/gradient.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 300px",
          WebkitMask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
          mask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          WebkitPerspective: "1000px",
          perspective: "1000px",
          willChange: "transform",
        }}
        aria-hidden="true"
      /> */}
    </>
  );
};

export default HomePage;
