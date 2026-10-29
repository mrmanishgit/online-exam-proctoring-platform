import { useMemo, useState } from "react";

export default function usePagination({ initialPage = 1, initialPageSize = 10, totalItems = 0 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = useMemo(() => (safePage - 1) * pageSize, [safePage, pageSize]);

  const changePage = (nextPage) => setPage(Math.max(1, Math.min(Number(nextPage) || 1, totalPages)));
  const changePageSize = (nextSize) => {
    setPageSize(Math.max(1, Number(nextSize) || initialPageSize));
    setPage(1);
  };
  const reset = () => { setPage(initialPage); setPageSize(initialPageSize); };

  return { page: safePage, pageSize, totalPages, offset, limit: pageSize, setPage: changePage, setPageSize: changePageSize, reset };
}
