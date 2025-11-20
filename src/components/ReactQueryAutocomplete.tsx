import { Fragment, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SpinnerWithText } from './SpinnerWithText';
import { ReactQueryAutocompleteExplanation } from './ReactQueryAutocompleteExplanation';
import { SCROLL_BOTTOM_THRESHOLD_PX, QUERY_DEBOUNCE_WAIT_TIME } from '@/lib/constants';
import { MoviesOption } from '@/api/api';
import { useInfiniteMoviesQuery } from '@/api/useInfiniteMoviesQuery';
import { useDebouncedCallback } from '@/hooks/debounce/useDebouncedCallback';
import { useDebouncedState } from '@/hooks/debounce/useDebouncedState';
import { getErrorMessage } from '@/lib/utils';

export function ReactQueryAutocomplete() {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedInputValue, debounceInputValue] = useDebouncedState('', QUERY_DEBOUNCE_WAIT_TIME);

  const {
    data: options,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMoviesQuery({
    query: debouncedInputValue,
    enabled: isOpen,
  });

  const errorMessage = error ? getErrorMessage(error) : null;

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (isFetchingNextPage) return;
    debouncedFetchNextPageOnScroll(event.currentTarget);
  }

  const debouncedFetchNextPageOnScroll = useDebouncedCallback((el: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < SCROLL_BOTTOM_THRESHOLD_PX) {
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
        options={options ?? []}
        loading={isFetching}
        onInputChange={(_, newInputValue) => debounceInputValue(newInputValue)}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        noOptionsText={getNoOptionsText(errorMessage, refetch)}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => <TextField {...params} label="فیلم‌ها" error={!!errorMessage} />}
        renderOption={makeRenderOption(options || [], hasNextPage, isError, fetchNextPage)}
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

function getNoOptionsText(errorMessage: string | null, refetch: () => void) {
  return errorMessage == null ? (
    <Typography>هیچ نتیجه‌ای یافت نشد</Typography>
  ) : (
    <Button onClick={() => refetch()} size="small" color="error">
      {errorMessage}. برای تلاش مجدد کلیک کنید
    </Button>
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
