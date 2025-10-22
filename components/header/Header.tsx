"use client";

import Link from "next/link";
import { Logo } from "../Logo";
import { Main } from "./menu/Main";
import { User } from "./menu/User";
import { ModeToggle } from "./ModeToggle";
import Notifications from "./Notifications";

export function Header() {
  return (
    <>
      <div className="bg-background/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center h-16">
          <div className="flex items-center gap-6">
            <div className="relative">
              <span data-state="closed" data-slot="context-menu-trigger" className="flex flex-col gap-1.5">
                <Link className="transition-opacity hover:opacity-75" href="/">
                  <Logo width={100} height={100} />
                </Link>
              </span>
            </div>
            <Main />
          </div>

          <div className="flex-1 flex justify-center"></div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Notifications />
              <ModeToggle />
              <User />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
