"use client"

import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  LogOutIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const [label, setLabel] = useState("personal")
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">Substream Web</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.firstname} {user.lastname}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {user.roles.join(", ")}
                  </span>
                </div>
                <Button variant="outline" onClick={logout} size="sm">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Actions disponibles</h2>
          <ButtonGroup>
            <ButtonGroup className="hidden sm:flex">
              <Button variant="outline" size="icon" aria-label="Go Back">
                <ArrowLeftIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Archive</Button>
              <Button variant="outline">Report</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Snooze</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More Options">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <MailCheckIcon />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArchiveIcon />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <ClockIcon />
                      Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CalendarPlusIcon />
                      Add to Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ListFilterPlusIcon />
                      Add to List
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TagIcon />
                        Label As...
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={label}
                          onValueChange={setLabel}
                        >
                          <DropdownMenuRadioItem value="personal">
                            Personal
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="work">
                            Work
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="other">
                            Other
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      <Trash2Icon />
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </main>
    </div>
  );
}
