"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import ProjectOverviewTab from "@/components/project-tabs/project-overview-tab"
import { ProjectTasksTab } from "@/components/project-tabs/project-tasks-tab"
import { ProjectTeamTab } from "@/components/project-tabs/project-team-tab"
import { ProjectFilesTab } from "@/components/project-tabs/project-files-tab"
import { ProjectTimelineTab } from "@/components/project-tabs/project-timeline-tab"
import { ProjectSettingsTab } from "@/components/project-tabs/project-settings-tab"
import { ProjectRisksTab } from "@/components/project-tabs/project-risks-tab"
import ProjectResourcesTab from "@/components/project-tabs/project-resources-tab"
import {
  Settings,
  FileText,
  Video,
  Bell,
  Share2,
  MessageSquare,
  MoreHorizontal,
  Star,
  Calendar,
  Copy,
  Trash2,
  Pencil,
  FolderOpen,
  Users,
  Activity,
  CheckSquare,
  AlertCircle,
  BarChart3
} from "lucide-react"
import { ProjectGanttModal } from "@/components/modals/project-gantt-modal"
import { ProjectSettingsModal } from "@/components/modals/project-settings-modal"
import { ProjectDetailReportModal } from "@/components/modals/project-detail-report-modal"
import { VideoConferenceModal } from "@/components/modals/video-conference-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [ganttModalOpen, setGanttModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [videoConferenceOpen, setVideoConferenceOpen] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // 실제 구현에서는 API 호출
    const fetchProject = async () => {
      try {
        // 샘플 데이터
        setProject({
          id: projectId,
          name: "웹사이트 리디자인",
          description: "회사 웹사이트 리디자인 및 개발 프로젝트",
          startDate: "2025-01-15",
          endDate: "2025-06-30",
          status: "진행 중",
          progress: 65,
          manager: "김프로젝트",
          team: ["김디자인", "이개발", "박기획", "최모바일"],
          budget: 50000000,
          spent: 30000000,
          assignees: [
            {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            {
              id: "4",
              name: "최모바일",
              image: "/abstract-profile.png",
            },
          ],
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching project:", error)
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      {/* 심플한 헤더 섹션 */}
      <div className="bg-white dark:bg-slate-900">
        <div className="px-6 py-2">
          {/* 프로젝트 제목 및 액션 버튼 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h1>
                <button className="text-slate-400 hover:text-yellow-500">
                  <Star className="h-5 w-5" />
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{project.description}</p>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {project.status}
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">프로젝트 ID: {projectId}</span>
              </div>
            </div>
            
            {/* 액션 버튼들 */}
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setVideoConferenceOpen(true)}
              >
                <Video className="mr-2 h-4 w-4" />
                화상 회의
              </Button>
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                알림
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                공유
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                댓글
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">더 보기</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>프로젝트 편집</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>프로젝트 복제</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>프로젝트 삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        </div>
      </div>


      {/* 개선된 탭 네비게이션 */}
      <div className="px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {[
              { id: "overview", label: "개요", icon: Activity },
              { id: "tasks", label: "작업", icon: CheckSquare },
              { id: "team", label: "팀", icon: Users },
              { id: "files", label: "파일", icon: FileText },
              { id: "timeline", label: "타임라인", icon: Calendar },
              { id: "risks", label: "위험", icon: AlertCircle },
              { id: "resources", label: "리소스", icon: BarChart3 },
              { id: "settings", label: "설정", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="min-h-[500px]">
          {activeTab === "overview" && <ProjectOverviewTab project={project} />}
          {activeTab === "tasks" && <ProjectTasksTab projectId={projectId} />}
          {activeTab === "team" && <ProjectTeamTab project={project} onManageTeam={() => {}} />}
          {activeTab === "files" && <ProjectFilesTab project={project} />}
          {activeTab === "timeline" && <ProjectTimelineTab project={project} />}
          {activeTab === "risks" && <ProjectRisksTab projectId={projectId} />}
          {activeTab === "resources" && <ProjectResourcesTab project={project} />}
          {activeTab === "settings" && <ProjectSettingsTab project={project} />}
        </div>
      </div>

      <ProjectGanttModal open={ganttModalOpen} onOpenChange={setGanttModalOpen} projectId={projectId} />
      <ProjectSettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} projectId={projectId} />
      <ProjectDetailReportModal open={reportModalOpen} onOpenChange={setReportModalOpen} projectId={projectId} />
      <VideoConferenceModal
        open={videoConferenceOpen}
        onOpenChange={setVideoConferenceOpen}
        projectId={projectId}
        projectName={project.name}
        participants={project.assignees}
      />
    </div>
  )
}
