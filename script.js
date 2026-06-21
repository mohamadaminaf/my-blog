// تست مستقیم لود شدن فایل
const body = document.querySelector('body');
const log = document.createElement('div');
log.style.backgroundColor = 'red';
log.style.color = 'white';
log.style.padding = '20px';
log.innerText = 'اسکریپت لود شد! در حال تست Supabase...';
body.prepend(log);

// تست Supabase
const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0';

// بررسی وجود کتابخانه Supabase
if (window.supabase) {
    log.innerText += ' -> کتابخانه Supabase پیدا شد.';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    supabase.from('posts').select('*').limit(1).then(res => {
        if(res.error) {
            log.innerText += ' -> خطا در اتصال به دیتابیس: ' + res.error.message;
        } else {
            log.innerText = 'تبریک! اتصال موفق بود. تعداد پست‌ها: ' + res.data.length;
            log.style.backgroundColor = 'green';
        }
    });
} else {
    log.innerText += ' -> خطا: کتابخانه Supabase لود نشد!';
}
