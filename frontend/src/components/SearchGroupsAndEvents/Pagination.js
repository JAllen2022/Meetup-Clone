import React from "react";
import { useSelector } from "react-redux";
import "./Pagination.css";

const Pagination = ({ currentPage, onPageChange }) => {
  const totalPages = useSelector((state) => state.events.totalPages);

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // If there are 7 or fewer pages, just return all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, limit the number of pages shown to the user
      if (currentPage <= 4) {
        // If we're near the beginning of the list of pages
        pageNumbers.push(1, 2, 3, 4, 5, null, totalPages);
      } else if (currentPage >= totalPages - 3) {
        // If we're near the end of the list of pages
        pageNumbers.push(
          1,
          null,
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // If we're somewhere in the middle of the list of pages
        pageNumbers.push(
          1,
          null,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          null,
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const renderPageNumbers = () => {
    const pageNumbers = getPageNumbers();

    return pageNumbers.map((pageNumber, index) => (
      <li key={index}>
        {pageNumber === null ? (
          <span className="ellipsis">...</span>
        ) : (
          <button
            className={currentPage === pageNumber ? "active" : ""}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )}
      </li>
    ));
  };

  return (
    <ul className="pagination">
      <li>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>
      </li>
      {renderPageNumbers()}
      <li>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
