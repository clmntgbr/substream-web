import { Button } from "@/components/ui/button";
import { useStreams } from "@/lib/stream/context";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface VideoQueuePaginationProps {
  onPageChange: (page: number) => void;
}

export function VideoQueuePagination({
  onPageChange,
}: VideoQueuePaginationProps) {
  const { streams } = useStreams();

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex + 1);
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-muted-foreground flex-1 text-sm"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {streams.currentPage} of {streams.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(0)}
            disabled={streams.currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(streams.currentPage - 2)}
            disabled={streams.currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(streams.currentPage)}
            disabled={streams.currentPage >= streams.totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(streams.totalPages - 1)}
            disabled={streams.currentPage >= streams.totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
