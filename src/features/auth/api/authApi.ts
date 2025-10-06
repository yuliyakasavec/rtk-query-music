import { baseApi } from '@/app/api/baseApi';
import type { LoginArgs, LoginResponse, MeResponse } from './authApi.types';
import { AUTH_KEYS } from '@/common/constants';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      providesTags: ['Auth'],
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (payload) => ({
        url: `auth/login`,
        method: 'post',
        body: { ...payload, accessTokenTTL: '3m' },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken);
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken);

        dispatch(authApi.util.invalidateTags(['Auth']));
      },
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = authApi;
