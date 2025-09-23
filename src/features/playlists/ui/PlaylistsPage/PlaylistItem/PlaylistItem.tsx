import type { PlaylistData } from '../../../api/playlistsApi.types';
import { PlaylistCover } from './PlaylistCover/PlaylistCover';
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription';
import s from './PlaylistItem.module.css';

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
      <PlaylistCover
        playlistId={playlist.id}
        images={playlist.attributes.images}
      />
      <PlaylistDescription attributes={playlist.attributes} />
      <div className={s.button}>
        <button onClick={() => deletePlaylistHandler(playlist.id)}>
          delete
        </button>
        <button onClick={() => editPlaylistHandler(playlist)}>update</button>
      </div>
    </div>
  );
};
