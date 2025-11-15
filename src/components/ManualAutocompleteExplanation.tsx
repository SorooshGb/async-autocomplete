import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export function ManualAutocompleteExplanation() {
  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h6" gutterBottom>
        توضیح پیاده‌سازی کامپوننت ManualAutocomplete
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        این کامپوننت یک Autocomplete با جستجوی لحظه‌ای و اسکرول بینهایت است که همه منطق داده و درخواست‌ها را به‌صورت
        دستی مدیریت می‌کند:
      </Typography>

      <List dense>
        {/* 1 — مدیریت state و درخواست‌ها */}
        <ListItem>
          <ListItemText
            primary="مدیریت state و درخواست‌ها"
            secondary="تمام مسئولیت‌ها از جمله نگهداری داده‌ها، وضعیت بارگذاری، خطا، صفحه فعلی و مدیریت AbortController برای لغو درخواست قبلی، به‌صورت دستی با useState و useRef انجام شده است."
          />
        </ListItem>

        {/* 2 — debounce */}
        <ListItem>
          <ListItemText
            primary="جستجوی بهینه با debounce"
            secondary="ورودی کاربر با debounce کنترل می‌شود تا تنها پس از مکث کاربر، درخواست جدید ارسال شود؛ این کار با debounce و مقدار QUERY_DEBOUNCE_WAIT_TIME انجام شده است."
          />
        </ListItem>

        {/* 3 — infinite scroll */}
        <ListItem>
          <ListItemText
            primary="اسکرول بینهایت (Infinite Scroll)"
            secondary="روی اسکرول لیست گوش داده می‌شود و با محاسبه فاصله تا انتهای لیست، هنگام رسیدن به آستانه INFINITE_QUERY_THRESHOLD صفحه بعدی به‌صورت lazy لود می‌شود."
          />
        </ListItem>

        {/* 4 — مدیریت و نگهداری نتایج */}
        <ListItem>
          <ListItemText
            primary="مدیریت و نگهداری نتایج"
            secondary="یک کش داخلی (cacheRef) بر اساس query نگهداری می‌شود تا هنگام تکرار یک عبارت جستجو، نیاز به درخواست مجدد نباشد و داده از کش خوانده شود."
          />
        </ListItem>

        {/* 5 — مدیریت خطا */}
        <ListItem>
          <ListItemText
            primary="مدیریت خطا و وضعیت‌ها"
            secondary="در هنگام خطا، دکمه تلاش مجدد در dropdown نمایش داده می‌شود و برای بارگذاری صفحه بعد نیز خطا در انتهای لیست همراه با امکان retry نمایش داده می‌شود."
          />
        </ListItem>

        {/* 6 — UX */}
        <ListItem>
          <ListItemText
            primary="بهبود تجربه کاربری در لیست نتایج"
            secondary="برای نمایش بهتر روند لود، زیر آخرین آیتم یک spinner نمایش داده می‌شود و زمانی که خطا رخ بدهد، دکمه retry جایگزین آن می‌شود."
          />
        </ListItem>
      </List>
    </Box>
  );
}
