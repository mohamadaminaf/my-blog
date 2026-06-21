// --- ۱. شروع: کد نمایش وضعیت برای خطایابی ---
const body = document.querySelector('body');
const log = document.createElement('div');
log.style.backgroundColor = '#ff4d4d';
log.style.color = 'white';
log.style.padding = '15px';
log.style.margin = '10px';
log.style.borderRadius = '8px';
log.style.fontWeight = 'bold';
log.style.zIndex = '9999';
body.prepend(log);

log.innerText = "در حال لود شدن...";

// --- ۲. تنظیمات Supabase ---
const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0';

// --- ۳. مقداردهی اولیه (بررسی وجود کتابخانه) ---
if (typeof window.supabase === 'undefined') {
    log.innerText = "خطا: کتابخانه Supabase لود نشد! اتصال اینترنت یا فایل index.html را چک کن.";
} else {
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- ۴. تابع اصلی برای بارگذاری پست‌ها ---
    async function loadPosts() {
        try {
            log.innerText = "در حال تلاش برای دریافت پست‌ها...";
            
            const { data, error } = await supabase.from('posts').select('*');

            if (error) {
                // اگر خطا داد، متن دقیق خطا را اینجا نشان می‌دهد
                throw new Error(error.message);
            }

            // اگر موفق بود
            log.style.backgroundColor = '#28a745'; // سبز می‌شود
            log.innerText = "اتصال موفق! تعداد پست‌ها: " + (data ? data.length : 0);

            // نمایش پست‌ها در صفحه
            const container = document.getElementById('posts-container');
            if (container) {
                container.innerHTML = ""; // پاک کردن متن "در حال بارگذاری..."
                if (data && data.length > 0) {
                    data.forEach(post => {
                        container.innerHTML += `<div class="post"><h3>${post.title}</h3><p>${post.content}</p></div>`;
                    });
                } else {
                    container.innerHTML = "<p>هنوز پستی وجود ندارد.</p>";
                }
            }

        } catch (err) {
            log.innerText = "خطای Supabase: " + err.message;
        }
    }

    // اجرای تابع
    loadPosts();
}
