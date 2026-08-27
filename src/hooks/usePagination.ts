import { useState, useCallback, useMemo } from 'react'
import { appConfig } from '@/config/app.config'

interface UsePaginationProps {
  totalItems: number
  initialPage?: number
  initialPageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  prevPage: () => void
  canNextPage: boolean
  canPrevPage: boolean
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = appConfig.pagination.defaultPageSize,
}: UsePaginationProps): UsePaginationReturn {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  )

  const canNextPage = page < totalPages
  const canPrevPage = page > 1

  const nextPage = useCallback(() => {
    if (canNextPage) setPage((p) => p + 1)
  }, [canNextPage])

  const prevPage = useCallback(() => {
    if (canPrevPage) setPage((p) => p - 1)
  }, [canPrevPage])

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize: handleSetPageSize,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  }
}
