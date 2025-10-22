import { Preview } from "@/components/home/Preview";
import { YoutubeUrlSchema } from "@/components/misc/YoutubeUrlSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "@/lib/use-translations";
import { Link2Icon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Upload = () => {
  const [url, setUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const t = useTranslations();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    const files = event.target.files;
    if (!files) return;

    const videoExtensions = [".mp4"];

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

      if (isVideo) {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    });

    event.target.value = "";
    setIsProcessing(false);
  };

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

  return (
    <>
      <Card className="w-full max-w-4xl rounded-2xl ">
        <CardContent className="flex flex-row gap-4 items-center ">
          <Button
            variant="outline"
            className=" hover:bg-muted/30 hover:text-accent-foreground cursor-pointer rounded-2xl border-neutral-300"
            onClick={() => document.getElementById("file-input")?.click()}
            disabled={isProcessing}
          >
            <PaperclipIcon className="size-4" />
            {t.home.upload.file}
          </Button>
          <input id="file-input" type="file" multiple className="hidden" accept=".mp4" onChange={handleFileChange} />
          <InputGroup className="flex rounded-2xl pr-0 w-full  border-neutral-300 dark:border-white/20">
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
                className="border-l-1 border-l-neutral-300 border-t-0 border-b-0 border-r-0 mr-2  bg-transparent hover:bg-muted/30 hover:text-accent-foreground dark:text-white cursor-pointer rounded-2xl text-black rounded-l-4xl"
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
      <Preview open={isPreviewOpen} onOpenChange={handlePreviewClose} file={selectedFile} url={url} onUploadSuccess={handleUploadSuccess} />
    </>
  );
};

export default Upload;
