import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/use-translations";
import { LinkIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import Preview from "./preview";

const youtubeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/).+/i;
      return youtubeRegex.test(url);
    },
    { message: "Invalid YouTube URL" }
  );

export const Upload = () => {
  const t = useTranslations();

  const [url, setUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setUrl(null);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="file">
          <TabsList className="w-full">
            <TabsTrigger value="file" className="cursor-pointer">
              <UploadIcon className="w-4 h-4" />
              {t.home.upload.tab.right}
            </TabsTrigger>
            <TabsTrigger value="url" className="cursor-pointer">
              <LinkIcon className="w-4 h-4" />
              {t.home.upload.tab.left}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="shadow-none">
            <Card className="shadow-none">
              <CardContent className="grid gap-6 shadow-none py-[13vh]">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <UploadIcon size={28} className="text-muted-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold">Drag and drop your files</h3>
                  <p className="text-muted-foreground mb-6">or click the button below to browse</p>
                  <Button size="lg" className="cursor-pointer" onClick={() => document.getElementById("file-input")?.click()} disabled={isProcessing}>
                    Choose Files
                  </Button>
                  <input id="file-input" type="file" multiple className="hidden" accept=".mp4" onChange={handleFileChange} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="url" className="shadow-none">
            <Card className="shadow-none">
              <CardContent className="grid gap-6 shadow-none py-[13vh]">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <LinkIcon size={28} className="text-muted-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold">Import from URL</h3>
                  <p className="text-muted-foreground mb-6">Paste a link to import content directly</p>
                  <div className="flex flex-col items-center gap-2">
                    <InputGroup className="w-[450px] focus:outline-none focus:ring-0 h-10">
                      <InputGroupInput
                        placeholder="https://www.youtube.com/watch?v=B2pUrE_Ge1E"
                        className="focus:outline-none focus:ring-0"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          variant="default"
                          className="cursor-pointer hover:bg-primary/70 w-[90px]"
                          onClick={() => {
                            try {
                              youtubeUrlSchema.parse(urlInput);
                              setUrl(urlInput);
                              setIsPreviewOpen(true);
                              setUrlInput("");
                            } catch {
                              toast.error("Invalid YouTube URL", {
                                description: "Please enter a valid YouTube URL",
                              });
                            }
                          }}
                        >
                          Import URL
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Preview open={isPreviewOpen} onOpenChange={handlePreviewClose} file={selectedFile} url={url} />
    </>
  );
};

export default Upload;
