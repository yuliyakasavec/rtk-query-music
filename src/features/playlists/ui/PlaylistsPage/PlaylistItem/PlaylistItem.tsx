import type { PlaylistData } from '../../../api/playlistsApi.types';
import s from '../PlaylistsPage.module.css';

type Props = {
  playlist: PlaylistData;
  deletePlaylistHandler: (playlistId: string) => void;
  editPlaylistHandler: (playlist: PlaylistData) => void;
};

export const PlaylistItem = ({
  playlist,
  deletePlaylistHandler,
  editPlaylistHandler,
}: Props) => {
  return (
    <div>
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <div className={s.button}>
        <button onClick={() => deletePlaylistHandler(playlist.id)}>
          delete
        </button>
        <button onClick={() => editPlaylistHandler(playlist)}>update</button>
      </div>
    </div>
  );
};
