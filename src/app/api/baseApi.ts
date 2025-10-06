import { AUTH_KEYS } from '@/common/constants';
import { handleErrors } from '@/common/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: async (args, api, extraOptions) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem(AUTH_KEYS.accessToken);
        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return headers;
      },
    })(args, api, extraOptions);

    if (result.error) {
      handleErrors(result.error);
    }

    return result;
  },
  endpoints: () => ({}),
});
