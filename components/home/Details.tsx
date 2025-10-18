import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Stream, useStreams } from "@/lib/stream";
import { Clock, Film, HardDrive, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Textarea } from "../ui/textarea";

interface DetailsProps {
  stream: Stream;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Details = ({ stream, open, onOpenChange }: DetailsProps) => {
  const { getResume } = useStreams();
  const [resume, setResume] = useState<string>("");
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  useEffect(() => {
    if (open && stream.id) {
      setIsLoadingResume(true);
      setResume("");
      getResume(stream.id).then((text) => {
        if (text) {
          setResume(text);
        }
        setIsLoadingResume(false);
      });
    } else {
      setResume("");
    }
  }, [open, stream.id, getResume]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-w-[100vw] h-screen w-screen p-0 border-0"
        hideCloseButton
      >
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 h-11 w-11 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white hover:text-black dark:hover:text-white backdrop-blur-md border border-black/20 dark:border-white/10 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-50"
          >
            <X className="h-5 w-5" />
          </Button>
          <SheetTitle>{stream.originalFileName}</SheetTitle>
          <SheetDescription className="flex flex-row gap-2">
            <Badge variant="outline">
              <Film className="h-3 w-3 mr-1" />
              video/mp4
            </Badge>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {stream.duration}
            </Badge>
            <Badge variant="secondary">
              <HardDrive className="h-3 w-3 mr-1" />
              {stream.sizeInMegabytes} MB
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-2 px-4 overflow-y-auto flex-1">
          <div className="w-full max-w-4xl">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="resume">Resume</FieldLabel>
                  <Textarea
                    id="resume"
                    placeholder={
                      isLoadingResume
                        ? "Loading resume..."
                        : "No resume available"
                    }
                    value={resume}
                    readOnly
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <FieldDescription>
                    AI-generated summary of the video content.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </div>

        <SheetFooter className="flex justify-center gap-3 px-4 py-4 border-t">
          <Button
            variant="default"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Details;
