"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, PlusCircle, GripVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Project } from "@/types/project"
import type { TeamMember } from "@/types/team"
import { useProjectStore } from "@/stores/project-store"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useIsMobile } from "@/hooks/use-mobile"

interface ProjectKanbanViewProps {
  projects: Project[]
  groupBy: string
  statuses: string[]
  teamMembers: TeamMember[]
}

// 사용하지 않는 함수들 제거됨 - 새로운 순서 관리 시스템으로 대체

export function ProjectKanbanView({
  projects: initialProjects,
  groupBy,
  statuses,
  teamMembers,
}: ProjectKanbanViewProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [updatingProject, setUpdatingProject] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [overType, setOverType] = useState<"project" | "column" | null>(null)
  // 각 그룹별 프로젝트 순서를 관리하는 상태
  const [projectOrders, setProjectOrders] = useState<Record<string, string[]>>({})
  const router = useRouter()
  const isMobile = useIsMobile()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Get the selected project from the global store - only used for highlighting
  const { selectedProject } = useProjectStore()

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // 필터링된 프로젝트 목록 계산
  const filteredProjects = useCallback(() => {
    return projects
  }, [projects])

  // Status colors mapping
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, { bg: string; border: string; header: string }> = {
      "계획": { 
        bg: "bg-slate-50/30 dark:bg-slate-950/30", 
        border: "border-slate-200/40 dark:border-slate-700/40", 
        header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" 
      },
      "진행 중": { 
        bg: "bg-slate-50/30 dark:bg-slate-950/30", 
        border: "border-slate-200/40 dark:border-slate-700/40", 
        header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" 
      },
      "검토 중": { 
        bg: "bg-slate-50/30 dark:bg-slate-950/30", 
        border: "border-slate-200/40 dark:border-slate-700/40", 
        header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" 
      },
      "완료": { 
        bg: "bg-slate-50/30 dark:bg-slate-950/30", 
        border: "border-slate-200/40 dark:border-slate-700/40", 
        header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" 
      }
    }
    return colorMap[status] || { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
  }

  // 초기 프로젝트 순서 설정
  useEffect(() => {
    const initializeProjectOrders = () => {
      const orders: Record<string, string[]> = {}
      
      if (groupBy === "status") {
        statuses.forEach(status => {
          const statusProjects = projects.filter(p => p.status === status)
          orders[status] = statusProjects.map(p => p.id)
        })
      } else if (groupBy === "assignee") {
        teamMembers.forEach(member => {
          const memberProjects = projects.filter(p => p.assignees.some(a => a.id === member.id))
          orders[member.id] = memberProjects.map(p => p.id)
        })
        // 미배정 프로젝트
        const unassignedProjects = projects.filter(p => p.assignees.length === 0)
        if (unassignedProjects.length > 0) {
          orders["unassigned"] = unassignedProjects.map(p => p.id)
        }
      } else if (groupBy === "priority") {
        const priorities = ["높음", "중간", "낮음"]
        priorities.forEach(priority => {
          const priorityProjects = projects.filter(p => p.priority === priority)
          orders[priority] = priorityProjects.map(p => p.id)
        })
      } else if (groupBy === "dueDate") {
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        const nextMonth = new Date(today)
        nextMonth.setMonth(today.getMonth() + 1)

        const dueDateGroups = ["overdue", "thisWeek", "nextWeek", "future"]
        dueDateGroups.forEach(groupId => {
          let groupProjects: Project[] = []
          
          if (groupId === "overdue") {
            groupProjects = projects.filter(p => new Date(p.endDate) < today)
          } else if (groupId === "thisWeek") {
            groupProjects = projects.filter(p => {
              const endDate = new Date(p.endDate)
              return endDate >= today && endDate <= nextWeek
            })
          } else if (groupId === "nextWeek") {
            groupProjects = projects.filter(p => {
              const endDate = new Date(p.endDate)
              return endDate > nextWeek && endDate <= nextMonth
            })
          } else if (groupId === "future") {
            groupProjects = projects.filter(p => new Date(p.endDate) > nextMonth)
          }
          
          orders[groupId] = groupProjects.map(p => p.id)
        })
      }
      
      setProjectOrders(orders)
    }

    initializeProjectOrders()
  }, [projects, groupBy, statuses, teamMembers])

  // Group projects based on groupBy criteria with order preservation
  const getGroupedProjects = useCallback(() => {
    const filtered = filteredProjects()

    const sortProjectsByOrder = (groupProjects: Project[], groupId: string) => {
      const order = projectOrders[groupId] || []
      const sorted = [...groupProjects].sort((a, b) => {
        const indexA = order.indexOf(a.id)
        const indexB = order.indexOf(b.id)
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
      })
      return sorted
    }

    if (groupBy === "status") {
      return statuses.map((status) => {
        const statusProjects = filtered.filter((project) => project.status === status)
        return {
          id: status,
          title: status,
          projects: sortProjectsByOrder(statusProjects, status),
          colors: getStatusColor(status),
        }
      })
    }

    if (groupBy === "assignee") {
      const groups = teamMembers.map((member) => {
        const memberProjects = filtered.filter((project) => project.assignees.some((assignee) => assignee.id === member.id))
        return {
          id: member.id,
          title: member.name,
          avatar: member.image,
          projects: sortProjectsByOrder(memberProjects, member.id),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        }
      })

      // Add group for unassigned projects
      const unassignedProjects = filtered.filter((project) => project.assignees.length === 0)
      if (unassignedProjects.length > 0) {
        groups.push({
          id: "unassigned",
          title: "미배정",
          avatar: "",
          projects: sortProjectsByOrder(unassignedProjects, "unassigned"),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        } as any)
      }

      return groups
    }

    if (groupBy === "priority") {
      const priorities = ["높음", "중간", "낮음"]
      const priorityColors = {
        "높음": { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" },
        "중간": { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" },
        "낮음": { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
      }
      return priorities.map((priority) => {
        const priorityProjects = filtered.filter((project) => project.priority === priority)
        return {
          id: priority,
          title: priority,
          projects: sortProjectsByOrder(priorityProjects, priority),
          colors: priorityColors[priority as keyof typeof priorityColors] || { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        }
      })
    }

    if (groupBy === "dueDate") {
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)

      const dueDateGroups = [
        {
          id: "overdue",
          title: "기한 초과",
          projects: sortProjectsByOrder(filtered.filter((project) => new Date(project.endDate) < today), "overdue"),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        },
        {
          id: "thisWeek",
          title: "이번 주",
          projects: sortProjectsByOrder(filtered.filter((project) => {
            const endDate = new Date(project.endDate)
            return endDate >= today && endDate <= nextWeek
          }), "thisWeek"),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        },
        {
          id: "nextWeek",
          title: "다음 주",
          projects: sortProjectsByOrder(filtered.filter((project) => {
            const endDate = new Date(project.endDate)
            return endDate > nextWeek && endDate <= nextMonth
          }), "nextWeek"),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        },
        {
          id: "future",
          title: "이후",
          projects: sortProjectsByOrder(filtered.filter((project) => new Date(project.endDate) > nextMonth), "future"),
          colors: { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
        },
      ]

      return dueDateGroups
    }

    // Default to status grouping
    return statuses.map((status) => {
      const statusProjects = filtered.filter((project) => project.status === status)
      return {
        id: status,
        title: status,
        projects: sortProjectsByOrder(statusProjects, status),
        colors: getStatusColor(status),
      }
    })
  }, [filteredProjects, groupBy, statuses, teamMembers, projectOrders])

  const groupedProjects = getGroupedProjects()

  // 초기 프로젝트 상태 설정
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  // dnd-kit 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // dnd-kit 드래그 오버 핸들러
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!over) {
      setOverId(null)
      setOverType(null)
      return
    }

    const overData = over.data.current
    setOverId(over.id as string)
    setOverType(overData?.type || null)
  }

  // dnd-kit 드래그 종료 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)
    setOverType(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // 드래그된 프로젝트와 드롭 대상을 파싱
    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData) return

    const sourceColumnId = activeData.columnId
    const activeIndex = activeData.index
    let destinationColumnId: string
    let overIndex: number

    // 드롭 위치 계산
    if (overData?.type === "column") {
      // 빈 컬럼에 드롭하는 경우
      destinationColumnId = overData.columnId
      overIndex = 0 // 빈 컬럼의 첫 번째 위치
    } else if (overData?.type === "project") {
      // 프로젝트 위에 드롭하는 경우
      destinationColumnId = overData.columnId
      overIndex = overData.index
      
      // 같은 컬럼 내에서 아래쪽으로 이동하는 경우 인덱스 조정
      if (sourceColumnId === destinationColumnId && activeIndex < overIndex) {
        overIndex = overIndex - 1
      }
    } else {
      return
    }

    // 순서 정보 업데이트 함수
    const updateProjectOrders = (sourceId: string, destId: string, projectId: string, _sourceIndex: number, destIndex: number) => {
      setProjectOrders(prev => {
        const newOrders = { ...prev }
        
        if (sourceId === destId) {
          // 같은 컬럼 내에서 순서 변경
          const currentOrder = [...(newOrders[sourceId] || [])]
          const movedItemIndex = currentOrder.indexOf(projectId)
          if (movedItemIndex !== -1) {
            currentOrder.splice(movedItemIndex, 1)
            currentOrder.splice(destIndex, 0, projectId)
            newOrders[sourceId] = currentOrder
          }
        } else {
          // 다른 컬럼으로 이동
          const sourceOrder = [...(newOrders[sourceId] || [])]
          const destOrder = [...(newOrders[destId] || [])]
          
          // 소스에서 제거
          const sourceItemIndex = sourceOrder.indexOf(projectId)
          if (sourceItemIndex !== -1) {
            sourceOrder.splice(sourceItemIndex, 1)
          }
          // 대상에 추가
          destOrder.splice(destIndex, 0, projectId)
          
          newOrders[sourceId] = sourceOrder
          newOrders[destId] = destOrder
        }
        
        return newOrders
      })
    }

    // 같은 컬럼 내에서 순서만 변경하는 경우
    if (sourceColumnId === destinationColumnId) {
      updateProjectOrders(sourceColumnId, destinationColumnId, activeId, activeIndex, overIndex)
      
      toast.success("프로젝트 순서가 변경되었습니다.", {
        description: "프로젝트 순서 변경",
      })
      return
    }

    // 다른 컬럼으로 이동하는 경우
    if (groupBy === "status") {
      try {
        setUpdatingProject(activeId)

        // 먼저 순서 정보 업데이트 (즉시 UI 반영)
        updateProjectOrders(sourceColumnId, destinationColumnId, activeId, activeIndex, overIndex)

        // 프로젝트 상태 업데이트
        const updatedProjects = projects.map((project) => {
          if (project.id === activeId) {
            return { ...project, status: destinationColumnId }
          }
          return project
        })
        setProjects(updatedProjects)

        // API call to update project status
        const response = await fetch(`/api/projects/${activeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: destinationColumnId,
          }),
        })

        if (!response.ok) {
          throw new Error("프로젝트 상태 업데이트에 실패했습니다.")
        }

        const projectToMove = projects.find((project) => project.id === activeId)
        toast.success(`"${projectToMove?.name}" 프로젝트가 "${destinationColumnId}" 상태로 변경되었습니다.`, {
          description: "프로젝트 상태 변경",
        })
      } catch (err) {
        console.error("프로젝트 상태 업데이트 오류:", err)
        toast.error("프로젝트 상태를 업데이트하는 중 오류가 발생했습니다.", {
          description: "오류 발생",
        })

        // 오류 발생 시 원래 상태로 되돌림
        setProjects(initialProjects)
        // 순서 정보도 되돌림 (다시 초기화)
        const initOrders: Record<string, string[]> = {}
        statuses.forEach(status => {
          const statusProjects = initialProjects.filter(p => p.status === status)
          initOrders[status] = statusProjects.map(p => p.id)
        })
        setProjectOrders(initOrders)
      } finally {
        setUpdatingProject(null)
      }
    } else {
      // 다른 그룹화 방식일 때는 순서만 업데이트하고 알림 표시
      updateProjectOrders(sourceColumnId, destinationColumnId, activeId, activeIndex, overIndex)
      
      const draggedProject = projects.find((project) => project.id === activeId)
      toast.success(`"${draggedProject?.name}" 프로젝트가 "${destinationColumnId}" 그룹으로 이동되었습니다.`, {
        description: "프로젝트 이동됨",
      })
    }
  }

  // Date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}일 초과`, color: "text-red-500" }
    } else if (diffDays === 0) {
      return { text: "오늘 마감", color: "text-yellow-500" }
    } else {
      return { text: `${diffDays}일 남음`, color: diffDays <= 7 ? "text-yellow-500" : "text-green-500" }
    }
  }

  // Handle project click - navigate to project detail page
  const handleOpenProjectDetail = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`)
    },
    [router],
  )

  return (
    <div className="space-y-6">
      {/* 칸반 보드 */}
      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-320px)] overflow-auto pb-6 bg-slate-50/20 dark:bg-slate-900/20 rounded-lg border border-slate-200/40 dark:border-slate-700/40"
      >
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 p-4 min-h-full">
            {groupedProjects.map((group) => (
              <div 
                key={group.id} 
                className="flex flex-col flex-1 min-w-0"
                style={{ 
                  minWidth: `calc((100% - ${(groupedProjects.length - 1) * 1.5}rem) / ${groupedProjects.length})`,
                  maxWidth: `calc((100% - ${(groupedProjects.length - 1) * 1.5}rem) / ${groupedProjects.length})`
                }}
              >
                <div className={`mb-4 border rounded-md px-4 py-2 ${group.colors?.header || "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm tracking-wide">{group.title}</h3>
                      <Badge variant="secondary" className="bg-white/40 dark:bg-black/40 text-current border-white/40 font-medium">
                        {group.projects.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200 hover:scale-110">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <SortableContext 
                  items={group.projects.map(p => p.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableColumn
                    id={group.id}
                    className={`flex flex-1 flex-col gap-4 min-h-[300px] rounded-md p-2 border transition-all duration-200 ${
                      group.colors?.bg || "bg-slate-50/30 dark:bg-slate-950/30"
                    } ${
                      group.colors?.border || "border-slate-200/40 dark:border-slate-700/40"
                    } border shadow-sm`}
                    aria-label={`${group.title} 컬럼`}
                    activeId={activeId}
                    overId={overId}
                    overType={overType}
                  >
                    {group.projects.map((project, index) => (
                      <SortableProjectItem
                        key={project.id}
                        project={project}
                        index={index}
                        columnId={group.id}
                        updatingProject={updatingProject}
                        selectedProject={selectedProject}
                        activeId={activeId}
                        overId={overId}
                        overType={overType}
                        formatDate={formatDate}
                        getDaysRemaining={getDaysRemaining}
                        handleOpenProjectDetail={handleOpenProjectDetail}
                      />
                    ))}
                    {group.projects.length === 0 && (
                      <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300/50 dark:border-slate-600/50 bg-white/20 dark:bg-black/10 transition-all duration-200 hover:bg-white/30 dark:hover:bg-black/20">
                        <div className="text-center">
                          <div className="mb-2 opacity-50">
                            <PlusCircle className="h-8 w-8 mx-auto" />
                          </div>
                          <p className="text-sm font-medium opacity-60">프로젝트 없음</p>
                          <p className="text-xs opacity-40 mt-1">새 프로젝트를 추가하세요</p>
                        </div>
                      </div>
                    )}
                  </DroppableColumn>
                </SortableContext>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-white dark:bg-card border rounded-lg shadow-2xl opacity-95 transform rotate-3 scale-105 ring-2 ring-primary/30">
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">
                      {projects.find(p => p.id === activeId)?.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {projects.find(p => p.id === activeId)?.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {projects.find(p => p.id === activeId)?.progress}% 완료
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      이동 중...
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

// SortableProjectItem 컴포넌트
interface SortableProjectItemProps {
  project: Project
  index: number
  columnId: string
  updatingProject: string | null
  selectedProject: string | null
  activeId: string | null
  overId: string | null
  overType: "project" | "column" | null
  formatDate: (date: string) => string
  getDaysRemaining: (date: string) => { text: string; color: string }
  handleOpenProjectDetail: (id: string) => void
}

function SortableProjectItem({
  project,
  index,
  columnId,
  updatingProject,
  selectedProject,
  activeId,
  overId,
  overType,
  formatDate,
  getDaysRemaining,
  handleOpenProjectDetail,
}: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      type: "project",
      project,
      index,
      columnId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // 드롭 인디케이터 표시 여부 결정
  const isDraggedOver = activeId && overId === project.id && overType === "project"

  return (
    <>
      {/* 드롭 인디케이터 - 위쪽 */}
      {isDraggedOver && (
        <div className="h-2 w-full bg-primary/20 border-2 border-dashed border-primary rounded-sm mb-2 flex items-center justify-center">
          <div className="h-1 w-12 bg-primary rounded-full"></div>
        </div>
      )}
      
      <div
        ref={setNodeRef}
        style={style}
        className={`${isDragging ? "z-50 opacity-50" : ""} relative`}
        tabIndex={0}
        aria-label={`${project.name} 프로젝트`}
        aria-describedby={`진행률: ${project.progress}%, 마감일: ${formatDate(project.endDate)}`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOpenProjectDetail(project.id)
          }
        }}
      >
      <div
        className={`bg-white dark:bg-card border rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
          isDragging ? "opacity-90 shadow-lg scale-105 ring-2 ring-primary/30" : ""
        } ${updatingProject === project.id ? "border-primary ring-2 ring-primary/20 animate-pulse" : ""} ${
          selectedProject === project.id ? "border-primary ring-2 ring-primary/30 shadow-md" : ""
        } ${activeId === project.id ? "ring-2 ring-primary/50 shadow-md" : ""}`}
        onClick={() => !isDragging && handleOpenProjectDetail(project.id)}
      >
        <div className="p-3 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab touch-manipulation active:cursor-grabbing hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label="드래그 핸들"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">{project.name}</h4>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-muted/50"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="프로젝트 메뉴"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">메뉴</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenProjectDetail(project.id)
                  }}
                >
                  상세 보기
                </DropdownMenuItem>
                <DropdownMenuItem>편집</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">삭제</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-3">
          <p className="mb-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">진행률</span>
              <span className={`font-semibold ${
                project.progress >= 80 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : project.progress >= 50 
                  ? "text-amber-600 dark:text-amber-400" 
                  : project.progress >= 25
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}>
                {project.progress}%
              </span>
            </div>
            <div className="relative">
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    project.progress >= 80 
                      ? "bg-gradient-to-r from-emerald-500 to-green-500" 
                      : project.progress >= 50 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                      : project.progress >= 25
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-gradient-to-r from-slate-400 to-slate-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                  aria-label={`진행률 ${project.progress}%`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.endDate)}</span>
            </div>
            <span className={`font-medium ${getDaysRemaining(project.endDate).color}`}>
              {getDaysRemaining(project.endDate).text}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              {project.assignees.slice(0, 3).map((assignee, i) => (
                <Avatar key={i} className="h-7 w-7 border-2 border-background ring-1 ring-muted">
                  <AvatarImage src={assignee.image || "/placeholder.svg"} alt={assignee.name} />
                  <AvatarFallback className="text-xs">{assignee.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {project.assignees.length > 3 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{project.assignees.length - 3}
                </div>
              )}
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {project.completedTasks}/{project.tasks} 작업
            </Badge>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

// DroppableColumn 컴포넌트 - 빈 컬럼에서도 드롭이 가능하도록 함
interface DroppableColumnProps {
  id: string
  className?: string
  children: React.ReactNode
  "aria-label"?: string
  activeId: string | null
  overId: string | null
  overType: "project" | "column" | null
}

function DroppableColumn({ id, className, children, activeId, overId, overType, ...props }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      type: "column",
      columnId: id,
    },
  })

  // 드래그 중이고 이 컬럼이 드롭 대상인 경우
  const isDraggedOver = activeId && overId === id && overType === "column"
  
  return (
    <div
      ref={setNodeRef}
      className={`${className} relative ${
        isDraggedOver 
          ? "bg-primary/10 border-primary border-2 border-dashed shadow-lg" 
          : isOver 
          ? "bg-primary/5 border-primary/30" 
          : ""
      }`}
      {...props}
    >
      {/* 드롭 인디케이터 */}
      {isDraggedOver && (
        <div className="absolute inset-0 pointer-events-none bg-primary/5 rounded-md border-2 border-dashed border-primary/50 flex items-center justify-center z-10">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/30 text-sm font-medium">
            여기에 드롭하세요
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
