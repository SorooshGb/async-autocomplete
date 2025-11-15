import { Fragment, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, debounce, Divider, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SpinnerWithText } from './SpinnerWithText';
import { ReactQueryAutocompleteExplanation } from './ReactQueryAutocompleteExplanation';
import useDebounce from '@/hooks/useDebounce';
import { INFINITE_QUERY_THRESHOLD, QUERY_DEBOUNCE_WAIT_TIME } from '@/config';
import { MoviesOption } from '@/api/api';
import { useInfiniteMoviesQuery } from '@/api/useInfiniteMoviesQuery';

type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

export function ReactQueryAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, QUERY_DEBOUNCE_WAIT_TIME);
  const { data, isFetching, isError, error, fetchNextPage, hasNextPage } = useInfiniteMoviesQuery({
    query: debouncedInputValue,
    enabled: isOpen,
  });

  const options = useMemo(() => data?.pages.flat() ?? [], [data]);
  const errorMessage = isError && error instanceof Error ? error.message : isError ? 'خطایی رخ داده است' : '';

  function handleListboxScroll(event: React.UIEvent<HTMLElement>) {
    if (!hasNextPage || isFetching) return;

    debouncedFetchNextPageOnScroll(event.currentTarget);
  }

  const debouncedFetchNextPageOnScroll = useMemo(() => {
    return debounce((sm: ScrollMetrics) => {
      const distanceFromBottom = sm.scrollHeight - (sm.scrollTop + sm.clientHeight);

      if (distanceFromBottom < INFINITE_QUERY_THRESHOLD) {
        fetchNextPage();
      }
    }, 300);
  }, [fetchNextPage]);

  useEffect(() => () => debouncedFetchNextPageOnScroll.clear(), [debouncedFetchNextPageOnScroll]);

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
        noOptionsText={<NoOptionsText />}
        loadingText={<AutocompleteLoadingText />}
        ListboxProps={{ onScroll: handleListboxScroll, style: { direction: 'ltr', overscrollBehavior: 'contain' } }}
        renderInput={params => (
          <TextField {...params} label="فیلم‌ها" error={!!errorMessage} helperText={errorMessage} />
        )}
        renderOption={makeRenderOption(options, hasNextPage)}
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
