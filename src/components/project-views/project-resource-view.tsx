"use client"

import { useState } from "react"
import { format, parseISO, differenceInDays } from "date-fns"
import { ko } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart3, PieChart, Calendar, Users, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
}

interface ProjectResourceViewProps {
  projects: Project[]
  teamMembers: TeamMember[]
}

export function ProjectResourceView({ projects, teamMembers }: ProjectResourceViewProps) {
  const [activeTab, setActiveTab] = useState("workload")

  // 프로젝트 상태 목록
  const statuses = ["계획", "진행 중", "검토 중", "완료"]

  // 팀원별 프로젝트 할당 계산
  const memberWorkloads = teamMembers.map((member) => {
    const assignedProjects = projects.filter((project) =>
      project.assignees.some((assignee) => assignee.id === member.id),
    )

    // 프로젝트 수 기준 워크로드 계산
    const projectCount = assignedProjects.length
    const projectWorkload = (projectCount / Math.max(projects.length, 1)) * 100

    // 작업 수 기준 워크로드 계산
    const taskCount = assignedProjects.reduce((sum, project) => sum + project.tasks, 0)
    const totalTasks = projects.reduce((sum, project) => sum + project.tasks, 0)
    const taskWorkload = (taskCount / Math.max(totalTasks, 1)) * 100

    // 프로젝트 기간 기준 워크로드 계산 (현재 진행 중인 프로젝트만)
    const now = new Date()
    const activeProjects = assignedProjects.filter((project) => {
      const startDate = parseISO(project.startDate)
      const endDate = parseISO(project.endDate)
      return startDate <= now && endDate >= now
    })

    // 워크로드 상태 결정
    let workloadStatus = "normal"
    if (projectWorkload > 80) {
      workloadStatus = "high"
    } else if (projectWorkload < 30) {
      workloadStatus = "low"
    }

    return {
      ...member,
      assignedProjects,
      activeProjects,
      projectCount,
      projectWorkload,
      taskCount,
      taskWorkload,
      workloadStatus,
    }
  })

  // 프로젝트 상태별 통계
  const statusStats = statuses.map((status) => {
    const count = projects.filter((project) => project.status === status).length
    const percentage = (count / Math.max(projects.length, 1)) * 100
    return { status, count, percentage }
  })

  // 워크로드 상태에 따른 색상 설정 (칸반과 일치)
  const getWorkloadColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-500 dark:text-red-400"
      case "low":
        return "text-emerald-500 dark:text-emerald-400"
      default:
        return "text-blue-500 dark:text-blue-400"
    }
  }

  // 프로젝트 상태에 따른 배지 색상 설정 (칸반과 일치)
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
      case "진행 중":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "검토 중":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "계획":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // 프로젝트 상태에 따른 인디케이터 색상 설정
  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-emerald-500"
      case "진행 중":
        return "bg-blue-500"
      case "검토 중":
        return "bg-amber-500"
      case "계획":
        return "bg-slate-500"
      default:
        return "bg-slate-500"
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

  return (
    <div className="space-y-6">
      {/* 커스텀 탭 UI (프로젝트 페이지와 동일한 스타일) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground hidden lg:block">리소스 관리:</span>
          <div className="flex items-center p-1 bg-muted rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("workload")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-initial justify-center sm:justify-start ${
                activeTab === "workload"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden xs:inline">워크로드</span>
            </button>
            <button
              onClick={() => setActiveTab("allocation")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-initial justify-center sm:justify-start ${
                activeTab === "allocation"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span className="hidden xs:inline">할당</span>
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 sm:flex-initial justify-center sm:justify-start ${
                activeTab === "timeline"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden xs:inline">타임라인</span>
            </button>
          </div>
        </div>
        
        {/* 전체 통계 요약 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">총 </span>
            <span>{projects.length}개 프로젝트</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{teamMembers.length}명 </span>
            <span className="sm:hidden">{teamMembers.length}명</span>
            <span className="hidden sm:inline">팀원</span>
          </div>
        </div>
      </div>

        {/* 워크로드 뷰 */}
        {activeTab === "workload" && (
          <div className="mt-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {memberWorkloads.map((member) => (
              <Card key={member.id} className="bg-white/80 dark:bg-card/80 border-slate-200/40 dark:border-slate-700/40 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 ring-2 ring-slate-200/40 dark:ring-slate-700/40">
                        <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">{member.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-0 font-medium",
                        member.workloadStatus === "high" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        member.workloadStatus === "normal" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        member.workloadStatus === "low" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      )}
                    >
                      {member.workloadStatus === "high" ? "높음" : member.workloadStatus === "low" ? "낮음" : "보통"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">프로젝트 워크로드</span>
                        <span className={`font-semibold ${getWorkloadColor(member.workloadStatus)}`}>
                          {member.projectCount}개 ({Math.round(member.projectWorkload)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            member.workloadStatus === "high" && "bg-gradient-to-r from-red-500 to-red-600",
                            member.workloadStatus === "normal" && "bg-gradient-to-r from-blue-500 to-indigo-500",
                            member.workloadStatus === "low" && "bg-gradient-to-r from-emerald-500 to-green-500",
                          )}
                          style={{ width: `${member.projectWorkload}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">작업 워크로드</span>
                        <span className="font-medium text-muted-foreground">
                          {member.taskCount}개 ({Math.round(member.taskWorkload)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-300"
                          style={{ width: `${member.taskWorkload}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">현재 프로젝트</h4>
                      <div className="space-y-2">
                        {member.assignedProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="flex items-center justify-between text-sm bg-slate-50/50 dark:bg-slate-800/30 rounded-md p-2 border border-slate-200/30 dark:border-slate-700/30">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getStatusIndicatorColor(project.status))} />
                              <span className="truncate font-medium">{project.name}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs ml-2 border-0 font-medium ${getProgressTextColor(project.progress)}`}>
                              {project.progress}%
                            </Badge>
                          </div>
                        ))}

                        {member.assignedProjects.length === 0 && (
                          <div className="text-sm text-muted-foreground">할당된 프로젝트 없음</div>
                        )}

                        {member.assignedProjects.length > 3 && (
                          <Button variant="ghost" size="sm" className="w-full text-xs">
                            +{member.assignedProjects.length - 3}개 더 보기
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        )}

        {/* 리소스 할당 뷰 */}
        {activeTab === "allocation" && (
          <div className="mt-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card className="bg-white/80 dark:bg-card/80 border-slate-200/40 dark:border-slate-700/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">프로젝트 상태별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusStats.map((stat) => (
                    <div key={stat.status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", getStatusIndicatorColor(stat.status))} />
                          <span className="font-medium">{stat.status}</span>
                        </div>
                        <span className="font-semibold text-muted-foreground">
                          {stat.count}개 ({Math.round(stat.percentage)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-300", getStatusIndicatorColor(stat.status))}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{projects.length}</div>
                      <div className="text-sm text-muted-foreground font-medium">총 프로젝트</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-card/80 border-slate-200/40 dark:border-slate-700/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">팀원별 프로젝트 할당</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberWorkloads.map((member) => (
                    <div key={member.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 ring-2 ring-slate-200/40 dark:ring-slate-700/40">
                            <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <span className="font-semibold text-muted-foreground">{member.assignedProjects.length}개</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${(member.assignedProjects.length / Math.max(...memberWorkloads.map((m) => m.assignedProjects.length), 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">리소스 할당 통계</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-200/40 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/30 p-3">
                      <div className="text-xs text-muted-foreground font-medium">평균 프로젝트 수</div>
                      <div className="text-xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {(projects.length / Math.max(teamMembers.length, 1)).toFixed(1)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200/40 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/30 p-3">
                      <div className="text-xs text-muted-foreground font-medium">최대 할당</div>
                      <div className="text-xl font-bold mt-1 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {Math.max(...memberWorkloads.map((m) => m.assignedProjects.length), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        )}

        {/* 타임라인 뷰 */}
        {activeTab === "timeline" && (
          <div className="mt-6">
            <Card className="bg-white/80 dark:bg-card/80 border-slate-200/40 dark:border-slate-700/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">프로젝트 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => {
                  const startDate = parseISO(project.startDate)
                  const endDate = parseISO(project.endDate)
                  const duration = differenceInDays(endDate, startDate) + 1
                  const now = new Date()
                  const isActive = startDate <= now && endDate >= now
                  const isPast = endDate < now
                  const isFuture = startDate > now

                  return (
                    <div key={project.id} className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/40 dark:border-slate-700/40 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full",
                              isActive ? "bg-blue-500" : isPast ? "bg-emerald-500" : "bg-slate-500",
                            )}
                          />
                          <span className="font-semibold">{project.name}</span>
                          <Badge variant="outline" className={`border-0 font-medium ${getStatusBadgeColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-muted-foreground">
                            {format(startDate, "yyyy.MM.dd", { locale: ko })} ~
                            {format(endDate, "yyyy.MM.dd", { locale: ko })}
                          </span>
                          <Badge variant="outline" className="ml-1 border-slate-300 dark:border-slate-600 font-medium">
                            {duration}일
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              getProgressColor(project.progress)
                            )}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold min-w-[40px] text-right ${getProgressTextColor(project.progress)}`}>
                          {project.progress}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex -space-x-2">
                          {project.assignees.map((assignee, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-background ring-1 ring-slate-200 dark:ring-slate-700">
                              <AvatarImage src={assignee.image || "/placeholder.svg"} alt={assignee.name} />
                              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">{assignee.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={cn(
                            "font-medium",
                            isActive ? "text-blue-600 dark:text-blue-400" : 
                            isPast ? "text-emerald-600 dark:text-emerald-400" : 
                            "text-slate-600 dark:text-slate-400"
                          )}>
                            {isActive ? "진행 중" : isPast ? "완료됨" : "예정됨"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {projects.length === 0 && (
                  <div className="py-8 text-center">
                    <div className="mb-2 text-muted-foreground font-medium">등록된 프로젝트가 없습니다.</div>
                  </div>
                )}
              </div>
            </CardContent>
            </Card>
          </div>
        )}
    </div>
  )
}
