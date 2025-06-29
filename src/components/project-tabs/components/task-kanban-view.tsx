"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, GripVertical } from "lucide-react"
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

interface TaskKanbanViewProps {
  tasks: Task[]
  statuses: string[]
  onTaskClick: (taskId: string) => void
  onAddTask: (status: string) => void
  getStatusLabel: (status: string) => string
  formatDate: (dateString: string) => string
  getDaysRemaining: (dateString: string) => { text: string; color: string }
  getPriorityBadge: (priority: string) => React.ReactNode
}

function SortableTaskCard({ 
  task, 
  onTaskClick, 
  formatDate, 
  getDaysRemaining, 
  getPriorityBadge 
}: {
  task: Task
  onTaskClick: (taskId: string) => void
  formatDate: (dateString: string) => string
  getDaysRemaining: (dateString: string) => { text: string; color: string }
  getPriorityBadge: (priority: string) => React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const remaining = getDaysRemaining(task.dueDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onTaskClick(task.id)}
      {...attributes}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
        <div
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.image || "/placeholder.svg"} alt={task.assignee.name} />
            <AvatarFallback className="text-xs">{task.assignee.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
        </div>
        {getPriorityBadge(task.priority)}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">진행률</span>
          <span className="font-medium">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">{formatDate(task.dueDate)}</span>
          <span className={remaining.color}>{remaining.text}</span>
        </div>
      </div>
    </div>
  )
}

function DroppableColumn({ 
  status, 
  tasks, 
  getStatusLabel, 
  onAddTask, 
  onTaskClick,
  formatDate,
  getDaysRemaining,
  getPriorityBadge
}: {
  status: string
  tasks: Task[]
  getStatusLabel: (status: string) => string
  onAddTask: (status: string) => void
  onTaskClick: (taskId: string) => void
  formatDate: (dateString: string) => string
  getDaysRemaining: (dateString: string) => { text: string; color: string }
  getPriorityBadge: (priority: string) => React.ReactNode
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <div className="flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{getStatusLabel(status)}</h3>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddTask(status)}
          className="h-8 w-8 p-0"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 p-4 space-y-3 min-h-[400px]"
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              formatDate={formatDate}
              getDaysRemaining={getDaysRemaining}
              getPriorityBadge={getPriorityBadge}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function TaskKanbanView({ 
  tasks, 
  statuses, 
  onTaskClick, 
  onAddTask,
  getStatusLabel,
  formatDate,
  getDaysRemaining,
  getPriorityBadge
}: TaskKanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const tasksByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = tasks.filter(task => task.status === status)
      return acc
    }, {} as Record<string, Task[]>)
  }, [tasks, statuses])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // 여기서 실제 상태 업데이트 로직을 구현
    console.log(`Task ${activeId} moved to ${overId}`)
  }

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status} className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
            <DroppableColumn
              status={status}
              tasks={tasksByStatus[status] || []}
              getStatusLabel={getStatusLabel}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
              formatDate={formatDate}
              getDaysRemaining={getDaysRemaining}
              getPriorityBadge={getPriorityBadge}
            />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <SortableTaskCard
            task={activeTask}
            onTaskClick={onTaskClick}
            formatDate={formatDate}
            getDaysRemaining={getDaysRemaining}
            getPriorityBadge={getPriorityBadge}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}