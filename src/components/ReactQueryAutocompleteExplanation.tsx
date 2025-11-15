import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export function ReactQueryAutocompleteExplanation() {
  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h6" gutterBottom>
        توضیح پیاده‌سازی کامپوننت ReactQueryAutocomplete
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        در این نسخه از Autocomplete، مدیریت داده‌ها و pagination با استفاده از React Query انجام شده است:
      </Typography>

      <List dense>
        <ListItem>
          <ListItemText
            primary="استفاده از useInfiniteQuery برای pagination"
            secondary="دریافت لیست فیلم‌ها به صورت صفحه‌ای با useInfiniteMoviesQuery انجام می‌شود و fetchNextPage و hasNextPage مدیریت لود صفحه‌های بعدی را بر عهده دارند."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="جستجوی بهینه با debounce روی ورودی"
            secondary="مقدار input با useState کنترل می‌شود و با useDebounce فقط بعد از مکث کاربر، درخواست جدید به API ارسال شود."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="اسکرول بینهایت روی لیست MUI"
            secondary="با استفاده از ListboxProps.onScroll و محاسبه فاصله تا انتهای لیست (INFINITE_QUERY_THRESHOLD)، در صورت نزدیک شدن اسکرول به انتها، fetchNextPage فراخوانی می‌شود."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="تجمیع صفحات در یک آرایه options"
            secondary="تمام صفحات دریافت‌شده با data.pages.flat() در یک آرایه options ادغام شده و به Autocomplete پاس داده می‌شوند تا لیست نتایج یکپارچه نمایش داده شود."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="مدیریت خطا و وضعیت بارگذاری"
            secondary="React Query وضعیت isFetching و isError و error را در اختیار می‌گذارد؛ از این مقادیر برای نمایش spinner، متن «در حال بارگذاری» و نمایش پیام خطا در helperText فیلد استفاده شده است."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="بهبود UX با نمایش spinner زیر آخرین آیتم"
            secondary="در صورت وجود صفحه بعدی، هنگام رسیدن به انتهای لیست یک CircularProgress کوچک زیر آخرین آیتم نمایش داده می‌شود تا روند بارگذاری آیتم‌های بعدی برای کاربر قابل‌درک باشد."
          />
        </ListItem>
      </List>
    </Box>
  );
}
