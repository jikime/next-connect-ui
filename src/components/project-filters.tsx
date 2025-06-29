"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { useState } from "react"

export function ProjectFilters() {
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="프로젝트 검색..." className="w-full appearance-none pl-8 shadow-none" />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>상태</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>상태별 필터링</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("시작됨")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "시작됨"])
                } else {
                  setStatusFilter(statusFilter.filter((s) => s !== "시작됨"))
                }
              }}
            >
              시작됨
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("진행 중")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "진행 중"])
                } else {
                  setStatusFilter(statusFilter.filter((s) => s !== "진행 중"))
                }
              }}
            >
              진행 중
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("검토 중")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "검토 중"])
                } else {
                  setStatusFilter(statusFilter.filter((s) => s !== "검토 중"))
                }
              }}
            >
              검토 중
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("완료")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "완료"])
                } else {
                  setStatusFilter(statusFilter.filter((s) => s !== "완료"))
                }
              }}
            >
              완료
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? <SortAsc className="h-3.5 w-3.5" /> : <SortDesc className="h-3.5 w-3.5" />}
          <span>정렬</span>
        </Button>
      </div>
    </div>
  )
}
