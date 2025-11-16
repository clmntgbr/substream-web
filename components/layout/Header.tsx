"use client";

import { Main } from "./Menu/Main";
import { User } from "./Menu/User";
import { ThemeToggle } from "./Theme/ThemeToggle";

export function Header() {
  return (
    <>
      <div className="bg-background/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center h-16">
          <div className="flex items-center gap-6">
            <Main />
          </div>

          <div className="flex-1 flex justify-center"></div>

          <div className="flex justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <User />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
