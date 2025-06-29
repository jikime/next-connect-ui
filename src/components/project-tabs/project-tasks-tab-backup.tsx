"use client"

import { DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, LayoutGrid, List, GanttChartIcon, Calendar, MoreHorizontal, GripVertical, PlusCircle, ArrowUpDown, ArrowUp, ArrowDown, CheckSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import type { Task } from "@/components/gantt-chart"
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
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ProjectKanbanBoard } from "@/components/project-views/project-kanban-board"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { ProjectGanttModal } from "@/components/modals/project-gantt-modal"
import { GanttChart } from "@/components/gantt-chart"
import { TaskCalendar } from "@/components/task-calendar"
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

interface ProjectTasksTabProps {
  projectId: string
  onCreateTask?: () => void
  ganttTasks?: Task[]
  onTaskClick?: (taskId: string) => void
  onAddTask?: () => void
  onUpdateTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

export function ProjectTasksTab({
  projectId,
  onCreateTask,
  ganttTasks = [],
  onTaskClick,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ProjectTasksTabProps) {
  const [viewMode, setViewMode] = useState<"칸반" | "리스트" | "간트" | "일정">("칸반")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false)
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [ganttModalOpen, setGanttModalOpen] = useState(false)
  const [initialTaskStatus, setInitialTaskStatus] = useState<string | null>(null)
  const [ganttTasksState, setGanttTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        console.log(`작업 데이터 가져오기: projectId=${projectId}`)

        // 이미지에 맞는 더미 데이터 직접 설정
        const dummyTasks = [
          // 할 일 (To Do)
          {
            id: "1",
            title: "사용자 테스트 계획",
            description: "사용자 테스트 방법론 및 참가자 모집 계획 수립",
            status: "todo",
            priority: "high",
            dueDate: "2023-12-05",
            createdAt: "2023-11-20T09:00:00Z",
            updatedAt: "2023-12-01T14:30:00Z",
            projectId: "1",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },
          {
            id: "2",
            title: "API 문서화",
            description: "RESTful API 엔드포인트 문서화",
            status: "todo",
            priority: "low",
            dueDate: "2023-12-08",
            createdAt: "2023-11-25T11:00:00Z",
            updatedAt: "2023-11-25T11:00:00Z",
            projectId: "1",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            badge: "보통",
          },

          // 진행 중 (In Progress)
          {
            id: "3",
            title: "디자인 검토",
            description: "웹사이트 리뉴얼 디자인 검토 및 피드백",
            status: "in-progress",
            priority: "high",
            dueDate: "2023-11-25",
            createdAt: "2023-11-10T09:00:00Z",
            updatedAt: "2023-11-23T16:45:00Z",
            projectId: "1",
            assignee: {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },
          {
            id: "4",
            title: "로그인 기능 구현",
            description: "사용자 인증 및 로그인 기능 개발",
            status: "in-progress",
            priority: "medium",
            dueDate: "2023-11-30",
            createdAt: "2023-11-15T11:00:00Z",
            updatedAt: "2023-11-28T09:15:00Z",
            projectId: "1",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },

          // 검토 중 (In Review)
          {
            id: "5",
            title: "랜딩 페이지 디자인",
            description: "웹사이트 랜딩 페이지 디자인 및 레이아웃",
            status: "review",
            priority: "medium",
            dueDate: "2023-11-22",
            createdAt: "2023-11-10T14:00:00Z",
            updatedAt: "2023-11-20T17:30:00Z",
            projectId: "1",
            assignee: {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },

          // 완료 (Done)
          {
            id: "6",
            title: "요구사항 분석",
            description: "사용자 요구사항 수집 및 분석",
            status: "done",
            priority: "high",
            dueDate: "2023-11-15",
            createdAt: "2023-11-05T09:00:00Z",
            updatedAt: "2023-11-15T16:00:00Z",
            projectId: "1",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },
          {
            id: "7",
            title: "프로젝트 계획",
            description: "프로젝트 일정 및 리소스 계획 수립",
            status: "done",
            priority: "medium",
            dueDate: "2023-11-10",
            createdAt: "2023-11-01T10:00:00Z",
            updatedAt: "2023-11-10T15:30:00Z",
            projectId: "1",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            badge: "긴급",
          },
        ]

        // API 호출 대신 더미 데이터 사용
        setTasks(dummyTasks)
        console.log("작업 데이터 설정 완료:", dummyTasks)

        // 간트 차트용 더미 데이터 설정
        const ganttDummyTasks: Task[] = [
          {
            id: "task-1",
            title: "요구사항 분석",
            startDate: "2023-05-01",
            endDate: "2023-05-05",
            progress: 100,
            status: "완료",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "task-2",
            title: "디자인 시안 작업",
            startDate: "2023-05-03",
            endDate: "2023-05-12",
            progress: 60,
            status: "진행 중",
            assignee: {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-1"],
          },
          {
            id: "task-3",
            title: "프론트엔드 개발",
            startDate: "2023-05-08",
            endDate: "2023-05-20",
            progress: 30,
            status: "진행 중",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-2"],
          },
          {
            id: "task-4",
            title: "백엔드 API 개발",
            startDate: "2023-05-05",
            endDate: "2023-05-18",
            progress: 45,
            status: "진행 중",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-1"],
          },
          {
            id: "task-5",
            title: "데이터베이스 설계",
            startDate: "2023-05-02",
            endDate: "2023-05-07",
            progress: 100,
            status: "완료",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-1"],
          },
          {
            id: "task-6",
            title: "통합 테스트",
            startDate: "2023-05-19",
            endDate: "2023-05-25",
            progress: 0,
            status: "할 일",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-3", "task-4"],
          },
          {
            id: "task-7",
            title: "사용자 테스트",
            startDate: "2023-05-26",
            endDate: "2023-05-29",
            progress: 0,
            status: "할 일",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            dependencies: ["task-6"],
          },
        ]

        setGanttTasks(ganttDummyTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
        toast.error("작업을 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId])

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDetailModalOpen(true)
  }

  const handleAddTask = (status: string) => {
    setInitialTaskStatus(status)
    setCreateTaskModalOpen(true)
  }

  const handleTaskCreated = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
    setCreateTaskModalOpen(false)
    toast.success("작업이 성공적으로 생성되었습니다.")
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd", { locale: ko })
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "할 일"
      case "in-progress":
        return "진행 중"
      case "review":
        return "검토 중"
      case "done":
        return "완료"
      default:
        return status
    }
  }

  const getStatusValue = (label: string) => {
    switch (label) {
      case "할 일":
        return "todo"
      case "진행 중":
        return "in-progress"
      case "검토 중":
        return "review"
      case "완료":
        return "done"
      default:
        return label.toLowerCase()
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">긴급</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">중요</Badge>
      case "low":
        return <Badge variant="outline">일반</Badge>
      default:
        return null
    }
  }

  const getDaysRemaining = (dateString: string) => {
    if (!dateString) return { text: "날짜 없음", color: "text-slate-500" }
    
    const today = new Date()
    const dueDate = new Date(dateString)
    const diffTime = dueDate.getTime() - today.getTime()
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

  const getUpdatedTimeText = (updatedAt: string) => {
    const now = new Date()
    const updated = new Date(updatedAt)
    const diffTime = Math.abs(now.getTime() - updated.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "오늘 업데이트"
    if (diffDays === 1) return "어제 업데이트"
    return `${diffDays}일 전 업데이트`
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    )
  }

  // TaskKanbanView 컴포넌트
  interface TaskKanbanViewProps {
    tasks: any[]
    statuses: string[]
    onTaskClick: (taskId: string) => void
    onAddTask: (status: string) => void
    getStatusLabel: (status: string) => string
    formatDate: (dateString: string) => string
    getDaysRemaining: (dateString: string) => { text: string; color: string }
    getPriorityBadge: (priority: string) => React.ReactNode
  }

  function TaskKanbanView({
    tasks,
    statuses,
    onTaskClick,
    onAddTask,
    getStatusLabel,
    formatDate,
    getDaysRemaining,
    getPriorityBadge,
  }: TaskKanbanViewProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [overId, setOverId] = useState<string | null>(null)
    const [overType, setOverType] = useState<"task" | "column" | null>(null)

    // dnd-kit sensors
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
    )

    // 상태별 작업 그룹화
    const getTasksByStatus = (status: string) => {
      return tasks.filter((task) => task.status === status)
    }

    // 상태별 색상 설정
    const getStatusColor = (status: string) => {
      const colorMap: Record<string, { bg: string; border: string; header: string }> = {
        "todo": { 
          bg: "bg-slate-50/30 dark:bg-slate-950/30", 
          border: "border-slate-200/40 dark:border-slate-700/40", 
          header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" 
        },
        "in-progress": { 
          bg: "bg-blue-50/30 dark:bg-blue-950/30", 
          border: "border-blue-200/40 dark:border-blue-700/40", 
          header: "bg-blue-100/60 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300" 
        },
        "review": { 
          bg: "bg-amber-50/30 dark:bg-amber-950/30", 
          border: "border-amber-200/40 dark:border-amber-700/40", 
          header: "bg-amber-100/60 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300" 
        },
        "done": { 
          bg: "bg-emerald-50/30 dark:bg-emerald-950/30", 
          border: "border-emerald-200/40 dark:border-emerald-700/40", 
          header: "bg-emerald-100/60 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300" 
        }
      }
      return colorMap[status] || { bg: "bg-slate-50/30 dark:bg-slate-950/30", border: "border-slate-200/40 dark:border-slate-700/40", header: "bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" }
    }

    // 드래그 시작
    const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id as string)
    }

    // 드래그 오버
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

    // 드래그 종료
    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)
      setOverId(null)
      setOverType(null)

      if (!over) return

      const activeId = active.id as string
      const activeData = active.data.current
      const overData = over.data.current

      if (!activeData) return

      const sourceStatus = activeData.status
      let destinationStatus: string

      if (overData?.type === "column") {
        destinationStatus = overData.status
      } else if (overData?.type === "task") {
        destinationStatus = overData.status
      } else {
        return
      }

      // 상태가 다른 경우에만 업데이트
      if (sourceStatus !== destinationStatus) {
        // 여기에서 작업 상태 업데이트 로직 구현
        toast.success(`작업이 "${getStatusLabel(destinationStatus)}" 상태로 변경되었습니다.`)
      }
    }

    return (
      <div className="space-y-6">
        <div className="h-[calc(100vh-400px)] overflow-auto pb-6 bg-slate-50/20 dark:bg-slate-900/20 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 p-4 min-h-full">
              {statuses.map((status) => {
                const statusTasks = getTasksByStatus(status)
                const colors = getStatusColor(status)
                
                return (
                  <div 
                    key={status} 
                    className="flex flex-col flex-1 min-w-0"
                    style={{ 
                      minWidth: `calc((100% - ${(statuses.length - 1) * 1.5}rem) / ${statuses.length})`,
                      maxWidth: `calc((100% - ${(statuses.length - 1) * 1.5}rem) / ${statuses.length})`
                    }}
                  >
                    <div className={`mb-4 border rounded-md px-4 py-2 ${colors.header}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-sm tracking-wide">{getStatusLabel(status)}</h3>
                          <Badge variant="secondary" className="bg-white/40 dark:bg-black/40 text-current border-white/40 font-medium">
                            {statusTasks.length}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200 hover:scale-110"
                          onClick={() => onAddTask(status)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <SortableContext 
                      items={statusTasks.map(t => t.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <DroppableTaskColumn
                        id={status}
                        className={`flex flex-1 flex-col gap-4 min-h-[300px] rounded-md p-2 border transition-all duration-200 ${colors.bg} ${colors.border} border shadow-sm`}
                        aria-label={`${getStatusLabel(status)} 컬럼`}
                        activeId={activeId}
                        overId={overId}
                        overType={overType}
                        status={status}
                      >
                        {statusTasks.map((task, index) => (
                          <SortableTaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            status={status}
                            activeId={activeId}
                            overId={overId}
                            overType={overType}
                            formatDate={formatDate}
                            getDaysRemaining={getDaysRemaining}
                            getPriorityBadge={getPriorityBadge}
                            onTaskClick={onTaskClick}
                          />
                        ))}
                        {statusTasks.length === 0 && (
                          <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300/50 dark:border-slate-600/50 bg-white/20 dark:bg-black/10 transition-all duration-200 hover:bg-white/30 dark:hover:bg-black/20">
                            <div className="text-center">
                              <div className="mb-2 opacity-50">
                                <PlusCircle className="h-8 w-8 mx-auto" />
                              </div>
                              <p className="text-sm font-medium opacity-60">작업 없음</p>
                              <p className="text-xs opacity-40 mt-1">새 작업을 추가하세요</p>
                            </div>
                          </div>
                        )}
                      </DroppableTaskColumn>
                    </SortableContext>
                  </div>
                )
              })}
            </div>
            <DragOverlay>
              {activeId ? (
                <div className="bg-white dark:bg-card border rounded-lg shadow-2xl opacity-95 transform rotate-3 scale-105 ring-2 ring-primary/30">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">
                        {tasks.find(t => t.id === activeId)?.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tasks.find(t => t.id === activeId)?.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {tasks.find(t => t.id === activeId)?.priority} 우선순위
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

  // SortableTaskItem 컴포넌트
  interface SortableTaskItemProps {
    task: any
    index: number
    status: string
    activeId: string | null
    overId: string | null
    overType: "task" | "column" | null
    formatDate: (date: string) => string
    getDaysRemaining: (date: string) => { text: string; color: string }
    getPriorityBadge: (priority: string) => React.ReactNode
    onTaskClick: (taskId: string) => void
  }

  function SortableTaskItem({
    task,
    index,
    status,
    activeId,
    overId,
    overType,
    formatDate,
    getDaysRemaining,
    getPriorityBadge,
    onTaskClick,
  }: SortableTaskItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
        index,
        status,
      },
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const isDraggedOver = activeId && overId === task.id && overType === "task"

    return (
      <>
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
          aria-label={`${task.title} 작업`}
        >
          <div
            className={`bg-white dark:bg-card border rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
              isDragging ? "opacity-90 shadow-lg scale-105 ring-2 ring-primary/30" : ""
            } ${activeId === task.id ? "ring-2 ring-primary/50 shadow-md" : ""}`}
            onClick={() => !isDragging && onTaskClick(task.id)}
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
                  <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-muted/50"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="작업 메뉴"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTaskClick(task.id) }}>
                      상세 보기
                    </DropdownMenuItem>
                    <DropdownMenuItem>편집</DropdownMenuItem>
                    <DropdownMenuItem>삭제</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="p-3">
              <p className="mb-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <span className={`font-medium ${getDaysRemaining(task.dueDate).color}`}>
                  {getDaysRemaining(task.dueDate).text}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {task.assignee && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.image} alt={task.assignee.name} />
                      <AvatarFallback className="text-xs">{task.assignee.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs text-muted-foreground">{task.assignee?.name}</span>
                </div>
                {getPriorityBadge(task.priority)}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // DroppableTaskColumn 컴포넌트
  interface DroppableTaskColumnProps {
    id: string
    className?: string
    children: React.ReactNode
    "aria-label"?: string
    activeId: string | null
    overId: string | null
    overType: "task" | "column" | null
    status: string
  }

  function DroppableTaskColumn({ id, className, children, activeId, overId, overType, status, ...props }: DroppableTaskColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
      id: id,
      data: {
        type: "column",
        status: status,
      },
    })

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

  // TaskListView 컴포넌트 (프로젝트 리스트 뷰와 동일한 포맷)
  interface TaskListViewProps {
    tasks: any[]
    onTaskClick: (taskId: string) => void
  }

  function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])

    // 상태별 색상
    const getTaskStatusColor = (status: string) => {
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
          return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        default:
          return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }
    }

    // 테이블 컬럼 정의
    const columns = useMemo<ColumnDef<any>[]>(() => [
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
          <Badge className={`${getTaskStatusColor(row.original.status)}`}>
            {getStatusLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 -ml-2 font-semibold"
            >
              우선순위
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
          <Badge className={`${getPriorityColor(row.original.priority)}`}>
            {row.original.priority === "high" ? "긴급" : 
             row.original.priority === "medium" ? "중요" : "일반"}
          </Badge>
        ),
      },
      {
        accessorKey: "assignee",
        header: "담당자",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.assignee && (
              <>
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={row.original.assignee.image || "/placeholder.svg"} alt={row.original.assignee.name} />
                  <AvatarFallback className="text-xs">{row.original.assignee.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{row.original.assignee.name}</span>
              </>
            )}
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
    ], [onTaskClick, getTaskStatusColor, getPriorityColor])

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
          task.description.toLowerCase().includes(searchValue) ||
          getStatusLabel(task.status).toLowerCase().includes(searchValue) ||
          (task.assignee?.name && task.assignee.name.toLowerCase().includes(searchValue))
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
                      <CheckSquare className="h-8 w-8 text-muted-foreground mb-2" />
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
            총 {table.getFilteredRowModel().rows.length}개 중 {table.getRowModel().rows.length}개 표시
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

  return (
    <div className="space-y-6">
      {/* 작업 필터 및 뷰 컨트롤 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                모든 작업
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>모든 작업</DropdownMenuItem>
              <DropdownMenuItem>내 작업</DropdownMenuItem>
              <DropdownMenuItem>완료된 작업</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                담당자
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>모든 담당자</DropdownMenuItem>
              {/* 담당자 목록은 실제 데이터에 따라 동적으로 생성 */}
              <DropdownMenuItem>
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src="/abstract-profile.png" alt="김디자인" />
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
                김디자인
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src="/abstract-profile.png" alt="이개발" />
                  <AvatarFallback>이</AvatarFallback>
                </Avatar>
                이개발
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src="/abstract-profile.png" alt="박기획" />
                  <AvatarFallback>박</AvatarFallback>
                </Avatar>
                박기획
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="작업 검색..." className="pl-8 h-9 w-full sm:w-[200px]" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>우선순위</DropdownMenuItem>
              <DropdownMenuItem>상태</DropdownMenuItem>
              <DropdownMenuItem>마감일</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            size="sm"
            onClick={onCreateTask || (() => handleAddTask("todo"))}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />새 작업
          </Button>
        </div>
      </div>

      {/* 뷰 모드 선택 */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 border-b pb-2 min-w-[400px]">
          <Button
            variant={viewMode === "칸반" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("칸반")}
            className="rounded-md"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            칸반
          </Button>
          <Button
            variant={viewMode === "리스트" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("리스트")}
            className="rounded-md"
          >
            <List className="h-4 w-4 mr-2" />
            리스트
          </Button>
          <Button
            variant={viewMode === "간트" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("간트")}
            className="rounded-md"
          >
            <GanttChartIcon className="h-4 w-4 mr-2" />
            간트
          </Button>
          <Button
            variant={viewMode === "일정" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("일정")}
            className="rounded-md"
          >
            <Calendar className="h-4 w-4 mr-2" />
            일정
          </Button>
        </div>
      </div>

      {/* 작업 데이터 표시 */}
      <div className="mt-4">
        {viewMode === "칸반" ? (
          <TaskKanbanView 
            tasks={tasks}
            statuses={["todo", "in-progress", "review", "done"]}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            getStatusLabel={getStatusLabel}
            formatDate={formatDate}
            getDaysRemaining={getDaysRemaining}
            getPriorityBadge={getPriorityBadge}
          />
        ) : viewMode === "리스트" ? (
          <TaskListView 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
          />
        ) : viewMode === "간트" ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">간트 차트 보기</h3>
              <p className="text-muted-foreground mb-4">
                프로젝트의 간트 차트를 전체 화면으로 확인하세요
              </p>
              <Button onClick={() => setGanttModalOpen(true)} className="flex items-center gap-2">
                <GanttChartIcon className="h-4 w-4" />
                간트 차트 열기
              </Button>
            </div>
          </div>
        ) : (
          <TaskCalendar onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* 작업 상세 모달 */}
      {selectedTaskId && (
        <TaskDetailModal
          open={taskDetailModalOpen}
          onOpenChange={setTaskDetailModalOpen}
          taskId={selectedTaskId}
        />
      )}

      {/* 작업 생성 모달 */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onOpenChange={setCreateTaskModalOpen}
        projectId={projectId}
        initialStatus={initialTaskStatus || undefined}
        onTaskCreated={handleTaskCreated}
      />

      {/* 간트 차트 모달 */}
      <ProjectGanttModal
        open={ganttModalOpen}
        onOpenChange={setGanttModalOpen}
        projectId={projectId}
      />
    </div>
  )
}
