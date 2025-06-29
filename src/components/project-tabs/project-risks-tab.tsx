"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Risk {
  id: string
  title: string
  description: string
  probability: number // 0-100
  impact: number // 0-100
  score: number // probability * impact / 100
  status: "identified" | "monitoring" | "mitigated" | "occurred" | "closed"
  category: "schedule" | "resource" | "technical" | "scope" | "quality" | "budget"
  createdAt: string
  updatedAt: string
  assigneeId?: string
  assigneeName?: string
  assigneeImage?: string
  mitigationPlan?: string
  contingencyPlan?: string
}

interface ProjectRisksTabProps {
  projectId: string
}

export function ProjectRisksTab({ projectId }: ProjectRisksTabProps) {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchRisks = async () => {
      setLoading(true)
      try {
        // 실제 API 호출 대신 샘플 데이터 사용
        const sampleRisks: Risk[] = [
          {
            id: "risk-1",
            title: "핵심 개발자 이탈 위험",
            description: "프로젝트의 핵심 기술을 담당하는 개발자가 이탈할 경우 일정 지연 가능성 높음",
            probability: 30,
            impact: 90,
            score: 27, // 30 * 90 / 100
            status: "monitoring",
            category: "resource",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assigneeId: "user-1",
            assigneeName: "김관리",
            assigneeImage: "/abstract-profile.png",
            mitigationPlan: "핵심 기술 문서화 및 지식 공유 세션 정기적 진행",
            contingencyPlan: "외부 전문가 계약 준비 및 백업 인력 교육",
          },
          {
            id: "risk-2",
            title: "기술적 부채 증가",
            description: "빠른 개발 일정으로 인한 기술적 부채 증가로 유지보수 비용 증가 예상",
            probability: 70,
            impact: 60,
            score: 42, // 70 * 60 / 100
            status: "identified",
            category: "technical",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assigneeId: "user-2",
            assigneeName: "이개발",
            assigneeImage: "/abstract-profile.png",
            mitigationPlan: "코드 리뷰 강화 및 기술 부채 해소를 위한 스프린트 계획",
          },
          {
            id: "risk-3",
            title: "클라이언트 요구사항 변경",
            description: "프로젝트 진행 중 클라이언트의 요구사항 변경으로 인한 범위 확대 가능성",
            probability: 60,
            impact: 80,
            score: 48, // 60 * 80 / 100
            status: "monitoring",
            category: "scope",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assigneeId: "user-3",
            assigneeName: "박기획",
            assigneeImage: "/abstract-profile.png",
            mitigationPlan: "명확한 변경 관리 프로세스 수립 및 클라이언트와 정기적인 요구사항 검토 회의",
            contingencyPlan: "변경 요청에 대한 영향도 분석 템플릿 준비",
          },
          {
            id: "risk-4",
            title: "외부 API 의존성 위험",
            description: "핵심 기능이 외부 API에 의존하고 있어 서비스 중단 시 영향 큼",
            probability: 40,
            impact: 85,
            score: 34, // 40 * 85 / 100
            status: "mitigated",
            category: "technical",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assigneeId: "user-2",
            assigneeName: "이개발",
            assigneeImage: "/abstract-profile.png",
            mitigationPlan: "대체 API 공급자 확보 및 장애 대응 시나리오 준비",
            contingencyPlan: "오프라인 모드 지원 및 데이터 캐싱 전략 구현",
          },
          {
            id: "risk-5",
            title: "일정 지연 위험",
            description: "초기 단계에서 예상보다 많은 시간이 소요되어 전체 일정 지연 가능성",
            probability: 65,
            impact: 70,
            score: 45.5, // 65 * 70 / 100
            status: "occurred",
            category: "schedule",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assigneeId: "user-1",
            assigneeName: "김관리",
            assigneeImage: "/abstract-profile.png",
            mitigationPlan: "주간 진행 상황 점검 및 병목 구간 식별",
            contingencyPlan: "우선순위 재조정 및 필요시 범위 축소 계획",
          },
        ]

        setRisks(sampleRisks)
      } catch (error) {
        console.error("Failed to fetch risks:", error)
        toast.error("위험 요소를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchRisks()
  }, [projectId])

  const filteredRisks =
    activeTab === "all"
      ? risks
      : risks.filter((risk) => {
          if (activeTab === "high") return risk.score >= 40
          if (activeTab === "medium") return risk.score >= 20 && risk.score < 40
          if (activeTab === "low") return risk.score < 20
          if (activeTab === "mitigated") return risk.status === "mitigated" || risk.status === "closed"
          return true
        })

  const getStatusColor = (status: Risk["status"]) => {
    switch (status) {
      case "identified":
        return "bg-yellow-500"
      case "monitoring":
        return "bg-blue-500"
      case "mitigated":
        return "bg-green-500"
      case "occurred":
        return "bg-red-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: Risk["category"]) => {
    switch (category) {
      case "schedule":
        return <Clock className="h-4 w-4" />
      case "resource":
        return <AlertTriangle className="h-4 w-4" />
      case "technical":
        return <Shield className="h-4 w-4" />
      case "scope":
        return <AlertTriangle className="h-4 w-4" />
      case "quality":
        return <CheckCircle className="h-4 w-4" />
      case "budget":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: Risk["category"]) => {
    switch (category) {
      case "schedule":
        return "일정"
      case "resource":
        return "리소스"
      case "technical":
        return "기술"
      case "scope":
        return "범위"
      case "quality":
        return "품질"
      case "budget":
        return "예산"
      default:
        return category
    }
  }

  const getStatusLabel = (status: Risk["status"]) => {
    switch (status) {
      case "identified":
        return "식별됨"
      case "monitoring":
        return "모니터링 중"
      case "mitigated":
        return "완화됨"
      case "occurred":
        return "발생함"
      case "closed":
        return "종료됨"
      default:
        return status
    }
  }

  const getRiskSeverity = (score: number) => {
    if (score >= 40) return { label: "높음", color: "text-red-500" }
    if (score >= 20) return { label: "중간", color: "text-yellow-500" }
    return { label: "낮음", color: "text-green-500" }
  }

  // 위험 요약 통계
  const riskStats = {
    total: risks.length,
    high: risks.filter((risk) => risk.score >= 40).length,
    medium: risks.filter((risk) => risk.score >= 20 && risk.score < 40).length,
    low: risks.filter((risk) => risk.score < 20).length,
    mitigated: risks.filter((risk) => risk.status === "mitigated" || risk.status === "closed").length,
    active: risks.filter((risk) => risk.status !== "mitigated" && risk.status !== "closed").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 위험 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">위험 심각도</CardTitle>
            <CardDescription>위험 점수에 따른 분류</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">높음</span>
                <span className="text-sm text-red-500">{riskStats.high}</span>
              </div>
              <Progress
                value={(riskStats.high / riskStats.total) * 100}
                className="h-2 bg-red-100"
                indicatorClassName="bg-red-500"
              />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">중간</span>
                <span className="text-sm text-yellow-500">{riskStats.medium}</span>
              </div>
              <Progress
                value={(riskStats.medium / riskStats.total) * 100}
                className="h-2 bg-yellow-100"
                indicatorClassName="bg-yellow-500"
              />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">낮음</span>
                <span className="text-sm text-green-500">{riskStats.low}</span>
              </div>
              <Progress
                value={(riskStats.low / riskStats.total) * 100}
                className="h-2 bg-green-100"
                indicatorClassName="bg-green-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">위험 상태</CardTitle>
            <CardDescription>현재 위험 관리 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>활성 위험</span>
                <span className="font-medium">{riskStats.active}</span>
              </div>
              <div className="flex justify-between">
                <span>완화된 위험</span>
                <span className="font-medium">{riskStats.mitigated}</span>
              </div>
              <div className="flex justify-between">
                <span>총 위험 요소</span>
                <span className="font-medium">{riskStats.total}</span>
              </div>
              <Progress value={(riskStats.mitigated / riskStats.total) * 100} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">위험 관리 작업</CardTitle>
            <CardDescription>위험 관리를 위한 작업</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />새 위험 요소 추가
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                위험 완화 계획 관리
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 위험 목록 */}
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>위험 요소 목록</CardTitle>
          <div className="overflow-x-auto">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  전체 ({risks.length})
                </TabsTrigger>
                <TabsTrigger value="high" className="text-xs sm:text-sm">
                  높음 ({riskStats.high})
                </TabsTrigger>
                <TabsTrigger value="medium" className="text-xs sm:text-sm">
                  중간 ({riskStats.medium})
                </TabsTrigger>
                <TabsTrigger value="low" className="text-xs sm:text-sm">
                  낮음 ({riskStats.low})
                </TabsTrigger>
                <TabsTrigger value="mitigated" className="text-xs sm:text-sm">
                  완화됨 ({riskStats.mitigated})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">표시할 위험 요소가 없습니다.</div>
            ) : (
              filteredRisks.map((risk) => (
                <Card key={risk.id} className="overflow-hidden">
                  <div className={`h-1 ${getStatusColor(risk.status)}`} />
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{risk.title}</h3>
                          <Badge variant="outline" className="ml-0 sm:ml-2">
                            {getCategoryIcon(risk.category)}
                            <span className="ml-1">{getCategoryLabel(risk.category)}</span>
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{risk.description}</p>
                        {risk.mitigationPlan && (
                          <div className="text-xs sm:text-sm">
                            <span className="font-medium">완화 계획:</span> {risk.mitigationPlan}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">상태:</span>
                          <Badge variant="secondary">{getStatusLabel(risk.status)}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">심각도:</span>
                          <span className={`font-medium ${getRiskSeverity(risk.score).color}`}>
                            {getRiskSeverity(risk.score).label} ({risk.score})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
