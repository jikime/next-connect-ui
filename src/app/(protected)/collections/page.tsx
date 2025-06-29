'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plus, Trash2, Folder, FileText, Loader2 } from 'lucide-react'
import { CollectionWithStats, Collection } from '@/types/collection'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CreateCollectionModal } from '@/components/modals/create-collection-modal'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Selection states
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collections')
      const res = await response.json()
      if (!res.success) {
        toast.error("컬렉션 오류", {
          description: "컬렉션 조회 실패"
        })
        return
      }

      const collectionsData: Collection[] = res.data

      if (collectionsData.length === 0) {
        setCollections([])
        return
      }

      // Fetch stats for each collection
      const collectionsWithStats = await Promise.all(
        collectionsData.map(async (collection) => {
          try {
            const documentsResponse = await fetch(`/api/collections/${collection.uuid}/documents`)
            const res = await documentsResponse.json()
            const documents = res.data
            const totalChunks = documents.length
            
            // Count unique documents by file_id
            const uniqueFileIds = new Set<string>()
            documents.forEach((doc: any) => {
              const fileId = doc.metadata?.file_id
              if (fileId) uniqueFileIds.add(fileId)
            })
            
            return {
              ...collection,
              stats: {
                documents: uniqueFileIds.size,
                chunks: totalChunks
              }
            }
          } catch (error) {
            console.error(`Failed to fetch stats for collection ${collection.name}:`, error)
            return {
              ...collection,
              stats: { documents: 0, chunks: 0 }
            }
          }
        })
      )

      setCollections(collectionsWithStats)
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCollections()
  }


  const handleDeleteSelected = async () => {
    if (selectedCollections.length === 0) return

    setDeleting(true)
    let deletedCount = 0
    let failedCount = 0

    for (const uuid of selectedCollections) {
      try {
        await fetch(`/api/collections/${uuid}`, {
          method: 'DELETE',
        })
        deletedCount++
      } catch (error) {
        failedCount++
        console.error(`Failed to delete collection ${uuid}:`, error)
      }
    }

    setDeleting(false)
    setShowDeleteConfirm(false)
    setSelectedCollections([])

    if (deletedCount > 0) {
      alert(`✅ ${deletedCount}개의 컬렉션이 성공적으로 삭제되었습니다.`)
    }
    if (failedCount > 0) {
      alert(`❌ ${failedCount}개의 컬렉션 삭제에 실패했습니다.`)
    }

    fetchCollections()
  }

  const toggleSelection = (uuid: string) => {
    setSelectedCollections(prev => 
      prev.includes(uuid) 
        ? prev.filter(id => id !== uuid)
        : [...prev, uuid]
    )
  }

  const selectedCollectionNames = selectedCollections.map(uuid => 
    collections.find(c => c.uuid === uuid)?.name || ''
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl">컬렉션 관리</div>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          새 컬렉션
        </Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          전체 컬렉션: {collections.length}개
        </div>

        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      <div>
        {selectedCollections.length > 0 && (
          <div className="mb-4 flex items-center gap-4">
            <p className="text-sm font-medium">
              {selectedCollections.length}개 선택
            </p>
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  선택 항목 삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>삭제 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    ⚠️ 정말로 선택한 컬렉션을 삭제하시겠습니까? <strong>이 작업은 복구할 수 없습니다.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                  <p className="text-sm text-gray-600 mb-2">
                    삭제할 컬렉션 ({selectedCollections.length}개):
                  </p>
                  <ul className="text-sm text-gray-700 mb-3 list-disc pl-5">
                    {selectedCollectionNames.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    ℹ️ 삭제된 컬렉션의 모든 문서도 함께 삭제됩니다.
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        삭제 중...
                      </>
                    ) : (
                      '삭제'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="w-18 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  문서
                </th>
                <th className="w-18 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  청크
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UUID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  메타데이터
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr
                  key={collection.uuid}
                  className={`hover:bg-gray-50 ${
                    selectedCollections.includes(collection.uuid) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.uuid)}
                      onChange={() => toggleSelection(collection.uuid)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Folder className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {collection.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {collection.stats.documents}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {collection.stats.chunks}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {collection.uuid}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {JSON.stringify(collection.metadata || {})}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={fetchCollections}
      />
    </div>
  )
}