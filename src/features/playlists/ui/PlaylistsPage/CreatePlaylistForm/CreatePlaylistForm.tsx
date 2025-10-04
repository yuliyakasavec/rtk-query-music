import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi';
import type { CreatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types';
import { useForm, type SubmitHandler } from 'react-hook-form';

type Props = {
  setCurrentPage: (page: number) => void;
};

export const CreatePlaylistForm = ({ setCurrentPage }: Props) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>();

  const [createPlaylist] = useCreatePlaylistMutation();

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        reset();
        setCurrentPage(1);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button>create playlist</button>
    </form>
  );
};
