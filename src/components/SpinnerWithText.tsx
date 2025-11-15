import { Box, CircularProgress } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
} & ComponentProps<typeof CircularProgress>;

export function SpinnerWithText({ children, size = 20, ...props }: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
      {children}
      <CircularProgress {...props} size={size} />
    </Box>
  );
}
