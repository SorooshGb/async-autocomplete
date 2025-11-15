import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { ReactNode } from 'react';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export function Rtl({ children }: { children: ReactNode }) {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}
