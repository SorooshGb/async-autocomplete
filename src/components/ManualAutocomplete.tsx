import { Fragment, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SpinnerWithText } from './SpinnerWithText';
import { ManualAutocompleteExplanation } from './ManualAutocompleteExplanation';
import { SCROLL_BOTTOM_THRESHOLD_PX, ITEMS_PER_PAGE, QUERY_DEBOUNCE_WAIT_TIME } from '@/lib/constants';
import { fetchMovies, MoviesOption } from '@/api/api';
import { useDebouncedCallback } from '@/hooks/debounce/useDebouncedCallback';

type StartRequestOptions =
  | {
      type: 'firstPage' | 'infiniteScroll';
    }
  | { type: 'debouncedInput'; query: string };

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

  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  function getCurrentPageNumber(query: string): number {
    const entry = cacheRef.current.get(query);
    if (!entry) return 1;

    return Math.ceil(entry.options.length / ITEMS_PER_PAGE) || 1;
  }

  function applyCache(query: string): boolean {
    const entry = cacheRef.current.get(query);
    if (!entry) return false;

    setOptions(entry.options);
    setHasMorePages(entry.hasMorePages);

    return true;
  }

  async function getMovies(query: string, page: number) {
    const res = await fetchMovies({ page, query, abortSignal: abortControllerRef.current?.signal });
    if ('message' in res && res.message === 'aborted') return;

    if (res.error) {
      setError(res.message);
      setLoading(false);
      return;
    }

    const prev = cacheRef.current.get(query);
    const updatedOptions = page === 1 ? res.data : [...(prev?.options || []), ...res.data];

    const nextHasMorePages = res.data.length === ITEMS_PER_PAGE;

    setOptions(updatedOptions);
    setHasMorePages(nextHasMorePages);

    // Update cache
    cacheRef.current.set(query, {
      options: updatedOptions,
      hasMorePages: nextHasMorePages,
    });

    setLoading(false);
  }

  function startRequest(options: StartRequestOptions) {
    const { type } = options;
    const query = type === 'debouncedInput' ? options.query : inputValue;

    abortControllerRef.current?.abort();
    setError('');

    if ((type === 'debouncedInput' || type === 'firstPage') && applyCache(query)) {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    if (type === 'debouncedInput') {
      setOptions([]);
      debouncedGetMovies(query);
    } else if (type === 'firstPage') {
      getMovies(query, 1);
    } else if (type === 'infiniteScroll') {
      const nextPage = getCurrentPageNumber(query) + 1;
      getMovies(query, nextPage);
    }
  }

  const debouncedGetMovies = useDebouncedCallback((query: string) => getMovies(query, 1), QUERY_DEBOUNCE_WAIT_TIME);

  const debouncedGetNextPage = useDebouncedCallback((el: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < SCROLL_BOTTOM_THRESHOLD_PX) {
      startRequest({ type: 'infiniteScroll' });
    }
  }, 300);

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (loading || !hasMorePages) return;
    debouncedGetNextPage(event.currentTarget);
  }

  function onInputChange(newInputValue: string) {
    setInputValue(newInputValue);
    startRequest({ type: 'debouncedInput', query: newInputValue });
  }

  function onDropdownOpen() {
    startRequest({ type: 'firstPage' });
  }

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

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
        noOptionsText={getNoOptionsText(error, () => startRequest({ type: 'firstPage' }))}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => <TextField {...params} label="فیلم‌ها" error={!!error} />}
        renderOption={makeRenderOption(options, hasMorePages, !!error, () => startRequest({ type: 'infiniteScroll' }))}
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

function getNoOptionsText(error: string, retry: () => void) {
  return error ? (
    <Button onClick={retry} size="small" color="error">
      {error}. برای تلاش مجدد کلیک کنید
    </Button>
  ) : (
    <Typography>هیچ نتیجه‌ای یافت نشد</Typography>
  );
}

function makeRenderOption(
  options: MoviesOption[],
  hasNextPage: boolean,
  isPaginationError: boolean,
  retryNextPage: () => void
) {
  return (props: React.HTMLAttributes<HTMLLIElement> & { key: string }, option: MoviesOption) => {
    const isLast = option === options[options.length - 1];

    if (!isLast) {
      return (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      );
    }

    if (!hasNextPage && !isPaginationError) {
      return (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      );
    }

    const { key, ...rest } = props;
    return (
      <Fragment key={key}>
        <li {...rest}>{option.label}</li>
        <Box marginTop={1} display="flex" justifyContent="center" sx={{ height: 30 }}>
          {isPaginationError ? (
            <Button color="error" size="small" onClick={retryNextPage}>
              خطا در بارگذاری، برای تلاش مجدد کلیک کنید
            </Button>
          ) : (
            hasNextPage && <CircularProgress size={20} />
          )}
        </Box>
      </Fragment>
    );
  };
}
