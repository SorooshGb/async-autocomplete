import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export function ManualAutocompleteExplanation() {
  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h6" gutterBottom>
        توضیح پیاده‌سازی کامپوننت ManualAutocomplete
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        این کامپوننت یک Autocomplete با جستجوی لحظه‌ای و اسکرول بینهایت است که داده‌ها را به‌صورت دستی از API مدیریت
        می‌کند:
      </Typography>

      <List dense>
        <ListItem>
          <ListItemText
            primary="مدیریت دستی state و درخواست‌ها"
            secondary="برای نگهداری آیتم‌ها، وضعیت بارگذاری، خطا، صفحه فعلی و کش نتایج از useState و useRef استفاده شده و AbortController برای کنسل کردن درخواست قبلی به‌کار رفته است."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="جستجوی real-time با debounce"
            secondary="تغییرات input با onInputChange کنترل می‌شود و با استفاده از debounce و QUERY_DEBOUNCE_WAIT_TIME، درخواست‌ها به شکل بهینه به API ارسال می‌شوند."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="اسکرول بینهایت و lazy loading"
            secondary="با گوش‌دادن به اسکرول لیست (ListboxProps.onScroll) و محاسبه فاصله تا انتهای لیست، در صورت رسیدن به آستانه INFINITE_QUERY_THRESHOLD صفحه بعدی لود می‌شود."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="کش نتایج بر اساس query"
            secondary="برای هر عبارت جستجو یک ورودی در cacheRef نگهداری می‌شود تا در صورت تکرار همان query، به‌جای درخواست جدید، نتایج از کش خوانده شوند."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="مدیریت خطا و وضعیت‌های بدون نتیجه"
            secondary="در صورت خطای API، پیام خطا در helperText فیلد نمایش داده می‌شود و زمانی که لیست خالی باشد، متن «هیچ نتیجه‌ای یافت نشد» در Autocomplete نمایش داده می‌شود."
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="بهبود UX در لیست نتایج"
            secondary="آخرین آیتم لیست، در صورت وجود صفحه بعد، یک spinner کوچک زیر خودش نمایش می‌دهد تا وضعیت بارگذاری بیشتر برای کاربر مشخص باشد."
          />
        </ListItem>
      </List>
    </Box>
  );
}
