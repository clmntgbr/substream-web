"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";

export function SubtitleColorPicker({
  background,
  setBackground,
  className,
  disabled = false,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  const solids = [
    "#E2E2E2",
    "#FFFFFF",
    "#000000",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B195",
    "#F67280",
    "#C06C84",
    "#6C5B7B",
    "#355C7D",
    "#2A363B",
    "#E84A5F",
    "#FF847C",
    "#FECEA8",
    "#99B898",
    "#2A2E43",
    "#99738E",
    "#A8E6CE",
    "#DCEDC2",
    "#FFD3B5",
    "#FFAAA6",
    "#AA96DA",
    "#FCBAD3",
    "#FFFFD2",
    "#A8D8EA",
    "#E0BBE4",
    "#957DAD",
    "#D291BC",
    "#FEC8D8",
    "#FFDFD3",
    "#96CEB4",
    "#FFEAA7",
    "#DFE6E9",
    "#74B9FF",
    "#A29BFE",
    "#FD79A8",
    "#FDCB6E",
    "#6C5CE7",
    "#00B894",
    "#00CEC9",
    "#0984E3",
    "#B2BEC3",
    "#636E72",
    "#FF7675",
    "#FFBE76",
    "#BADC58",
    "#7ED6DF",
    "#E056FD",
    "#686DE0",
    "#30336B",
    "#95AFC0",
    "#F38181",
    "#FCE77D",
    "#A8E6CF",
    "#3DC1D3",
    "#574B90",
    "#EE5A6F",
    "#C44569",
    "#F8EFBA",
    "#FF6348",
    "#FF4757",
    "#2ED573",
    "#1E90FF",
    "#3742FA",
    "#5F27CD",
    "#00D2D3",
    "#01A3A4",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div className="h-4 w-4 rounded !bg-center !bg-cover transition-all border" style={{ background }}></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">{background ? background.toUpperCase() : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-wrap gap-2">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="rounded-md h-6 w-6 cursor-pointer active:scale-105 border"
              onClick={() => setBackground(s)}
            />
          ))}
        </div>

        <Input id="custom" value={background} className="h-8 mt-4" onChange={(e) => setBackground(e.currentTarget.value)} />
      </PopoverContent>
    </Popover>
  );
}
