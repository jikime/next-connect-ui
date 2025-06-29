"use client"

import type React from "react"

import { useState } from "react"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import { ko } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  startDate: string
  endDate: string
  assignees: {
    id: string
    name: string
    image: string
  }[]
  tasks: number
  completedTasks: number
}

interface ProjectGanttViewProps {
  projects: Project[]
}

export function ProjectGanttView({ projects }: ProjectGanttViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthsToShow, setMonthsToShow] = useState(3)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [resizingId, setResizingId] = useState<string | null>(null)
  const [resizeDirection, setResizeDirection] = useState<"start" | "end" | null>(null)

  // 날짜 범위 계산
  const dateRange = (() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(addMonths(currentDate, monthsToShow - 1))
    return eachDayOfInterval({ start, end })
  })()

  // 월별 날짜 그룹화
  const monthGroups = dateRange.reduce(
    (acc, date) => {
      const monthKey = format(date, "yyyy-MM")
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(date)
      return acc
    },
    {} as Record<string, Date[]>,
  )

  // 이전/다음 달로 이동
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      if (direction === "prev") {
        return addMonths(prevDate, -1)
      } else {
        return addMonths(prevDate, 1)
      }
    })
  }

  // 프로젝트 바 위치 및 너비 계산
  const calculateProjectPosition = (project: Project) => {
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)

    // 표시 범위 내에 있는지 확인
    const firstDate = dateRange[0]
    const lastDate = dateRange[dateRange.length - 1]

    if (endDate < firstDate || startDate > lastDate) {
      return { display: "none" }
    }

    // 시작일과 종료일이 표시 범위를 벗어나는 경우 조정
    const visibleStartDate = startDate < firstDate ? firstDate : startDate
    const visibleEndDate = endDate > lastDate ? lastDate : endDate

    // 위치 및 너비 계산
    const totalDays = dateRange.length
    const startDayIndex = Math.floor((visibleStartDate.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000))
    const endDayIndex = Math.floor((visibleEndDate.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000))

    const left = (startDayIndex / totalDays) * 100
    const width = ((endDayIndex - startDayIndex + 1) / totalDays) * 100

    return {
      left: `${left}%`,
      width: `${width}%`,
    }
  }

  // 프로젝트 상태에 따른 색상 설정
  const getProjectColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-green-500"
      case "진행 중":
        return "bg-blue-500"
      case "검토 중":
        return "bg-yellow-500"
      case "계획":
        return "bg-slate-500"
      default:
        return "bg-slate-500"
    }
  }

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    setDraggingId(projectId)
    document.addEventListener("mousemove", handleDragMove)
    document.addEventListener("mouseup", handleDragEnd)
  }

  // 드래그 이동 핸들러
  const handleDragMove = (e: MouseEvent) => {
    if (!draggingId) return
    // 실제 구현에서는 마우스 이동에 따라 프로젝트 일정 조정
  }

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    setDraggingId(null)
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)
  }

  // 크기 조절 시작 핸들러
  const handleResizeStart = (e: React.MouseEvent, projectId: string, direction: "start" | "end") => {
    e.preventDefault()
    e.stopPropagation()
    setResizingId(projectId)
    setResizeDirection(direction)
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // 크기 조절 이동 핸들러
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingId || !resizeDirection) return
    // 실제 구현에서는 마우스 이동에 따라 프로젝트 기간 조정
  }

  // 크기 조절 종료 핸들러
  const handleResizeEnd = () => {
    setResizingId(null)
    setResizeDirection(null)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {format(currentDate, "yyyy년 MM월", { locale: ko })} ~
              {format(addMonths(currentDate, monthsToShow - 1), "yyyy년 MM월", { locale: ko })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={monthsToShow === 1 ? "default" : "outline"} size="sm" onClick={() => setMonthsToShow(1)}>
            1개월
          </Button>
          <Button variant={monthsToShow === 3 ? "default" : "outline"} size="sm" onClick={() => setMonthsToShow(3)}>
            3개월
          </Button>
          <Button variant={monthsToShow === 6 ? "default" : "outline"} size="sm" onClick={() => setMonthsToShow(6)}>
            6개월
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* 헤더 - 월 표시 */}
          <div className="flex border-b">
            <div className="w-1/4 min-w-[200px] p-2 font-medium border-r">프로젝트</div>
            <div className="w-3/4 flex">
              {Object.entries(monthGroups).map(([monthKey, dates]) => (
                <div
                  key={monthKey}
                  className="border-r last:border-r-0 text-center py-2 font-medium"
                  style={{ width: `${(dates.length / dateRange.length) * 100}%` }}
                >
                  {format(dates[0], "yyyy년 MM월", { locale: ko })}
                </div>
              ))}
            </div>
          </div>

          {/* 헤더 - 일 표시 */}
          <div className="flex border-b">
            <div className="w-1/4 min-w-[200px] border-r"></div>
            <div className="w-3/4 flex">
              {dateRange.map((date, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 p-1 text-center text-xs border-r last:border-r-0",
                    date.getDay() === 0 || date.getDay() === 6 ? "bg-slate-50" : "",
                    isToday(date) ? "bg-blue-50" : "",
                    !isSameMonth(date, currentDate) && index < 15 ? "bg-slate-50" : "",
                    !isSameMonth(date, addMonths(currentDate, monthsToShow - 1)) && index > dateRange.length - 15
                      ? "bg-slate-50"
                      : "",
                  )}
                >
                  <div
                    className={cn(
                      "font-medium",
                      isToday(date) ? "text-blue-600" : "",
                      date.getDay() === 0 ? "text-red-500" : "",
                      date.getDay() === 6 ? "text-blue-500" : "",
                    )}
                  >
                    {format(date, "d", { locale: ko })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 프로젝트 목록 */}
          <div>
            {projects.map((project) => (
              <div key={project.id} className="flex border-b hover:bg-slate-50">
                {/* 프로젝트 정보 */}
                <div className="w-1/4 min-w-[200px] p-3 border-r flex items-center justify-between">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{project.status}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(project.startDate), "yyyy.MM.dd", { locale: ko })} ~
                        {format(new Date(project.endDate), "yyyy.MM.dd", { locale: ko })}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>상세 보기</DropdownMenuItem>
                      <DropdownMenuItem>편집</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 간트 차트 바 */}
                <div className="w-3/4 relative p-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute top-2 bottom-2 rounded-md cursor-pointer",
                            getProjectColor(project.status),
                            draggingId === project.id || resizingId === project.id
                              ? "ring-2 ring-offset-1 ring-blue-500"
                              : "",
                          )}
                          style={calculateProjectPosition(project)}
                          onMouseDown={(e) => handleDragStart(e, project.id)}
                        >
                          <div className="h-full flex items-center px-2 text-white text-xs truncate">
                            <span className="truncate">{project.name}</span>
                            <span className="ml-1 whitespace-nowrap">{project.progress}%</span>
                          </div>

                          {/* 크기 조절 핸들 */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize"
                            onMouseDown={(e) => handleResizeStart(e, project.id, "start")}
                          />
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize"
                            onMouseDown={(e) => handleResizeStart(e, project.id, "end")}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs">
                            {format(new Date(project.startDate), "yyyy년 MM월 dd일", { locale: ko })} ~
                            {format(new Date(project.endDate), "yyyy년 MM월 dd일", { locale: ko })}
                          </div>
                          <div className="text-xs">진행률: {project.progress}%</div>
                          <div className="text-xs">담당자: {project.assignees.map((a) => a.name).join(", ")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}

            {/* 프로젝트가 없을 경우 */}
            {projects.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <div className="mb-2">등록된 프로젝트가 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
