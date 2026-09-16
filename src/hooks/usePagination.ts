import { useState, useMemo } from 'react'

interface UsePaginationProps<T> {
  items: T[]
  initialPageSize?: number
}

export function usePagination<T>({ items, initialPageSize = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Ensure current page does not exceed total pages
  const validCurrentPage = Math.min(currentPage, totalPages)

  const paginatedItems = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [items, validCurrentPage, pageSize])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
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
