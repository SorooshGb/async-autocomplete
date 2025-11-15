import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export function ReactQueryAutocompleteExplanation() {
  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h6" gutterBottom>
        توضیح پیاده‌سازی کامپوننت ReactQueryAutocomplete
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        در این نسخه، مدیریت داده‌ها، کش، وضعیت‌ها، و pagination به‌صورت کامل توسط React Query انجام می‌شود:
      </Typography>

      <List dense>
        {/* 1 — مدیریت state و درخواست‌ها */}
        <ListItem>
          <ListItemText
            primary="مدیریت state و درخواست‌ها"
            secondary="دریافت داده‌ها، وضعیت بارگذاری، وضعیت صفحه بعد، خطا و توابع fetchNextPage و refetch از useInfiniteQuery تأمین می‌شود و نیاز به مدیریت دستی وضعیت‌ها وجود ندارد."
          />
        </ListItem>

        {/* 2 — debounce */}
        <ListItem>
          <ListItemText
            primary="جستجوی بهینه با debounce"
            secondary="با استفاده از useDebounce، مقدار input تنها پس از مکث کاربر باعث اجرای درخواست جدید می‌شود و از تعداد درخواست‌ها کاسته می‌شود."
          />
        </ListItem>

        {/* 3 — infinite scroll */}
        <ListItem>
          <ListItemText
            primary="اسکرول بینهایت (Infinite Scroll)"
            secondary="با گوش‌دادن به اسکرول لیست و محاسبه فاصله تا انتهای آن، در صورت وجود صفحه بعد، تابع fetchNextPage از React Query فراخوانی می‌شود."
          />
        </ListItem>

        {/* 4 — مدیریت و نگهداری نتایج */}
        <ListItem>
          <ListItemText
            primary="مدیریت و نگهداری نتایج"
            secondary="React Query تمام صفحات را در cache نگه می‌دارد و data.pages.flat به‌صورت خودکار یک لیست واحد از همه صفحات فراهم می‌کند."
          />
        </ListItem>

        {/* 5 — مدیریت خطا */}
        <ListItem>
          <ListItemText
            primary="مدیریت خطا و وضعیت‌ها"
            secondary="React Query وضعیت‌های isFetching و isError و error را فراهم می‌کند و بر اساس آن‌ها spinner، پیام خطا، و دکمه تلاش مجدد در dropdown نمایش داده می‌شود."
          />
        </ListItem>

        {/* 6 — UX */}
        <ListItem>
          <ListItemText
            primary="بهبود تجربه کاربری در لیست نتایج"
            secondary="اگر صفحه بعدی وجود داشته باشد، زیر آخرین آیتم، spinner نمایش داده می‌شود و در صورت وقوع خطا، دکمه retry جایگزین آن می‌شود."
          />
        </ListItem>
      </List>
    </Box>
  );
}
