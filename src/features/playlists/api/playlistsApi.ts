import type { Images } from '@/common/types';
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from './playlistsApi.types';
import { baseApi } from '@/app/api/baseApi';
import {
  playlistCreateResponseSchema,
  playlistsResponseSchema,
} from '../model/playlists.schemas';
import { imagesSchema } from '@/common/schemas';
import { withZodCatch } from '@/common/utils';
import { io, type Socket } from 'socket.io-client';

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => {
        return {
          method: 'get',
          url: `playlists`,
          params,
        };
      },
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;

        const socket: Socket = io('https://musicfun.it-incubator.app', {
          path: '/api/1.0/ws',
          transports: ['websocket'],
        });

        socket.on('connect', () => console.log('✅ Connected to server'));

        socket.on('tracks.playlist-created', (msg: PlaylistCreatedEvent) => {
          const newPlaylist = msg.payload.data;
          updateCachedData((state) => {
            state.data.pop();
            state.data.unshift(newPlaylist);
            state.meta.totalCount = state.meta.totalCount + 1;
            state.meta.pagesCount = Math.ceil(
              state.meta.totalCount / state.meta.pageSize
            );
          });
        });

        await cacheEntryRemoved;
        socket.on('disconnect', () => console.log('❌ Сonnection terminated'));
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
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => {
        return {
          method: 'delete',
          url: `playlists/${playlistId}`,
        };
      },
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<
      void,
      { playlistId: string; body: UpdatePlaylistArgs }
    >({
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: 'put',
        body,
      }),
      async onQueryStarted(
        { playlistId, body },
        { dispatch, queryFulfilled, getState }
      ) {
        const args = playlistsApi.util.selectCachedArgsForQuery(
          getState(),
          'fetchPlaylists'
        );

        const patchResults: any[] = [];

        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                'fetchPlaylists',
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                (state) => {
                  const index = state.data.findIndex(
                    (playlist) => playlist.id === playlistId
                  );
                  if (index !== -1) {
                    state.data[index].attributes = {
                      ...state.data[index].attributes,
                      ...body,
                    };
                  }
                }
              )
            )
          );
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo();
          });
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation<
      Images,
      { playlistId: string; file: File }
    >({
      query: ({ playlistId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'post',
          body: formData,
        };
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `playlists/${playlistId}/images/main`,
        method: 'delete',
      }),
      invalidatesTags: ['Playlist'],
    }),
  }),
});

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi;
