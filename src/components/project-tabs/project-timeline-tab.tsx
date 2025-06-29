"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, BarChart2, Users, FileText, Settings, Plus, Filter, ChevronDown, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "in-progress" | "upcoming"
  category: "milestone" | "task" | "meeting" | "other"
}

interface ProjectTimelineTabProps {
  project: any
}

export function ProjectTimelineTab({ project }: ProjectTimelineTabProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd", { locale: ko })
  }

  // 타임라인 이벤트 데이터
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      date: project.startDate || "2023-11-15",
      title: "프로젝트 시작",
      description: "프로젝트가 공식적으로 시작되었습니다.",
      icon: <Clock className="h-5 w-5" />,
      status: "completed",
      category: "milestone",
    },
    {
      id: "2",
      date: "2023-11-25",
      title: "팀 구성 완료",
      description: "프로젝트 팀 구성이 완료되었습니다.",
      icon: <Users className="h-5 w-5" />,
      status: "completed",
      category: "milestone",
    },
    {
      id: "3",
      date: "2023-12-05",
      title: "요구사항 정의 완료",
      description: "프로젝트 요구사항 정의가 완료되었습니다.",
      icon: <FileText className="h-5 w-5" />,
      status: "completed",
      category: "milestone",
    },
    {
      id: "4",
      date: "2023-12-15",
      title: "디자인 시안 검토",
      description: "UI/UX 디자인 시안 검토 미팅",
      icon: <FileText className="h-5 w-5" />,
      status: "completed",
      category: "meeting",
    },
    {
      id: "5",
      date: "2024-01-10",
      title: "개발 환경 구축",
      description: "개발 환경 및 인프라 구축 완료",
      icon: <Settings className="h-5 w-5" />,
      status: "in-progress",
      category: "task",
    },
    {
      id: "6",
      date: project.endDate || "2024-02-28",
      title: "프로젝트 완료 예정",
      description: "프로젝트 완료 목표일입니다.",
      icon: <Settings className="h-5 w-5" />,
      status: "upcoming",
      category: "milestone",
    },
  ])

  // 필터 상태
  const [filters, setFilters] = useState({
    status: {
      completed: true,
      "in-progress": true,
      upcoming: true,
    },
    category: {
      milestone: true,
      task: true,
      meeting: true,
      other: true,
    },
  })

  // 뷰 타입 (타임라인/캘린더)
  const [viewType, setViewType] = useState<"timeline" | "list">("timeline")

  // 필터링된 이벤트
  const filteredEvents = events.filter((event) => filters.status[event.status] && filters.category[event.category])

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            완료
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            진행 중
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            예정
          </Badge>
        )
      default:
        return null
    }
  }

  // 카테고리에 따른 배지
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "milestone":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            마일스톤
          </Badge>
        )
      case "task":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            작업
          </Badge>
        )
      case "meeting":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            미팅
          </Badge>
        )
      case "other":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            기타
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold">프로젝트 타임라인</h2>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* 필터 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                필터
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 font-medium">상태</div>
              <DropdownMenuCheckboxItem
                checked={filters.status.completed}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, status: { ...filters.status, completed: checked } })
                }
              >
                완료
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status["in-progress"]}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, status: { ...filters.status, "in-progress": checked } })
                }
              >
                진행 중
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status.upcoming}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, status: { ...filters.status, upcoming: checked } })
                }
              >
                예정
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <div className="p-2 font-medium">카테고리</div>
              <DropdownMenuCheckboxItem
                checked={filters.category.milestone}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, category: { ...filters.category, milestone: checked } })
                }
              >
                마일스톤
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.category.task}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, category: { ...filters.category, task: checked } })
                }
              >
                작업
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.category.meeting}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, category: { ...filters.category, meeting: checked } })
                }
              >
                미팅
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.category.other}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, category: { ...filters.category, other: checked } })
                }
              >
                기타
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 뷰 타입 전환 */}
          <Tabs
            value={viewType}
            onValueChange={(value) => setViewType(value as "timeline" | "list")}
            className="w-auto"
          >
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="timeline" className="px-3">
                <BarChart2 className="h-4 w-4 mr-1" />
                타임라인
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <Calendar className="h-4 w-4 mr-1" />
                목록
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 이벤트 추가 버튼 */}
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" />
            이벤트 추가
          </Button>
        </div>
      </div>

      {/* 타임라인 뷰 */}
      {viewType === "timeline" && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-primary-foreground transition-all group-hover:scale-110 ${
                        event.status === "completed"
                          ? "bg-green-500"
                          : event.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                      }`}
                    >
                      {event.icon}
                    </div>
                    {index < filteredEvents.length - 1 && (
                      <div
                        className={`h-full w-0.5 mt-2 ${
                          event.status === "completed"
                            ? "bg-green-200"
                            : event.status === "in-progress"
                              ? "bg-blue-200"
                              : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="bg-card rounded-lg border p-3 sm:p-4 flex-1 transition-all hover:shadow-md cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                      <div>
                        <div className="text-xs sm:text-sm font-medium">{formatDate(event.date)}</div>
                        <div className="text-base sm:text-lg font-semibold">{event.title}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(event.status)}
                        {getCategoryBadge(event.category)}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 목록 뷰 */}
      {viewType === "list" && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground ${
                      event.status === "completed"
                        ? "bg-green-500"
                        : event.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                    }`}
                  >
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{formatDate(event.date)}</div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {getStatusBadge(event.status)}
                    {getCategoryBadge(event.category)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
