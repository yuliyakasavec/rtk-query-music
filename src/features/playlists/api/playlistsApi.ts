import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PlaylistsResponse } from './playlistsApi.types';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
  }),
  endpoints: (build) => ({
    // Типизация аргументов (<возвращаемый тип, тип query аргументов (`QueryArg`)>)
    // `query` по умолчанию создает запрос `get` и указание метода необязательно
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => {
        return {
          method: 'get',
          url: `playlists`,
        };
      },
    }),
  }),
});

export const { useFetchPlaylistsQuery } = playlistsApi;
