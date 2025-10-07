import type { PlaylistAttributes } from '@/features/playlists/api/playlistsApi.types';
import s from './PlaylistDescription.module.css';

type Props = {
  attributes: PlaylistAttributes;
};

export const PlaylistDescription = ({ attributes }: Props) => {
  return (
    <>
      <div className={s.truncateText}>title: {attributes.title}</div>
      <div className={s.truncateText}>
        description: {attributes.description}
      </div>
      <div>userName: {attributes.user.name}</div>
    </>
  );
};
