"use client";
import { Header } from "@/components/header";
import { Columns } from "@/components/home/queue/ddd";
import { DataTable } from "@/components/home/queue/DataTable";
import { DataTableToolbar } from "@/components/home/queue/DataTableToolbar";
import Upload from "@/components/home/upload";
import { SidebarComponent } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { StreamQueryParams, useStreams } from "@/lib/stream/context";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useRef } from "react";

const HomePage = () => {
  const { user } = useAuth();
  const { state, getStreams, totalItems, pageCount } = useStreams();
  const currentParamsRef = useRef<StreamQueryParams>({});

  // Handle pagination changes
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

  // Handle sorting changes
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

  // Handle filter changes
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      const params = { ...currentParamsRef.current };

      // Reset search and status first
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

  // Auto-refresh every 10 seconds with current params
  useEffect(() => {
    const interval = setInterval(() => {
      getStreams(currentParamsRef.current, true); // Background refresh with current params
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
                columns={Columns}
                serverSide
                pageCount={pageCount}
                totalItems={totalItems}
                onPaginationChange={handlePaginationChange}
                onSortingChange={handleSortingChange}
                onColumnFiltersChange={handleColumnFiltersChange}
                isLoading={state.isLoading}
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
