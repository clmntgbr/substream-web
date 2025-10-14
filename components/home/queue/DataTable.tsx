"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Table as TableType } from "@tanstack/react-table";

import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Server-side pagination props
  serverSide?: boolean;
  pageCount?: number;
  totalItems?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  isLoading?: boolean;
  // Custom toolbar component
  ToolbarComponent?: React.ComponentType<{ table: TableType<TData> }>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  serverSide = false,
  pageCount = 0,
  totalItems = 0,
  onPaginationChange,
  onSortingChange: onSortingChangeProp,
  onColumnFiltersChange: onColumnFiltersChangeProp,
  isLoading = false,
  ToolbarComponent = DataTableToolbar,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Handle sorting changes
  const handleSortingChange = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      setSorting(newSorting);
      if (serverSide && onSortingChangeProp) {
        onSortingChangeProp(newSorting);
      }
    },
    [sorting, serverSide, onSortingChangeProp]
  );

  // Handle column filters changes
  const handleColumnFiltersChange = React.useCallback(
    (updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      const newFilters = typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;
      setColumnFilters(newFilters);
      if (serverSide && onColumnFiltersChangeProp) {
        onColumnFiltersChangeProp(newFilters);
        // Reset to first page when filters change
        setPagination((old) => ({ ...old, pageIndex: 0 }));
      }
    },
    [columnFilters, serverSide, onColumnFiltersChangeProp]
  );

  // Handle pagination changes
  const handlePaginationChange = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;
      setPagination(newPagination);
      if (serverSide && onPaginationChange) {
        onPaginationChange(newPagination);
      }
    },
    [pagination, serverSide, onPaginationChange]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: serverSide ? pageCount : undefined,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col gap-4">
      <ToolbarComponent table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="transition-opacity duration-200">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalItems={serverSide ? totalItems : undefined} />
    </div>
  );
}
