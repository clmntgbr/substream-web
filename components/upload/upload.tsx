import { CloudUploadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const Upload = () => {
  const [isDragOver] = useState(false);
  const [isProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const videoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv", ".wmv"];

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

      if (isVideo) {
        console.log("Video uploaded:", {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
        });
      }
    });
  };

  return (
    <div className="w-full h-[500px] rounded-xl">
      <div className={`relative h-full flex items-center border-2 border-dashed rounded-xl`}>
        <div className="w-full p-12 text-center">
          <div
            className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 transition-transform duration-300 ${
              isDragOver ? "scale-110" : ""
            }`}
          >
            <CloudUploadIcon size={32} className={`transition-colors duration-300 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
          </div>

          <h3 className="text-2xl font-semibold text-foreground mb-2">{isDragOver ? "Drop files here" : "Drag & drop your files"}</h3>

          <p className="text-muted-foreground mb-6">or click to browse from your device</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button variant="default" size="lg" onClick={() => document.getElementById("file-input")?.click()} disabled={isProcessing}>
              Choose Files
            </Button>
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.avi,.mov,.mkv,.mp3,.wav,.flac,.aac,.zip,.rar,.7z,.tar,.js,.html,.css,.json,.xml"
            onChange={handleFileChange}
          />
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
            <div className="text-primary text-xl font-semibold animate-pulse">Release to upload files</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
