export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }

  return 'خطایی رخ داده است';
}

export function getStatusCodeError(status: number): string {
  if (status >= 500) return 'خطای سرور';
  if (status === 404) return 'یافت نشد';
  if (status === 400) return 'درخواست نامعتبر';
  return 'خطا در انجام درخواست';
}
