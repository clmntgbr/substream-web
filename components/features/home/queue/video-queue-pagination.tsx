import { Button } from "@/components/ui/button";
import { useStreams } from "@/lib/stream";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface VideoQueuePaginationProps {
  onPageChange: (page: number) => void;
}

export function VideoQueuePagination({ onPageChange }: VideoQueuePaginationProps) {
  const { currentPage, pageCount } = useStreams();

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex + 1);
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-muted-foreground flex-1 text-sm"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(0)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(currentPage - 2)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(currentPage)}
            disabled={currentPage >= pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer bg-white dark:bg-input"
            onClick={() => handlePageChange(pageCount - 1)}
            disabled={currentPage >= pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
