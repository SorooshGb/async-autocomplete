import { ReactNode } from 'react';
import { Rtl } from './theme/Rtl';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Rtl>{children}</Rtl>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
