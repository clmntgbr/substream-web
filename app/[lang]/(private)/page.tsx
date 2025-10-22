"use client";
import { getColumns } from "@/components/home/queue/Columns";
import { DataTable } from "@/components/home/queue/DataTable";
import { DataTableToolbar } from "@/components/home/queue/DataTableToolbar";
import Upload from "@/components/home/Upload";
import { Logo } from "@/components/Logo";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { StreamQueryParams, useStreams } from "@/lib/stream";
import { useTranslations } from "@/lib/use-translations";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

const HomePage = () => {
  const { state, getStreams, pageCount } = useStreams();
  const { lang } = useParams();
  const t = useTranslations();
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

  useEffect(() => {
    const interval = setInterval(() => {
      getStreams(currentParamsRef.current, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [getStreams]);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="
                    pointer-events-none fixed left-1/2 top-[-100px] -z-10 
                    min-h-[calc(100%+100px)] w-[500%] -translate-x-1/2 overflow-hidden
                    sm:w-[350%]
                    md:w-[190%] lg:w-[190%] xl:w-[190%]
                    2xl:mx-auto
                  "
        style={{
          backgroundImage: "url(/gradient.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 100px",
          WebkitMask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
          mask: "linear-gradient(to bottom, transparent 0%, white 15%, white 100%)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          WebkitPerspective: "1000px",
          perspective: "1000px",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-4 px-4 container max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "80vh" }}>
          <section className="flex w-full flex-col items-center justify-center px-4">
            <div className="relative mb-8 flex flex-col items-center text-center">
              <h1 className="mb-2 flex items-center gap-1 text-3xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
                <span className="pt-0.5 tracking-tight md:pt-0 font-bold flex flex-col items-center gap-4">
                  <span className="flex items-center gap-2">Build something with</span>
                  <Logo width={200} height={200} />
                </span>
              </h1>
            </div>
            <Upload />
          </section>
        </div>
        <Card className="w-full max-w-7xl rounded-2xl mx-auto">
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HomePage;
