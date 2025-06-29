"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Calendar, 
  Activity, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import type { Project } from "@/types/project"

interface ProjectListViewProps {
  projects: Project[]
}

export function ProjectListView({ projects }: ProjectListViewProps) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // 남은 일수 계산
  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}일 초과`, color: "text-red-500" }
    } else if (diffDays === 0) {
      return { text: "오늘 마감", color: "text-amber-500" }
    } else {
      return { text: `${diffDays}일 남음`, color: diffDays <= 7 ? "text-amber-500" : "text-emerald-500" }
    }
  }

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "계획":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "진행 중":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "검토 중":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "완료":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // 진행률별 색상 (칸반과 동일)
  const getProgressColor = (progress: number) => {
    if (progress >= 80) {
      return "bg-gradient-to-r from-emerald-500 to-green-500"
    } else if (progress >= 50) {
      return "bg-gradient-to-r from-amber-500 to-orange-500"
    } else if (progress >= 25) {
      return "bg-gradient-to-r from-blue-500 to-indigo-500"
    } else {
      return "bg-gradient-to-r from-slate-400 to-slate-500"
    }
  }

  // 진행률별 텍스트 색상
  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) {
      return "text-emerald-600 dark:text-emerald-400"
    } else if (progress >= 50) {
      return "text-amber-600 dark:text-amber-400"
    } else if (progress >= 25) {
      return "text-blue-600 dark:text-blue-400"
    } else {
      return "text-slate-600 dark:text-slate-400"
    }
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // 테이블 컬럼 정의
  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 -ml-2 font-semibold"
          >
            프로젝트명
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate max-w-xs">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 -ml-2 font-semibold"
          >
            상태
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "progress",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 -ml-2 font-semibold"
          >
            진행률
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${getProgressColor(row.original.progress)}`}
              style={{ width: `${row.original.progress}%` }}
            />
          </div>
          <span className={`text-sm font-medium min-w-[35px] ${getProgressTextColor(row.original.progress)}`}>
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: "assignees",
      header: "담당자",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {row.original.assignees.slice(0, 3).map((assignee, i) => (
              <Avatar key={i} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={assignee.image || "/placeholder.svg"} alt={assignee.name} />
                <AvatarFallback className="text-xs">{assignee.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {row.original.assignees.length > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{row.original.assignees.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {row.original.assignees.length}명
          </span>
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 -ml-2 font-semibold"
          >
            마감일
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const remaining = getDaysRemaining(row.original.endDate)
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(row.original.endDate)}</span>
            </div>
            <div className={`text-xs font-medium ${remaining.color}`}>
              {remaining.text}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "tasks",
      header: "작업",
      cell: ({ row }) => (
        <div className="text-sm space-y-1">
          <div className="font-medium">
            {row.original.completedTasks}/{row.original.tasks}
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round((row.original.completedTasks / row.original.tasks) * 100)}% 완료
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleProjectClick(row.original.id)}>
              상세 보기
            </DropdownMenuItem>
            <DropdownMenuItem>편집</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleProjectClick, formatDate, getDaysRemaining, getStatusColor, getProgressColor, getProgressTextColor])

  // 테이블 설정
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const project = row.original
      const searchValue = filterValue.toLowerCase()
      return (
        project.name.toLowerCase().includes(searchValue) ||
        project.description.toLowerCase().includes(searchValue) ||
        project.status.toLowerCase().includes(searchValue) ||
        project.assignees.some(assignee => 
          assignee.name.toLowerCase().includes(searchValue)
        )
      )
    },
    state: {
      globalFilter,
      sorting,
    },
  })

  return (
    <div className="space-y-6">

      {/* 테이블 */}
      <div className="rounded-lg border bg-white dark:bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleProjectClick(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Activity className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {globalFilter ? "검색 결과가 없습니다" : "프로젝트가 없습니다"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {globalFilter ? "다른 키워드로 검색해보세요" : "새 프로젝트를 추가하세요"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 테이블 하단 정보 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          총 {table.getFilteredRowModel().rows.length}개 중 {table.getRowModel().rows.length}개 표시
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            <span>완료 {projects.filter(p => p.status === "완료").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>진행 중 {projects.filter(p => p.status === "진행 중").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
            <span>검토 중 {projects.filter(p => p.status === "검토 중").length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

