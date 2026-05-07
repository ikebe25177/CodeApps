import { useState, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationControls {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface UsePaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  paginationState: PaginationState;
  paginationControls: PaginationControls;
  getPagedItems: <T>(items: T[]) => T[];
}

export function usePagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationState: PaginationState = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }, [currentPage, pageSize, totalItems]);

  const paginationControls: PaginationControls = useMemo(() => {
    const canGoNext = currentPage < paginationState.totalPages;
    const canGoPrevious = currentPage > 1;

    return {
      goToPage: (page: number) => {
        const clampedPage = Math.max(1, Math.min(page, paginationState.totalPages));
        setCurrentPage(clampedPage);
      },
      nextPage: () => {
        if (canGoNext) {
          setCurrentPage(prev => prev + 1);
        }
      },
      previousPage: () => {
        if (canGoPrevious) {
          setCurrentPage(prev => prev - 1);
        }
      },
      setPageSize: (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
      },
      canGoNext,
      canGoPrevious,
    };
  }, [currentPage, paginationState.totalPages]);

  const getPagedItems = <T,>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  };

  return {
    paginationState,
    paginationControls,
    getPagedItems,
  };
}
