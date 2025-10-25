import { useAuth } from "@/lib/auth-context";
import { StreamQueryParams, useStreams } from "@/lib/stream";
import { useFeatureTranslations } from "@/lib/use-feature-translations";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { getColumns } from "./queue/video-queue-columns";
import { VideoQueueTable } from "./queue/video-queue-table";
import { VideoQueueToolbar } from "./queue/video-queue-toolbar";

export function Process() {
  const { user } = useAuth();
  const { state, getStreams, pageCount } = useStreams();
  const { lang } = useParams();
  const t = useFeatureTranslations("home");
  const currentParamsRef = useRef<StreamQueryParams>({});

  const columns = useMemo(() => getColumns(t, lang as string), [t, lang]);

  const handlePaginationChange = useCallback(
    (pagination: PaginationState) => {
      const params = {
        ...currentParamsRef.current,
        page: pagination.pageIndex + 1,
      };
      currentParamsRef.current = params;
      getStreams(params);
    },
    [getStreams]
  );

  const handleSortingChange = useCallback(
    (sorting: SortingState) => {
      const params = { ...currentParamsRef.current };
      if (sorting.length > 0) {
        const sort = sorting[0];
        params.sortBy = sort.id;
        params.sortOrder = sort.desc ? "desc" : "asc";
      } else {
        delete params.sortBy;
        delete params.sortOrder;
      }
      currentParamsRef.current = params;
      getStreams(params);
    },
    [getStreams]
  );

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      const params = { ...currentParamsRef.current };

      delete params.search;
      delete params.status;

      filters.forEach((filter) => {
        if (filter.id === "originalFileName" || filter.id === "fileName") {
          params.search = String(filter.value);
        } else if (filter.id === "status") {
          params.status = String(filter.value);
        }
      });

      currentParamsRef.current = params;
      getStreams(params);
    },
    [getStreams]
  );

  return (
    // <Card>
    // <CardContent>
    <VideoQueueTable
      data={state.streams}
      columns={columns}
      serverSide
      pageCount={pageCount}
      onPaginationChange={handlePaginationChange}
      onSortingChange={handleSortingChange}
      onColumnFiltersChange={handleColumnFiltersChange}
      ToolbarComponent={VideoQueueToolbar}
    />
    // </CardContent>
    // </Card>
  );
}
