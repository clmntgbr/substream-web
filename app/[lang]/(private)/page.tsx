"use client";
import Preview from "@/components/home/Preview";
import { Logo } from "@/components/Logo";
import { YoutubeUrlSchema } from "@/components/misc/YoutubeUrlSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "@/lib/use-translations";
import { Link2Icon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const HomePage = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const t = useTranslations();

  const handlePreviewClose = (open: boolean) => {
    setIsPreviewOpen(open);
    if (!open) {
      setSelectedFile(null);
      setUrl("");
    }
  };

  const handleUploadSuccess = () => {
    setSelectedFile(null);
    setUrl("");
    setUrlInput("");
  };

  if (!user) return null;

  return (
    <>
      <section className="mb-[20px] flex w-full flex-col items-center justify-center py-[20vh] md:mb-0 2xl:py-64">
        <div className="relative mb-4 flex flex-col items-center px-4 text-center md:mb-6">
          <div className="flex w-full flex-col items-center justify-center gap-2"></div>
          <h1 className="mb-2 flex items-center gap-1 text-3xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
            <span className="pt-0.5 tracking-tight md:pt-0 font-bold flex flex-col items-center gap-2">
              <span className="flex items-center gap-2">Build something with</span>
              <Logo width={200} height={200} />
            </span>
          </h1>
        </div>
        <Card className="w-full max-w-4xl rounded-4xl">
          <CardContent className="flex flex-row gap-4 items-center">
            <Button
              variant="outline"
              className="shadow-none hover:bg-muted/30 hover:text-accent-foreground cursor-pointer rounded-4xl border-neutral-300"
              onClick={() => {}}
            >
              <PaperclipIcon className="size-4" />
              {t.home.upload.file}
            </Button>
            <InputGroup className="flex rounded-4xl pr-0 w-full shadow-none border-neutral-300">
              <InputGroupInput
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                }}
                className="rounded-r-none font-bold placeholder:font-normal"
                placeholder="https://youtu.be/uC0RFwhrWLE?si=tG6hdG1LIgsTgnun"
              />
              <InputGroupAddon align="inline-end" className="p-0">
                <Button
                  variant="outline"
                  className="border-l-1 border-l-neutral-300 border-t-0 border-b-0 border-r-0 mr-2 shadow-none bg-transparent hover:bg-muted/30 hover:text-accent-foreground dark:text-white cursor-pointer rounded-4xl text-black rounded-l-4xl"
                  onClick={() => {
                    setIsProcessing(true);
                    try {
                      YoutubeUrlSchema.parse(urlInput);
                      setUrl(urlInput);
                      setIsPreviewOpen(true);
                      setUrlInput("");
                    } catch {
                      toast.error("Invalid YouTube URL", {
                        description: "Please enter a valid YouTube URL",
                      });
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                >
                  {isProcessing ? <Spinner className="w-4 h-4 animate-spin" /> : <Link2Icon className="size-4" />}
                  {t.home.upload.url}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </CardContent>
        </Card>
      </section>
      <Preview open={isPreviewOpen} onOpenChange={handlePreviewClose} file={selectedFile} url={url} onUploadSuccess={handleUploadSuccess} />
    </>
  );
};

export default HomePage;
