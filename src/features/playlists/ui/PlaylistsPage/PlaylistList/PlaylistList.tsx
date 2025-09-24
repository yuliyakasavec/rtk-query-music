import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types';
import s from './PlaylistList.module.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi';
import { EditPlaylistForm } from '../EditPlaylistForm/EditPlaylistForm';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';

type Props = {
  playlists: PlaylistData[];
  isPlaylistsLoading: boolean;
};

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
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

  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlistId === playlist.id;

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                handleSubmit={handleSubmit}
                register={register}
                editPlaylist={editPlaylistHandler}
                setPlaylistId={setPlaylistId}
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
  );
};
