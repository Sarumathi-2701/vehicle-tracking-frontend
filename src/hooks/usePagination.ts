import { useState, useMemo, useEffect } from 'react'

interface UsePaginationProps<T> {
  items: T[]
  initialPageSize?: number
  resetTrigger?: any
}

export function usePagination<T>({
  items,
  initialPageSize = 8,
  resetTrigger,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Auto-reset to page 1 whenever search, filter, or items array length changes
  useEffect(() => {
    setCurrentPage(1)
  }, [resetTrigger, items.length])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Ensure current page is always within valid [1, totalPages]
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages))

  // Sliced items for the current page
  const paginatedItems = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [items, validCurrentPage, pageSize])

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(target)
  }

  const nextPage = () => goToPage(validCurrentPage + 1)
  const prevPage = () => goToPage(validCurrentPage - 1)

  return {
    currentPage: validCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems: items.length,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
  }
}

export default usePagination
