"use client";
import Upload from "@/components/home/Upload";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "80vh" }}>
        <section className="flex w-full flex-col items-center justify-center px-4">
          <div className="relative mb-8 flex flex-col items-center text-center">
            <h1 className="mb-2 flex items-center gap-1 text-3xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
              <span className="pt-0.5 tracking-tight md:pt-0 font-bold flex flex-col items-center gap-4">
                <span className="flex items-center gap-2">Build something with</span>
                <Logo width={200} height={200} />
              </span>
            </h1>
          </div>
          <Upload />
        </section>
      </div>
      <Card className="w-full max-w-7xl rounded-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <span className="text-primary">Substream</span> is a platform for building and sharing your own AI agents.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 min-h-[300px]">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">Substream</span> is a platform for building and sharing your own AI agents.
            </h2>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HomePage;
