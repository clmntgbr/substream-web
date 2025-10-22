"use client";
import { getColumns } from "@/components/home/queue/Columns";
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
  return <></>;
};

export default HomePage;
