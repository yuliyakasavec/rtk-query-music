import { useEffect, useState, type ChangeEvent } from 'react';
import { useFetchPlaylistsQuery } from '../../api/playlistsApi';
import { CreatePlaylistForm } from './CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import { useDebounceValue } from '@/common/hooks';
import { Pagination } from '@/common/components';
import { PlaylistsList } from './PlaylistList/PlaylistList';
import { toast } from 'react-toastify';

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounceValue(search);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const { data, isLoading, error } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  useEffect(() => {
    if (!error) return;
    if ('status' in error) {
      // FetchBaseQueryError
      const errMsg =
        'error' in error
          ? error.error
          : (
              error.data as {
                error: string;
              }
            ).error ||
            (error.data as { message: string }).message ||
            'Some error occurred';
      toast(errMsg, { type: 'error', theme: 'colored' });
    } else {
      // SerializedError
      toast(error.message || 'Some error occurred', {
        type: 'error',
        theme: 'colored',
      });
    }
  }, [error]);

  const changePageSizeHandler = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
  };

  if (isLoading) return <h1>Skeleton loader...</h1>;

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm setCurrentPage={setCurrentPage} />
      <input
        type="search"
        placeholder={'Search playlist by title'}
        onChange={searchPlaylistHandler}
      />
      <PlaylistsList
        playlists={data?.data || []}
        isPlaylistsLoading={isLoading}
      />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  );
};
