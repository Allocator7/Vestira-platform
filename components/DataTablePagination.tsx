"use client"

import { useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showJumpToPage?: boolean
  showItemCount?: boolean
  className?: string
  isLoading?: boolean
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showJumpToPage = true,
  showItemCount = true,
  className,
  isLoading = false,
}: DataTablePaginationProps) {
  const [jumpToPageValue, setJumpToPageValue] = useState("")
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [isChangingPageSize, setIsChangingPageSize] = useState(false)

  // Calculate start and end item numbers
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  const handlePageChange = async (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || isChangingPage) return

    setIsChangingPage(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onPageChange(page)
    setIsChangingPage(false)
  }

  const handlePageSizeChange = async (value: string) => {
    if (!onPageSizeChange || isChangingPageSize) return

    const newPageSize = Number.parseInt(value, 10)
    setIsChangingPageSize(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onPageSizeChange(newPageSize)
    setIsChangingPageSize(false)
  }

  const handleJumpToPage = () => {
    const page = Number.parseInt(jumpToPageValue, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page)
      setJumpToPageValue("")
    }
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      {showItemCount && (
        <div className="text-sm text-gray-500">
          {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems} items` : "No items found"}
        </div>
      )}

      <div className="flex items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Items per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
              disabled={isLoading || isChangingPageSize || totalItems === 0}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading || isChangingPage || totalPages === 0}
                showLoadingState
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading || isChangingPage || totalPages === 0}
                showLoadingState
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading || isChangingPage}
                  showLoadingState
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading || isChangingPage || totalPages === 0}
                showLoadingState
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading || isChangingPage || totalPages === 0}
                showLoadingState
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {showJumpToPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={jumpToPageValue}
              onChange={(e) => setJumpToPageValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
              className="h-8 w-[60px] bg-white"
              disabled={isLoading || isChangingPage || totalPages === 0}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleJumpToPage}
              disabled={
                !jumpToPageValue ||
                isNaN(Number.parseInt(jumpToPageValue, 10)) ||
                Number.parseInt(jumpToPageValue, 10) < 1 ||
                Number.parseInt(jumpToPageValue, 10) > totalPages ||
                isLoading ||
                isChangingPage
              }
            >
              Go
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
