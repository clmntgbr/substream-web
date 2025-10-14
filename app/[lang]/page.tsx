"use client";
import { Header } from "@/components/Header";
import { getColumns } from "@/components/home/queue/Columns";
import { DataTable } from "@/components/home/queue/DataTable";
import { DataTableToolbar } from "@/components/home/queue/DataTableToolbar";
import Upload from "@/components/home/Upload";
import { SidebarComponent } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { StreamQueryParams, useStreams } from "@/lib/stream/context";
import { useTranslations } from "@/lib/use-translations";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef } from "react";

const HomePage = () => {
  const { user } = useAuth();
  const { state, getStreams, pageCount } = useStreams();
  const t = useTranslations();
  const currentParamsRef = useRef<StreamQueryParams>({});

  const columns = useMemo(() => getColumns(t), [t]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      getStreams(currentParamsRef.current, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [getStreams]);

  if (!user) return null;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <SidebarComponent />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 container max-w-6xl mx-auto">
              <Upload />
              <DataTable
                data={state.streams}
                columns={columns}
                serverSide
                pageCount={pageCount}
                onPaginationChange={handlePaginationChange}
                onSortingChange={handleSortingChange}
                onColumnFiltersChange={handleColumnFiltersChange}
                ToolbarComponent={DataTableToolbar}
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HomePage;
