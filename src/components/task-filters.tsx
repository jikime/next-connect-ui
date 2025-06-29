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
import { Search, Filter, SortAsc, SortDesc, User } from "lucide-react"
import { useState } from "react"

export function TaskFilters() {
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="작업 검색..." className="w-full appearance-none pl-8 shadow-none" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>우선순위</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>우선순위별 필터링</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={priorityFilter.includes("높음")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPriorityFilter([...priorityFilter, "높음"])
                } else {
                  setPriorityFilter(priorityFilter.filter((p) => p !== "높음"))
                }
              }}
            >
              높음
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={priorityFilter.includes("중간")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPriorityFilter([...priorityFilter, "중간"])
                } else {
                  setPriorityFilter(priorityFilter.filter((p) => p !== "중간"))
                }
              }}
            >
              중간
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={priorityFilter.includes("낮음")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPriorityFilter([...priorityFilter, "낮음"])
                } else {
                  setPriorityFilter(priorityFilter.filter((p) => p !== "낮음"))
                }
              }}
            >
              낮음
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <User className="h-3.5 w-3.5" />
              <span>담당자</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>담당자별 필터링</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={assigneeFilter.includes("김디자인")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAssigneeFilter([...assigneeFilter, "김디자인"])
                } else {
                  setAssigneeFilter(assigneeFilter.filter((a) => a !== "김디자인"))
                }
              }}
            >
              김디자인
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={assigneeFilter.includes("이개발")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAssigneeFilter([...assigneeFilter, "이개발"])
                } else {
                  setAssigneeFilter(assigneeFilter.filter((a) => a !== "이개발"))
                }
              }}
            >
              이개발
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={assigneeFilter.includes("박기획")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAssigneeFilter([...assigneeFilter, "박기획"])
                } else {
                  setAssigneeFilter(assigneeFilter.filter((a) => a !== "박기획"))
                }
              }}
            >
              박기획
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={assigneeFilter.includes("정백엔드")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAssigneeFilter([...assigneeFilter, "정백엔드"])
                } else {
                  setAssigneeFilter(assigneeFilter.filter((a) => a !== "정백엔드"))
                }
              }}
            >
              정백엔드
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
