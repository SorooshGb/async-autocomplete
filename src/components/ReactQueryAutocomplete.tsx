import { Fragment, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import { SpinnerWithText } from './SpinnerWithText';
import { SCROLL_BOTTOM_THRESHOLD_PX, QUERY_DEBOUNCE_WAIT_TIME } from '@/lib/constants';
import { MoviesOption } from '@/api/api';
import { useInfiniteMoviesQuery } from '@/api/useInfiniteMoviesQuery';
import { useDebouncedCallback } from '@/hooks/debounce/useDebouncedCallback';
import { useDebouncedState } from '@/hooks/debounce/useDebouncedState';
import { getErrorMessage } from '@/lib/utils';

export function ReactQueryAutocomplete() {
  const [enabled, setEnabled] = useState(false);
  const [debouncedInputValue, debounceInputValue] = useDebouncedState('', QUERY_DEBOUNCE_WAIT_TIME);
  const [selectedOption, setSelectedOption] = useState<MoviesOption | null>(null);

  const { data, isFetching, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMoviesQuery({
      query: debouncedInputValue.trim(),
      enabled,
    });

  const errorMessage = error ? getErrorMessage(error) : null;

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (isFetchingNextPage || !hasNextPage) return;
    debouncedFetchNextPageOnScroll(event.currentTarget);
  }

  const debouncedFetchNextPageOnScroll = useDebouncedCallback((el: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < SCROLL_BOTTOM_THRESHOLD_PX) {
      fetchNextPage();
    }
  }, 300);

  const options = useMemo(() => {
    const base = data ?? [];
    if (!selectedOption) return base;

    const clean = base.filter(o => o.id !== selectedOption.id);
    return [selectedOption, ...clean];
  }, [data, selectedOption]);

  function onInputChange(newInputValue: string, reason: AutocompleteInputChangeReason) {
    // when a selection is made:
    // - keep the queryInput unchanged
    // - keep the last queried list
    if (reason === 'reset') return;

    debounceInputValue(newInputValue);
  }

  return (
    <Stack gap={6}>
      <Autocomplete
        disablePortal
        clearOnBlur={false}
        filterOptions={x => x}
        sx={{ width: 300 }}
        value={selectedOption}
        onChange={(_, v) => setSelectedOption(v)}
        options={options ?? []}
        loading={isFetching}
        filterSelectedOptions
        onOpen={() => {
          if (!enabled) setEnabled(true);
        }}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        onInputChange={(_, newInputValue, reason) => onInputChange(newInputValue, reason)}
        noOptionsText={getNoOptionsText(errorMessage, refetch)}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => <TextField {...params} label="فیلم‌ها" error={!!errorMessage} />}
        renderOption={makeRenderOption(options || [], hasNextPage, isError, fetchNextPage)}
      />
      {/* <Divider /> */}
      {/* <ReactQueryAutocompleteExplanation /> */}
    </Stack>
  );
}

function AutocompleteLoadingText() {
  return (
    <SpinnerWithText size={15}>
      <Typography variant="body2">در حال بارگذاری</Typography>
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
            <CircularProgress size={15} />
          )}
        </Box>
      </Fragment>
    );
  };
}
