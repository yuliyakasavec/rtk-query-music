import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse,
} from './playlistsApi.types';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: (headers) => {
      headers.set(
        'Authorization',
        `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
      );
      return headers;
    },
  }),
  tagTypes: ['Playlist'],
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => {
        return {
          method: 'get',
          url: `playlists`,
        };
      },
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => {
        return {
          method: 'post',
          url: `playlists`,
          body,
        };
      },
      invalidatesTags: ['Playlist'],
    }),
  }),
});

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation } =
  playlistsApi;
