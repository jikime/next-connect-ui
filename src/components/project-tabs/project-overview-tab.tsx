import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  CheckSquare, 
  Clock, 
  FileText, 
  Plus,
  Target,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  Activity,
  BarChart3,
  CheckCircle2,
  CircleEllipsis,
  XCircle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Flag,
  Timer,
  Zap
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ProjectOverviewTabProps {
  project: any
}

export default function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd", { locale: ko })
  }

  // 활동 타입별 아이콘과 색상
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return { icon: MessageSquare, color: 'text-blue-500' }
      case 'complete':
        return { icon: CheckCircle2, color: 'text-emerald-500' }
      case 'issue':
        return { icon: AlertCircle, color: 'text-red-500' }
      case 'add':
        return { icon: Plus, color: 'text-purple-500' }
      case 'change':
        return { icon: Clock, color: 'text-amber-500' }
      default:
        return { icon: Activity, color: 'text-gray-500' }
    }
  }

  // 마일스톤 상태별 색상
  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case '완료':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
      case '진행 중':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case '예정됨':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // 진행률별 색상
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

  return (
    <div className="space-y-6">
      {/* 헤더 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-medium">전체 진행률</div>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{project.progress || 65}%</div>
            <Progress value={project.progress || 65} className="mt-2 h-2" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-medium">완료된 작업</div>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">15</div>
            <p className="text-sm text-muted-foreground mt-1">총 23개 중</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-medium">남은 기간</div>
              <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">45일</div>
            <p className="text-sm text-muted-foreground mt-1">2025.06.30 마감</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-medium">팀원</div>
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">4명</div>
            <p className="text-sm text-muted-foreground mt-1">활성 참여자</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 프로젝트 설명 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="text-lg font-semibold">프로젝트 개요</div>
              </div>
            </div>
            <div className="pt-6 p-6">
              <p className="text-muted-foreground leading-relaxed">
                {project.description || "2024년 제품 개발 로드맵 수립"}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">목표</span>
                  <span className="text-muted-foreground">새로운 웹사이트 디자인 및 개발 완료</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flag className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">우선순위</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                    높음
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">상태</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    진행 중
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 프로젝트 활동 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="text-lg font-semibold">최근 활동</div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  모두 보기 <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">프로젝트 활동 및 업데이트</p>
            </div>
            <div className="space-y-4 p-6 pt-0">
              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="이민수" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">이</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                    "bg-blue-500 text-white"
                  )}>
                    <MessageSquare className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">이민수</span>
                    <span className="text-sm text-muted-foreground">님이 댓글 작성</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">디자인 검토 완료했습니다. 수정사항 공유드립니다.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 10분 전
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> 디자인 검토 작업
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="박성준" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">박</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center bg-purple-500 text-white">
                    <FileText className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">박성준</span>
                    <span className="text-sm text-muted-foreground">님이 문서 수정</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">마케팅 전략 문서 업데이트 완료</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 30분 전
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> 마케팅 전략 문서
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="김지영" />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600">김</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                    "bg-emerald-500 text-white"
                  )}>
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">김지영</span>
                    <span className="text-sm text-muted-foreground">님이 작업 완료</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">로고 디자인 작업을 성공적으로 완료했습니다.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 1시간 전
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" /> 로고 디자인 작업
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="이민수" />
                    <AvatarFallback className="bg-red-100 text-red-600">이</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                    "bg-red-500 text-white"
                  )}>
                    <AlertCircle className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">이민수</span>
                    <span className="text-sm text-muted-foreground">님이 이슈 보고</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">API 통합 과정에서 발생한 오류를 보고했습니다.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2시간 전
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> API 통합 오류
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="박성준" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">박</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                    "bg-purple-500 text-white"
                  )}>
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">박성준</span>
                    <span className="text-sm text-muted-foreground">님이 작업 추가</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">사용자 테스트 계획 작업을 새로 추가했습니다.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 3시간 전
                    </span>
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3" /> 사용자 테스트 계획
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-gray-900">
                    <AvatarImage src="/abstract-profile.png" alt="김지영" />
                    <AvatarFallback className="bg-amber-100 text-amber-600">김</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                    "bg-amber-500 text-white"
                  )}>
                    <Clock className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">김지영</span>
                    <span className="text-sm text-muted-foreground">님이 마감일 변경</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">디자인 검토 작업의 마감일을 조정했습니다.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 5시간 전
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> 디자인 검토
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 마일스톤 섹션 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div className="text-lg font-semibold">마일스톤</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">주요 프로젝트 마일스톤 및 일정</p>
            </div>
            <div className="pt-6 p-6">
              <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
                      <h3 className="font-semibold text-lg">기획 단계 완료</h3>
                      <Badge className={getMilestoneStatusColor('완료')}>완료</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">프로젝트 범위 및 요구사항 정의</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">2023-11-15</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">진행률</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                  </div>
                  <div className="h-3 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-300" style={{width: '100%'}} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                      <h3 className="font-semibold text-lg">디자인 완료</h3>
                      <Badge className={getMilestoneStatusColor('진행 중')}>진행 중</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">UI/UX 디자인 및 프로토타입</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">2023-11-25</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">진행률</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">80%</span>
                  </div>
                  <div className="h-3 w-full bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{width: '80%'}} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                      <h3 className="font-semibold text-lg">개발 1차 완료</h3>
                      <Badge className={getMilestoneStatusColor('진행 중')}>진행 중</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">핵심 기능 구현</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-amber-700 dark:text-amber-300">2023-12-10</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">진행률</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">30%</span>
                  </div>
                  <div className="h-3 w-full bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300" style={{width: '30%'}} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded-full bg-slate-400 shadow-sm" />
                      <h3 className="font-semibold text-lg">베타 테스트</h3>
                      <Badge className={getMilestoneStatusColor('예정됨')}>예정됨</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">내부 및 외부 테스터 피드백</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">2023-12-20</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">진행률</span>
                    <span className="font-bold text-slate-600 dark:text-slate-400">0%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-300" style={{width: '0%'}} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500 shadow-sm" />
                      <h3 className="font-semibold text-lg">최종 출시</h3>
                      <Badge className={getMilestoneStatusColor('예정됨')}>예정됨</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">프로덕션 배포 및 런칭</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-purple-700 dark:text-purple-300">2024-01-15</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">진행률</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">0%</span>
                  </div>
                  <div className="h-3 w-full bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300" style={{width: '0%'}} />
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <div className="bg-card rounded-lg border p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">프로젝트 정보</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">상태</h3>
                <Badge className="mt-1">진행</Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">기획 단계</h3>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">우선순위</h3>
                <Badge variant="outline" className="mt-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
                  중간
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">시작일</h3>
                <div className="mt-1">2023-11-20</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">마감일</h3>
                <div className="mt-1">2023-12-20</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">진행률</h3>
                <div className="mt-1">
                  <Progress value={30} className="h-2" />
                  <div className="text-right text-xs text-muted-foreground mt-1">30%</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">작업</h3>
                <div className="mt-1">3/10 완료</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">팀</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-profile.png" alt="김지영" />
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">김지영</div>
                  <div className="text-xs text-muted-foreground">프로젝트 매니저</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-profile.png" alt="박성준" />
                  <AvatarFallback>박</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">박성준</div>
                  <div className="text-xs text-muted-foreground">디자이너</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">통계</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">완료된 작업</div>
                  <div className="text-2xl font-bold mt-1">15</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">진행 중</div>
                  <div className="text-2xl font-bold mt-1">5</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">지연됨</div>
                  <div className="text-2xl font-bold mt-1">2</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">완료율</div>
                  <div className="text-2xl font-bold mt-1">68%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
