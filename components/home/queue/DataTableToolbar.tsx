"use client";

import { DataTableViewOptions } from "@/components/home/queue/DataTableViewOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { Statuses } from "./Statuses";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (value.length >= 3 || value.length === 0) {
      table.getColumn("originalFileName")?.setFilterValue(value);
    } else if (value.length < 3 && table.getColumn("originalFileName")?.getFilterValue()) {
      table.getColumn("originalFileName")?.setFilterValue("");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search by name"
          value={searchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={Statuses} />}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters();
              setSearchValue("");
            }}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 w-[300px]">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
