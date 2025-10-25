"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
import { VideoQueueFilter } from "./video-queue-filter";
import { VideoQueueStatuses } from "./video-queue-statuses";
import { VideoQueueViewOptions } from "./video-queue-view-options";

interface VideoQueueToolbarProps<TData> {
  table: Table<TData>;
}

export function VideoQueueToolbar<TData>({ table }: VideoQueueToolbarProps<TData>) {
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
          className="h-8 w-[150px] lg:w-[250px] bg-white dark:bg-input"
        />
        {table.getColumn("status") && <VideoQueueFilter column={table.getColumn("status")} title="Status" options={VideoQueueStatuses} />}
        {isFiltered && (
          <Button
            variant="ghost"
            className="cursor-pointer"
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
        <VideoQueueViewOptions table={table} />
      </div>
    </div>
  );
}
