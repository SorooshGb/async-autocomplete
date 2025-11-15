import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import { SpinnerWithText } from './SpinnerWithText';
import { ManualAutocompleteExplanation } from './ManualAutocompleteExplanation';
import { INFINITE_QUERY_THRESHOLD, ITEMS_PER_PAGE, QUERY_DEBOUNCE_WAIT_TIME } from '@/config';
import { fetchMovies, MoviesOption } from '@/api/api';

type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

type StartRequestOptions = {
  replaceOptions?: boolean;
  resetPages?: boolean;
};

type CacheEntry = {
  options: MoviesOption[];
  hasMorePages: boolean;
};

export function ManualAutocomplete() {
  const [options, setOptions] = useState<MoviesOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [hasMorePages, setHasMorePages] = useState(true);

  const pageRef = useRef(1);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // gets called before each fetch request
  function startRequest({ replaceOptions = false, resetPages = false }: StartRequestOptions = {}) {
    abortControllerRef.current?.abort();
    setLoading(true);
    setError('');
    if (replaceOptions) setOptions([]);
    if (resetPages) pageRef.current = 1;
  }

  const fetchMoviesPage = useCallback(async (query: string, nextPage: number) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const res = await fetchMovies({ page: nextPage || 1, query, abortSignal: controller.signal });
    if ('message' in res && res.message === 'aborted') return;

    if (res.error) {
      setError(res.message);
      setLoading(false);
      return;
    }

    const prev = cacheRef.current.get(query);
    const updatedOptions = nextPage === 1 ? res.data : [...(prev?.options || []), ...res.data];

    const nextHasMorePages = res.data.length === ITEMS_PER_PAGE;

    setOptions(updatedOptions);
    setHasMorePages(nextHasMorePages);

    // Update cache
    cacheRef.current.set(query, {
      options: updatedOptions,
      hasMorePages: nextHasMorePages,
    });

    setLoading(false);
  }, []);

  const debouncedFetchMovies = useMemo(() => {
    return debounce(async (query: string) => fetchMoviesPage(query, 1), QUERY_DEBOUNCE_WAIT_TIME);
  }, [fetchMoviesPage]);

  const debouncedFetchNextPageOnScroll = useMemo(() => {
    return debounce((query: string, sm: ScrollMetrics) => {
      const distanceFromBottom = sm.scrollHeight - (sm.scrollTop + sm.clientHeight);

      if (distanceFromBottom < INFINITE_QUERY_THRESHOLD) {
        pageRef.current += 1;
        startRequest();
        fetchMoviesPage(query, pageRef.current);
      }
    }, 300);
  }, [fetchMoviesPage]);

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (loading || !hasMorePages) return;

    debouncedFetchNextPageOnScroll(inputValue, event.currentTarget);
  }

  function applyCache(query: string): boolean {
    const entry = cacheRef.current.get(query);
    if (!entry) return false;

    setOptions(entry.options);
    setHasMorePages(entry.hasMorePages);

    pageRef.current = Math.ceil(entry.options.length / ITEMS_PER_PAGE) || 1;

    setLoading(false);
    setError('');
    return true;
  }

  function onInputChange(newInputValue: string) {
    setInputValue(newInputValue);

    if (applyCache(newInputValue)) {
      debouncedFetchMovies.clear();
      return;
    }

    startRequest({ replaceOptions: true, resetPages: true });
    debouncedFetchMovies(newInputValue);
  }

  function onDropdownOpen() {
    if (applyCache(inputValue)) return;

    if (!options.length) {
      startRequest();
      fetchMoviesPage(inputValue, 1);
    }
  }

  // Cleanup
  useEffect(() => () => debouncedFetchMovies.clear(), [debouncedFetchMovies]);
  useEffect(() => () => debouncedFetchNextPageOnScroll.clear(), [debouncedFetchNextPageOnScroll]);
  useEffect(() => () => abortControllerRef.current?.abort(), []);

  return (
    <Stack gap={6}>
      <Autocomplete
        disablePortal
        clearOnBlur={false}
        sx={{ width: 300 }}
        filterOptions={x => x}
        options={options}
        loading={loading}
        onOpen={onDropdownOpen}
        inputValue={inputValue}
        onInputChange={(_, v) => onInputChange(v)}
        noOptionsText={<NoOptionsText />}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => <TextField {...params} label="فیلم‌ها" error={!!error} helperText={error} />}
        renderOption={makeRenderOption(options, hasMorePages)}
      />
      <Divider />
      <ManualAutocompleteExplanation />
    </Stack>
  );
}

function AutocompleteLoadingText() {
  return (
    <SpinnerWithText>
      <Typography>در حال بارگذاری</Typography>
    </SpinnerWithText>
  );
}

function NoOptionsText() {
  return <Typography>هیچ نتیجه‌ای یافت نشد</Typography>;
}

function makeRenderOption(options: MoviesOption[], hasNextPage: boolean) {
  return (props: React.HTMLAttributes<HTMLLIElement> & { key: string }, option: MoviesOption) => {
    const isLast = option === options[options.length - 1];

    if (isLast && hasNextPage) {
      const { key, ...rest } = props;
      return (
        <Fragment key={key}>
          <li {...rest}>{option.label}</li>
          <Box marginTop={1} display="flex" justifyContent="center">
            <CircularProgress size={20} />
          </Box>
        </Fragment>
      );
    }

    return (
      <li {...props} key={option.id}>
        {option.label}
      </li>
    );
  };
}
