import { useFetchTracksInfiniteQuery } from '../api/tracksApi';
import { LoadingTrigger } from './LoadingTrigger/LoadingTrigger';
import { TracksList } from './TracksList/TracksList';
import { useInfiniteScroll } from '@/common/hooks';

export const TracksPage = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFetchTracksInfiniteQuery();

  const { observerRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  const pages = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div>
      <h1>Tracks page</h1>
      <TracksList tracks={pages} />

      {hasNextPage && (
        <LoadingTrigger
          observerRef={observerRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  );
};
