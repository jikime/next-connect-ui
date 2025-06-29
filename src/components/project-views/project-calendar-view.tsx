"use client"

import { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay,
} from "date-fns"
import { ko } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface ProjectCalendarViewProps {
  projects: Project[]
}

export function ProjectCalendarView({ projects }: ProjectCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // 이전/다음 달로 이동
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      if (direction === "prev") {
        return subMonths(prevDate, 1)
      } else {
        return addMonths(prevDate, 1)
      }
    })
  }

  // 현재 달의 날짜 범위 계산
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = monthStart
  const endDate = monthEnd

  // 달력에 표시할 날짜 배열 생성
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // 요일 헤더
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"]

  // 날짜별 프로젝트 그룹화
  const getProjectsByDate = (date: Date) => {
    return projects.filter((project) => {
      const projectStartDate = parseISO(project.startDate)
      const projectEndDate = parseISO(project.endDate)

      // 프로젝트 기간에 해당 날짜가 포함되는지 확인
      return (
        (date >= projectStartDate && date <= projectEndDate) ||
        isSameDay(date, projectStartDate) ||
        isSameDay(date, projectEndDate)
      )
    })
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

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{format(currentDate, "yyyy년 MM월", { locale: ko })}</span>
          </div>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />새 일정
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* 요일 헤더 */}
        {weekdays.map((day, i) => (
          <div
            key={`header-${day}`}
            className={cn(
              "font-medium text-center py-2",
              i === 0 ? "text-red-500" : "",
              i === 6 ? "text-blue-500" : "",
            )}
          >
            {day}
          </div>
        ))}

        {/* 날짜 그리드 */}
        {dateRange.map((date, i) => {
          const dayProjects = getProjectsByDate(date)

          return (
            <div
              key={i}
              className={cn(
                "min-h-[120px] p-1 border hover:bg-slate-50",
                !isSameMonth(date, currentDate) ? "bg-slate-50 text-muted-foreground" : "",
                isToday(date) ? "bg-blue-50 border-blue-200" : "",
              )}
            >
              <div
                className={cn(
                  "text-right mb-1 font-medium",
                  date.getDay() === 0 ? "text-red-500" : "",
                  date.getDay() === 6 ? "text-blue-500" : "",
                  !isSameMonth(date, currentDate) ? "text-muted-foreground" : "",
                )}
              >
                {format(date, "d", { locale: ko })}
              </div>

              <div className="space-y-1">
                {dayProjects.slice(0, 3).map((project) => (
                  <TooltipProvider key={project.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer hover:opacity-80",
                            getProjectColor(project.status),
                            "text-white",
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate">{project.name}</span>
                          </div>
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
                          <div className="flex items-center gap-1 text-xs">
                            <Badge variant="outline">{project.status}</Badge>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

                {dayProjects.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">+{dayProjects.length - 3}개 더 보기</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
