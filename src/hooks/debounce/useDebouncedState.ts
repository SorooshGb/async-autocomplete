import { useEffect, useState } from 'react';

export const useDebouncedState = <T>(initial: T, delay: number) => {
  const [value, setValue] = useState<T>(initial);
  const [debounced, setDebounced] = useState<T>(initial);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return [debounced, setValue] as const;
};
