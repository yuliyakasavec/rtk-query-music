import { PageSizeSelector } from './PageSizeSelector/PageSizeSelector';
import s from './Pagination.module.css';
import { PaginationControls } from './PaginationControls/PaginationControls';

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagesCount: number;
  pageSize: number;
  changePageSize: (size: number) => void;
};

export const Pagination = ({
  currentPage,
  setCurrentPage,
  pagesCount,
  pageSize,
  changePageSize,
}: Props) => {
  if (pagesCount <= 1) return null;

  return (
    <div className={s.container}>
      <PaginationControls
        currentPage={currentPage}
        pagesCount={pagesCount}
        setCurrentPage={setCurrentPage}
      />
      <PageSizeSelector pageSize={pageSize} changePageSize={changePageSize} />
    </div>
  );
};
