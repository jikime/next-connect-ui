"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, LayoutGrid, List, GanttChartIcon, Calendar } from "lucide-react"
import { toast } from "sonner"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { TaskCalendar } from "@/components/task-calendar"
import { TaskKanbanView } from "./components/task-kanban-view"
import { TaskListView } from "./components/task-list-view"
import { TaskGanttView } from "./components/task-gantt-view"

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

interface ProjectTasksTabProps {
  projectId: string
  onCreateTask?: () => void
}

export function ProjectTasksTab({ projectId, onCreateTask }: ProjectTasksTabProps) {
  const [viewMode, setViewMode] = useState<"칸반" | "리스트" | "간트" | "일정">("칸반")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false)
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [initialTaskStatus, setInitialTaskStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // 작업 데이터 로드
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        
        // 실제 구현에서는 API 호출
        const dummyTasks: Task[] = [
          {
            id: "1",
            title: "사용자 테스트 계획",
            description: "사용자 테스트 방법론 및 참가자 모집 계획 수립",
            status: "todo",
            priority: "high",
            dueDate: "2023-05-20",
            progress: 0,
            assignee: {
              id: "1",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "디자인 시스템 구축",
            description: "일관된 UI/UX를 위한 디자인 시스템 문서화",
            status: "in-progress",
            priority: "medium",
            dueDate: "2023-05-25",
            progress: 65,
            assignee: {
              id: "2",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "3",
            title: "API 문서 작성",
            description: "백엔드 API 엔드포인트 문서화 및 예시 코드 작성",
            status: "review",
            priority: "high",
            dueDate: "2023-05-22",
            progress: 90,
            assignee: {
              id: "3",
              name: "이개발",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "4",
            title: "코드 리뷰 가이드라인",
            description: "팀 내 코드 리뷰 프로세스 및 가이드라인 수립",
            status: "done",
            priority: "low",
            dueDate: "2023-05-18",
            progress: 100,
            assignee: {
              id: "4",
              name: "최리뷰어",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "5",
            title: "성능 최적화",
            description: "웹사이트 로딩 속도 개선 및 SEO 최적화",
            status: "in-progress",
            priority: "medium",
            dueDate: "2023-05-30",
            progress: 45,
            assignee: {
              id: "2",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "6",
            title: "보안 감사",
            description: "애플리케이션 보안 취약점 검사 및 개선",
            status: "todo",
            priority: "high",
            dueDate: "2023-05-28",
            progress: 0,
            assignee: {
              id: "5",
              name: "한보안",
              image: "/abstract-profile.png",
            },
          },
        ]

        setTasks(dummyTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
        toast.error("작업을 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId])

  // 이벤트 핸들러들
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDetailModalOpen(true)
  }

  const handleAddTask = (status?: string) => {
    setInitialTaskStatus(status || null)
    setCreateTaskModalOpen(true)
  }

  const handleTaskCreated = (newTask: any) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status || initialTaskStatus || "todo",
      priority: newTask.priority || "medium",
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      progress: 0,
      assignee: {
        id: newTask.assigneeId || "1",
        name: newTask.assigneeName || "미배정",
        image: "/abstract-profile.png",
      },
    }
    
    setTasks(prev => [...prev, task])
    toast.success("새 작업이 추가되었습니다.")
  }

  // 유틸리티 함수들
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return "할 일"
      case "in-progress": return "진행 중"
      case "review": return "검토 중"
      case "done": return "완료"
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
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

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    }
    const labels = { high: "높음", medium: "보통", low: "낮음" }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[priority as keyof typeof colors] || colors.medium}`}>
        {labels[priority as keyof typeof labels] || priority}
      </span>
    )
  }

  // 필터링된 작업
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">작업을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-2">오류가 발생했습니다</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="작업 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 모드 전환 */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {[
              { mode: "칸반" as const, icon: LayoutGrid, label: "칸반" },
              { mode: "리스트" as const, icon: List, label: "리스트" },
              { mode: "간트" as const, icon: GanttChartIcon, label: "간트" },
              { mode: "일정" as const, icon: Calendar, label: "일정" },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="h-8"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          <Button onClick={() => handleAddTask()} className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            작업 추가
          </Button>
        </div>
      </div>

      {/* 작업 컨텐츠 */}
      <div className="min-h-[500px]">
        {viewMode === "칸반" ? (
          <TaskKanbanView 
            tasks={filteredTasks}
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
            tasks={filteredTasks} 
            onTaskClick={handleTaskClick} 
          />
        ) : viewMode === "간트" ? (
          <TaskGanttView
            projectId={projectId}
            onTaskClick={handleTaskClick}
            onAddTask={() => handleAddTask()}
          />
        ) : (
          <TaskCalendar onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* 모달들 */}
      {selectedTaskId && (
        <TaskDetailModal
          open={taskDetailModalOpen}
          onOpenChange={setTaskDetailModalOpen}
          taskId={selectedTaskId}
        />
      )}

      <CreateTaskModal
        open={createTaskModalOpen}
        onOpenChange={setCreateTaskModalOpen}
        projectId={projectId}
        initialStatus={initialTaskStatus || undefined}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}