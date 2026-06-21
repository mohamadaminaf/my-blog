// تنظیمات اتصال به Supabase
const SUPABASE_URL = 'https://iuddnjxzkerohgexfaqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0.EVYUTiNvj7xxtCTZLyBafI7XiH3yVAqnbHiZkwdQwW8';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ۱. تابع حذف پست
async function deletePost(id) {
    if (!confirm("آیا مطمئنی که می‌خوای این پست رو حذف کنی؟")) return;

    const { error } = await _supabase
        .from('Posts')
        .delete()
        .eq('id', id);

    if (error) {
        alert("خطا در حذف: " + error.message);
    } else {
        alert("پست با موفقیت حذف شد!");
        loadPosts(); // رفرش لیست پست‌ها
    }
}

// ۲. تابع ویرایش پست
async function editPost(id, oldTitle, oldContent) {
    const newTitle = prompt("عنوان جدید را وارد کن:", oldTitle);
    const newContent = prompt("محتوای جدید را وارد کن:", oldContent);

    if (newTitle === null || newContent === null) return; // اگر کاربر کنسل کرد

    const { error } = await _supabase
        .from('Posts')
        .update({ title: newTitle, content: newContent })
        .eq('id', id);

    if (error) {
        alert("خطا در ویرایش: " + error.message);
    } else {
        alert("پست با موفقیت ویرایش شد!");
        loadPosts(); // رفرش لیست پست‌ها
    }
}

// ۳. تابع اصلی نمایش پست‌ها (آپدیت شده)
async function loadPosts() {
    const postContainer = document.getElementById('post-list');
    
    const { data: posts, error } = await _supabase
        .from('Posts') 
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
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
            // در اینجا دو دکمه اضافه کردیم که توابع بالا رو صدا می‌زنند
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <button onclick="editPost(${post.id}, '${post.title}', '${post.content}')">ویرایش</button>
                <button onclick="deletePost(${post.id})" style="background-color: red; color: white;">حذف</button>
                <hr>
            `;
            postContainer.appendChild(article);
        });
    }
}

// اجرای تابع در هنگام لود شدن صفحه
loadPosts();
