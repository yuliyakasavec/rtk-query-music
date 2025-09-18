import { useUpdatePlaylistMutation } from '@/features/playlists/api/playlistsApi';
import type { UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types';
import type {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

type Props = {
  playlistId: string;
  register: UseFormRegister<UpdatePlaylistArgs>;
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>;
  setPlaylistId: (playlistId: null) => void;
  editPlaylist: (playlist: null) => void;
};

export const EditPlaylistForm = ({
  playlistId,
  register,
  handleSubmit,
  setPlaylistId,
  editPlaylist,
}: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation();

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!playlistId) return;
    updatePlaylist({ playlistId, body: data }).then(() => {
      setPlaylistId(null);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  );
};
