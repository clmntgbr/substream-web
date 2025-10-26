import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useStreams } from "@/lib/stream";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";

export function VideoQueueCards() {
  const { state } = useStreams();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {state.streams.map((stream) => (
        <Card key={stream.id} className="flex flex-col gap-4 pt-0 overflow-hidden">
          <Image
            src={stream.thumbnailUrl ?? ""}
            alt={stream.originalFileName}
            width={300}
            height={150}
            className="w-full h-[150px] object-cover object-center rounded-t-lg"
          />
          <CardHeader>
            <HoverCard>
              <HoverCardTrigger asChild>
                <CardTitle className="line-clamp-3 font-medium hover:underline cursor-pointer">{stream.originalFileName}</CardTitle>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{stream.originalFileName}</h4>
                  <div className="flex gap-2">
                    {stream.mimeType && <Badge variant="outline">{stream.mimeType}</Badge>}
                    {stream.sizeInMegabytes && <Badge variant="outline">{stream.sizeInMegabytes.toFixed(2)} MB</Badge>}
                    {stream.duration && <Badge variant="outline">{stream.duration}</Badge>}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <ArrowUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">Visitors for the last 6 months</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
