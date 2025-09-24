import { useState } from 'react';
import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from './CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import { useForm } from 'react-hook-form';
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from '../../api/playlistsApi.types';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';
import { EditPlaylistForm } from './EditPlaylistForm/EditPlaylistForm';
import { useDebounceValue } from '@/common/hooks';
import { Pagination } from '@/common/components';

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounceValue(search);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  const [deletePlaylist] = useDeletePlaylistMutation();

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId);
    }
  };

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id);
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((t) => t.id),
      });
    } else {
      setPlaylistId(null);
    }
  };

  const changePageSizeHandler = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder={'Search playlist by title'}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <div className={s.items}>
        {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
        {data?.data.map((playlist) => {
          const isEditing = playlistId === playlist.id;

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlist.id}
                  register={register}
                  handleSubmit={handleSubmit}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  deletePlaylistHandler={deletePlaylistHandler}
                  editPlaylistHandler={editPlaylistHandler}
                />
              )}
            </div>
          );
        })}
      </div>
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
