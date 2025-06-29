"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { RiskList } from "@/components/risk-prediction/risk-list"
import { RiskSummary } from "@/components/risk-prediction/risk-summary"
import { useProjectRisks } from "@/hooks/use-project-risks"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function ProjectRisksPage() {
  const params = useParams()
  const projectId = params.id as string
  const { risks, summary, loading, error, fetchRisks, updateRiskStatus, getMitigationStrategies } =
    useProjectRisks(projectId)
  const [refreshing, setRefreshing] = useState(false)

  // 데이터 새로고침
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRisks()
    setRefreshing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">프로젝트 위험 관리</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing || loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RiskList
            risks={risks}
            loading={loading}
            onUpdateStatus={updateRiskStatus}
            getMitigationStrategies={getMitigationStrategies}
          />
        </div>
        <div>
          <RiskSummary risks={risks} loading={loading} />
        </div>
      </div>
    </div>
  )
}
