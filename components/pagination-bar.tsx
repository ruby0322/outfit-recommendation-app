'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from 'react';

interface PaginationBarProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PaginationBar({ currentPage = 1, totalPages = 10, onPageChange }: PaginationBarProps) {
  const [editablePageNumber, setEditablePageNumber] = useState(currentPage.toString())
  const [isEditing, setIsEditing] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setEditablePageNumber(page.toString())
    }
  }

  const handleEditablePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditablePageNumber(e.target.value)
  }

  const handleEditablePageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newPage = parseInt(editablePageNumber, 10)
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      handlePageChange(newPage)
    } else {
      setEditablePageNumber(currentPage.toString())
    }
    setIsEditing(false)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []

    for (let i = currentPage-2; i <= currentPage+2; i++) {
      if (i !== currentPage && isMobile) continue;
      if (i < 1 || i > totalPages) {
        pageNumbers.push(<Button
          key={i}
          variant="outline"
          disabled={true}
          className="w-10 h-10 p-0 border-0 bg-transparent underline"
        >
        </Button>);
        continue;
      }
      if (i === currentPage) {
        pageNumbers.push(
          <>
            {isEditing ? (
              <form onSubmit={handleEditablePageSubmit} className="inline-flex">
                <Input
                  type="text"
                  value={editablePageNumber}
                  onChange={handleEditablePageChange}
                  className="w-16 h-10 text-center"
                  autoFocus
                  onBlur={() => setIsEditing(false)}
                />
              </form>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-16 h-10 p-0"
              >
                {currentPage}
              </Button>
            )}
          </>
        );
        continue;
      }
      pageNumbers.push(
        <Button
          key={i}
          variant="outline"
          onClick={() => handlePageChange(i)}
          className="w-10 h-10 p-0 border-0 bg-transparent underline"
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  }

  return (
    <div className="w-full flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 bg-transparent border-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 bg-transparent border-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {renderPageNumbers()}
      
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 bg-transparent border-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 bg-transparent border-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}