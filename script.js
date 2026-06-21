// تنظیمات اتصال به Supabase
const SUPABASE_URL = 'https://iuddnjxzkerohgexfaqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0.EVYUTiNvj7xxtCTZLyBafI7XiH3yVAqnbHiZkwdQwW8';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// تابع نمایش پست‌ها
async function loadPosts() {
    const postContainer = document.getElementById('post-list');
    
    // تغییر اینجا: از Posts استفاده کردیم
    const { data: posts, error } = await _supabase
        .from('Posts') 
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        // این خط باعث می‌شود اگر خطا داد، روی صفحه وبلاگت بنویسد چه مشکلی هست
        postContainer.innerHTML = `<p style="color: red;">خطا در دریافت اطلاعات: ${error.message}</p>`;
        return;
    }

    if (postContainer) {
        postContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postContainer.innerHTML = "<p>هنوز پستی منتشر نشده است.</p>";
            return;
        }

        posts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <hr>
            `;
            postContainer.appendChild(article);
        });
    }
}

// اجرای تابع
loadPosts();
