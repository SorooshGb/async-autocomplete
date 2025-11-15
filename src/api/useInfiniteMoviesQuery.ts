import { fetchMoviesStrict } from './api';
import { ITEMS_PER_PAGE } from '../config';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteMoviesQuery({ query, enabled }: { query: string; enabled: boolean }) {
  return useInfiniteQuery({
    queryKey: ['movies', query],
    queryFn: async ({ pageParam = 1, signal }) => fetchMoviesStrict({ page: pageParam, query, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === ITEMS_PER_PAGE ? lastPageParam + 1 : undefined,
    enabled,
    staleTime: Infinity,
    retry: 1,
  });
}
