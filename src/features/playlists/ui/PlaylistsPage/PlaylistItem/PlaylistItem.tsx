import { useUploadPlaylistCoverMutation } from '@/features/playlists/api/playlistsApi';
import type { PlaylistData } from '../../../api/playlistsApi.types';
import s from './PlaylistItem.module.css';
import defaultCover from '@/assets/images/default-playlist-cover.png';
import type { ChangeEvent } from 'react';

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
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation();

  const originalCover = playlist.attributes.images.main.find(
    (img) => img.type === 'original'
  );
  const src = originalCover ? originalCover.url : defaultCover;

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const file = event.target.files?.length && event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG or GIF images are allowed');
      return;
    }

    if (file.size > maxSize) {
      alert(
        `The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`
      );
      return;
    }

    uploadPlaylistCover({ playlistId: playlist.id, file });
  };

  return (
    <div>
      <img src={src} alt="cover" width={'100px'} className={s.cover} />
      <input
        type="file"
        accept={'image/jpeg,image/png,image/gif'}
        onChange={uploadCoverHandler}
      />
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
