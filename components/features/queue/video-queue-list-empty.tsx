import { EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FolderArchive } from "lucide-react";

export function VideoQueueListEmpty() {
  return (
    <>
      <EmptyContent>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderArchive />
          </EmptyMedia>
          <EmptyTitle>No streams in the queue</EmptyTitle>
          <EmptyDescription>Add a video to the queue to get started</EmptyDescription>
        </EmptyHeader>
      </EmptyContent>
    </>
  );
}
