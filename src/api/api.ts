import { ITEMS_PER_PAGE } from '../config';
import z from 'zod';

const moviesSchema = z.array(
  z.object({
    id: z.number().min(1),
    label: z.string().nonempty(),
  })
);
export type MoviesOption = z.infer<typeof moviesSchema>[number];

const MOVIES_ENDPOINT = 'http://localhost:3000/top100Films';

function getError(status: number): string {
  if (status >= 500) return 'خطای سرور';
  if (status === 404) return 'یافت نشد';
  if (status === 400) return 'درخواست نامعتبر';
  return 'خطا در انجام درخواست';
}

// for manual implementation
export async function fetchMovies({
  page,
  query,
  abortSignal,
}: {
  page: number;
  query: string;
  abortSignal?: AbortSignal;
}): Promise<{ error: false; data: MoviesOption[] } | { error: true; message: string }> {
  try {
    const res = await fetch(
      `${MOVIES_ENDPOINT}?_page=${page}&_limit=${ITEMS_PER_PAGE}&label_like=${encodeURIComponent(query)}`,
      { signal: abortSignal }
    );

    // throw new Error('پاسخ نامعتبر از سمت سرور');

    if (!res.ok) {
      return { error: true, message: getError(res.status) };
    }

    const data = await res.json();

    const parsed = moviesSchema.safeParse(data);
    if (!parsed.success) {
      return { error: true, message: 'پاسخ نامعتبر از سرور' };
    }

    return { error: false, data: parsed.data };
  } catch {
    if (abortSignal?.aborted) {
      return { error: true, message: 'aborted' };
    }
    return { error: true, message: 'خطا در انجام درخواست' };
  }
}

// for react query implementation
export async function fetchMoviesStrict({
  page,
  query,
  signal,
}: {
  page: number;
  query: string;
  signal?: AbortSignal;
}) {
  const res = await fetch(
    `${MOVIES_ENDPOINT}?_page=${page}&_limit=${ITEMS_PER_PAGE}&label_like=${encodeURIComponent(query)}`,
    { signal }
  );

  // throw new Error('پاسخ نامعتبر از سمت سرور');

  if (!res.ok) {
    throw new Error(getError(res.status));
  }

  const data = await res.json();
  const parsed = moviesSchema.safeParse(data);
  if (!parsed.success) throw new Error('پاسخ نامعتبر از سرور');

  return parsed.data;
}
