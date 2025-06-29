"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Calendar, 
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

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate: string
  progress: number
  assignee: {
    id: string
    name: string
    image?: string
  }
}

interface TaskListViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

export function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
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
    } else if (diffDays === 1) {
      return { text: "내일 마감", color: "text-amber-500" }
    } else if (diffDays <= 7) {
      return { text: `${diffDays}일 남음`, color: "text-blue-500" }
    } else {
      return { text: `${diffDays}일 남음`, color: "text-slate-500" }
    }
  }

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "review":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "done":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // 상태 라벨
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return "할 일"
      case "in-progress": return "진행 중"
      case "review": return "검토 중"
      case "done": return "완료"
      default: return status
    }
  }

  // 우선순위 라벨
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "높음"
      case "medium": return "보통"
      case "low": return "낮음"
      default: return priority
    }
  }

  // 진행률별 색상
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

  // 테이블 컬럼 정의
  const columns = useMemo<ColumnDef<Task>[]>(() => [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 -ml-2 font-semibold"
          >
            작업명
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
          <div className="font-medium">{row.original.title}</div>
          {row.original.description && (
            <div className="text-sm text-muted-foreground truncate max-w-xs">
              {row.original.description}
            </div>
          )}
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
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: "우선순위",
      cell: ({ row }) => (
        <Badge className={`${getPriorityColor(row.original.priority)}`}>
          {getPriorityLabel(row.original.priority)}
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
          <span className="text-sm font-medium min-w-[35px]">
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: "assignee",
      header: "담당자",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border">
            <AvatarImage src={row.original.assignee.image || "/placeholder.svg"} alt={row.original.assignee.name} />
            <AvatarFallback className="text-xs">{row.original.assignee.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{row.original.assignee.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
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
        const remaining = getDaysRemaining(row.original.dueDate)
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(row.original.dueDate)}</span>
            </div>
            <div className={`text-xs font-medium ${remaining.color}`}>
              {remaining.text}
            </div>
          </div>
        )
      },
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
            <DropdownMenuItem onClick={() => onTaskClick(row.original.id)}>
              상세 보기
            </DropdownMenuItem>
            <DropdownMenuItem>편집</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onTaskClick])

  // 테이블 설정
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const task = row.original
      const searchValue = filterValue.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchValue) ||
        (task.description && task.description.toLowerCase().includes(searchValue)) ||
        task.status.toLowerCase().includes(searchValue) ||
        task.assignee.name.toLowerCase().includes(searchValue)
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
                  onClick={() => onTaskClick(row.original.id)}
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
                    <p className="text-sm font-medium text-muted-foreground">
                      {globalFilter ? "검색 결과가 없습니다" : "작업이 없습니다"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {globalFilter ? "다른 키워드로 검색해보세요" : "새 작업을 추가하세요"}
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
          총 {table.getFilteredRowModel().rows.length}개 작업
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            <span>완료 {tasks.filter(t => t.status === "done").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>진행 중 {tasks.filter(t => t.status === "in-progress").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
            <span>검토 중 {tasks.filter(t => t.status === "review").length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}