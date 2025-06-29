"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  LayoutGrid,
  List,
  Users,
  Settings,
  Filter,
  PlusCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
  FolderKanban,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Sparkles,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProjectKanbanView } from "@/components/project-views/project-kanban-view"
import { ProjectListView } from "@/components/project-views/project-list-view"
import { ProjectResourceView } from "@/components/project-views/project-resource-view"
import { ProjectSettingsModal } from "@/components/modals/project-settings-modal"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjectStore } from "@/stores/project-store"
import { useProjects } from "@/hooks/use-projects"
import { useTeam } from "@/hooks/use-team"

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialClientId = searchParams.get("clientId")

  // Local state (UI-specific state that doesn't need to be shared)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  // Global state from Zustand
  const {
    activeView,
    setActiveView,
    filterStatus,
    filterAssignee,
    searchQuery,
    groupBy,
    setSearchQuery,
    toggleStatusFilter,
    toggleAssigneeFilter,
    setGroupBy,
    resetFilters,
  } = useProjectStore()

  // Use custom hooks for API calls
  const { projects, loading, error, updateFilters, fetchProjects } = useProjects({
    status: filterStatus,
    assignee: filterAssignee,
    search: searchQuery,
    clientId: initialClientId || undefined,
  })

  const { teamMembers } = useTeam()

  // Effect to open create modal if clientId is provided
  useEffect(() => {
    if (initialClientId) {
      setCreateModalOpen(true)
    }
  }, [initialClientId])

  // Update URL when view changes
  const handleViewChange = (view: string) => {
    // 현재 활성화된 뷰와 같은 뷰를 선택한 경우 아무 작업도 하지 않음
    if (activeView === view) return

    setActiveView(view as any)
    router.push(`/projects?view=${view}`, { scroll: false })
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search toggle
  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded)
    if (searchExpanded && searchQuery) {
      setSearchQuery("")
    }
  }

  // Project statuses
  const statuses = ["계획", "진행 중", "검토 중", "완료"]

  return (
    <div className="space-y-4 w-full">
      {/* Simple Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 shadow-lg">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                프로젝트
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">모든 프로젝트를 관리하고 진행 상황을 추적하세요</p>
            </div>
          </div>
          
          {/* Simple Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">완료 {projects.filter(p => p.status === "완료").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">진행 중 {projects.filter(p => p.status === "진행 중").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">전체 {projects.length}</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSettingsModalOpen(true)}
            className="h-10 px-4"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">설정</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-10 px-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">새 프로젝트</span>
            <span className="sm:hidden">추가</span>
          </Button>
        </div>
      </div>

      {/* Simple Filters and view controls */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Enhanced Search with Animation */}
            <div className="flex items-center gap-2">
              <div className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                searchExpanded ? "w-full sm:w-80 opacity-100" : "w-0 opacity-0"
              }`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  type="search"
                  placeholder="프로젝트명, 설명, 담당자로 검색..."
                  className="pl-10 h-10 w-full border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus={searchExpanded}
                />
              </div>
              <Button
                variant={searchExpanded ? "default" : "outline"}
                size="icon"
                className="h-10 w-10 shrink-0 transition-all duration-200 hover:scale-105"
                onClick={handleSearchToggle}
              >
                {searchExpanded ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Enhanced Filter Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`gap-2 h-10 transition-all duration-200 ${
                    (filterStatus.length > 0 || filterAssignee.length > 0) 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "hover:bg-muted"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">필터</span>
                  {(filterStatus.length > 0 || filterAssignee.length > 0) && (
                    <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                      {filterStatus.length + filterAssignee.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="font-medium">필터 설정</span>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="p-2">
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 pb-2">프로젝트 상태</DropdownMenuLabel>
                  <div className="space-y-1">
                    {statuses.map((status) => (
                      <div
                        key={status}
                        className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleStatusFilter(status)
                        }}
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          filterStatus.includes(status) 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-muted-foreground/30"
                        }`}>
                          {filterStatus.includes(status) && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm">{status}</span>
                      </div>
                    ))}
                  </div>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup className="p-2">
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 pb-2">담당자</DropdownMenuLabel>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleAssigneeFilter(member.id)
                        }}
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          filterAssignee.includes(member.id) 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-muted-foreground/30"
                        }`}>
                          {filterAssignee.includes(member.id) && <Check className="h-3 w-3" />}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Group By Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 h-10 transition-all duration-200 hover:bg-muted"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">그룹화</span>
                  <div className="hidden sm:flex items-center gap-1 ml-1 px-2 py-1 bg-muted rounded text-xs">
                    {groupBy === "status" && "상태"}
                    {groupBy === "assignee" && "담당자"}
                    {groupBy === "priority" && "우선순위"}
                    {groupBy === "dueDate" && "마감일"}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span className="font-medium">그룹화 설정</span>
                </div>
                <DropdownMenuSeparator />
                <div className="space-y-1 p-2">
                  {[
                    { value: "status", label: "상태", icon: Target },
                    { value: "assignee", label: "담당자", icon: Users },
                    { value: "priority", label: "우선순위", icon: Activity },
                    { value: "dueDate", label: "마감일", icon: Calendar }
                  ].map((option) => {
                    const Icon = option.icon
                    const isSelected = groupBy === option.value
                    return (
                      <div
                        key={option.value}
                        className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors ${
                          isSelected 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setGroupBy(option.value)}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 ml-auto text-primary" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Enhanced View Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden lg:block">보기:</span>
            <div className="flex items-center p-1 bg-muted rounded-lg">
              <button
                onClick={() => handleViewChange("kanban")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeView === "kanban"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">칸반</span>
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeView === "list"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">리스트</span>
              </button>
              <button
                onClick={() => handleViewChange("resource")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeView === "resource"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">리소스</span>
              </button>
            </div>
          </div>
        </div>

        {/* Simple Active filters display */}
        {(filterStatus.length > 0 || filterAssignee.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            <span className="text-sm text-slate-600 dark:text-slate-400">활성 필터:</span>
            {filterStatus.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                {status}
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleStatusFilter(status)} />
              </Badge>
            ))}
            {filterAssignee.map((id) => {
              const member = teamMembers.find((m) => m.id === id)
              return member ? (
                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                  <Avatar className="h-4 w-4 mr-1">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  {member.name}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleAssigneeFilter(id)} />
                </Badge>
              ) : null
            })}
            <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={resetFilters}>
              모두 지우기
            </Button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="mb-4 text-red-500">
            <AlertCircle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium">데이터를 불러올 수 없습니다</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">{error}</p>
          <Button onClick={() => fetchProjects()}>다시 시도</Button>
        </div>
      )}

      {/* Project views */}
      {!loading && !error && (
        <div>
          {activeView === "kanban" && (
            <ProjectKanbanView projects={projects} groupBy={groupBy} statuses={statuses} teamMembers={teamMembers} />
          )}
          {activeView === "list" && <ProjectListView projects={projects} />}
          {activeView === "resource" && <ProjectResourceView projects={projects} teamMembers={teamMembers} />}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        initialClientId={initialClientId || undefined}
      />
      <ProjectSettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
    </div>
  )
}

// Check icon component
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// X icon component
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

// Alert icon component
function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
