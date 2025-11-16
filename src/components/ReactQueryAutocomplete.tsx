import { Fragment, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SpinnerWithText } from './SpinnerWithText';
import { ReactQueryAutocompleteExplanation } from './ReactQueryAutocompleteExplanation';
import useDebounce from '@/hooks/useDebounce';
import { INFINITE_QUERY_THRESHOLD, QUERY_DEBOUNCE_WAIT_TIME } from '@/config';
import { MoviesOption } from '@/api/api';
import { useInfiniteMoviesQuery } from '@/api/useInfiniteMoviesQuery';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

export function ReactQueryAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, QUERY_DEBOUNCE_WAIT_TIME);
  const { data, isFetching, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMoviesQuery({
      query: debouncedInputValue,
      enabled: isOpen,
    });

  const options = useMemo(() => data?.pages.flat() ?? [], [data]);
  const errorMessage = isError && error instanceof Error ? error.message : isError ? 'خطایی رخ داده است' : '';

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (isFetchingNextPage) return;

    debouncedFetchNextPageOnScroll(event.currentTarget);
  }

  const debouncedFetchNextPageOnScroll = useDebouncedCallback((el: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < INFINITE_QUERY_THRESHOLD) {
      fetchNextPage();
    }
  }, 300);

  return (
    <Stack gap={6}>
      <Autocomplete
        disablePortal
        clearOnBlur={false}
        filterOptions={x => x}
        sx={{ width: 300 }}
        options={options}
        loading={isFetching}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        noOptionsText={getNoOptionsText(errorMessage, refetch)}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => <TextField {...params} label="فیلم‌ها" error={!!errorMessage} />}
        renderOption={makeRenderOption(options, hasNextPage, isError, fetchNextPage)}
      />
      <Divider />
      <ReactQueryAutocompleteExplanation />
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

function getNoOptionsText(errorMessage: string, refetch: () => void) {
  return errorMessage ? (
    <Button onClick={() => refetch()} size="small" color="error">
      {errorMessage}. برای تلاش مجدد کلیک کنید
    </Button>
  ) : (
    <Typography>هیچ نتیجه‌ای یافت نشد</Typography>
  );
}

function makeRenderOption(options: MoviesOption[], hasNextPage: boolean, isError: boolean, fetchNextPage: () => void) {
  return (props: React.HTMLAttributes<HTMLLIElement> & { key: string }, option: MoviesOption) => {
    const isLast = option === options[options.length - 1];

    if (!isLast) {
      return (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      );
    }

    if (!hasNextPage && !isError) {
      return (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      );
    }

    // there might be more pages (hasNextPage),
    // or last "load more" errored (isError).
    const { key, ...rest } = props;
    return (
      <Fragment key={key}>
        <li {...rest}>{option.label}</li>

        <Box marginTop={1} display="flex" justifyContent="center" sx={{ height: 30 }}>
          {isError ? (
            <Button color="error" onClick={() => fetchNextPage()}>
              خطا در بارگذاری، برای تلاش مجدد کلیک کنید
            </Button>
          ) : (
            <CircularProgress size={20} />
          )}
        </Box>
      </Fragment>
    );
  };
}
