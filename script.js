// const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co'; // آدرس پروژه شما
// const SUPABASE_KEY = 'YOUR_ANON_KEY'; // کلید عمومی شما (Publishable Key)

// این کلید Service Role Key است که برای عملیات نوشتن (حذف و ویرایش) لازم است.
// توجه: استفاده از این کلید در کلاینت امن نیست و باید در بک‌اند استفاده شود.
const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk5MDU2NiwiZXhwIjoyMDk3NTY2NTY2fQ.-i5niJMhqv8lEFciLZjgUdJ3zZs5tzNRPs2qaTxFJLA';

const supabaseClient = window.supabase; // فرض می‌کنیم کتابخانه Supabase JS از قبل در صفحه بارگذاری شده باشد

if (!supabaseClient) {
    console.error("Supabase client script not loaded. Make sure to include it.");
    // اینجا می‌تونی یک پیغام خطا به کاربر نشون بدی یا اجرای بقیه اسکریپت رو متوقف کنی
}

const supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPosts() {
    let { data: posts, error } = await supabase
        .from('posts')
        .select('*');

    if (error) {
        console.error('Error loading posts:', error);
        // نمایش پیام خطا به کاربر در صفحه
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = '<p style="color: red;">خطا در بارگذاری نوشته‌ها. لطفاً بعداً دوباره امتحان کنید.</p>';
        }
        return;
    }

    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = ''; // پاک کردن پست‌های قبلی
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>هنوز هیچ نوشته‌ای وجود ندارد.</p>';
        } else {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                // تاریخ شمسی
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedDate = new Date(post.created_at).toLocaleString('fa-IR', options);

                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <small>ایجاد شده در: ${formattedDate}</small><br>
                    <button onclick="editPost(${post.id})">ویرایش</button>
                    <button onclick="deletePost(${post.id})">حذف</button>
                `;
                postsContainer.appendChild(postElement);
            });
        }
    } else {
        console.error("Element with id 'posts-container' not found.");
    }
}

async function addPost(event) {
    if (event) event.preventDefault(); // جلوگیری از رفرش صفحه اگر event وجود داشته باشد

    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');

    if (!titleInput || !contentInput) {
        console.error("Post title or content input elements not found.");
        return;
    }

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('لطفاً عنوان و محتوای نوشته را وارد کنید.');
        return;
    }

    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content }]);

    if (error) {
        console.error('Error adding post:', error);
        alert('خطا در اضافه کردن نوشته. لطفاً دوباره امتحان کنید.');
        return;
    }

    document.getElementById('post-form').reset();
    loadPosts(); // بارگذاری مجدد لیست پست‌ها
}

async function deletePost(id) {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این نوشته را حذف کنید؟')) return;

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        alert('خطا در حذف نوشته. لطفاً دوباره امتحان کنید.');
        return;
    }

    loadPosts(); // بارگذاری مجدد لیست پست‌ها
}

async function editPost(id) {
    // Fetch the post to edit
    let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching post for editing:', error);
        alert('خطا در دریافت اطلاعات نوشته برای ویرایش.');
        return;
    }

    // Populate the form with post data
    const form = document.getElementById('post-form');
    if (form) {
        form.innerHTML = `
            <input type="hidden" id="post-id" value="${id}">
            <label for="post-title">عنوان:</label><br>
            <input type="text" id="post-title" value="${post.title}" required><br>
            <label for="post-content">محتوا:</label><br>
            <textarea id="post-content" required>${post.content}</textarea><br>
            <button type="submit">به‌روزرسانی نوشته</button>
        `;

        // Remove the existing event listener and add the new one for update
        form.onsubmit = async function(event) {
            event.preventDefault(); // جلوگیری از رفرش صفحه

            const updatedTitleInput = document.getElementById('post-title');
            const updatedContentInput = document.getElementById('post-content');
            const postIdInput = document.getElementById('post-id');

            if (!updatedTitleInput || !updatedContentInput || !postIdInput) {
                 console.error("Form elements not found during update.");
                 return;
            }

            const updatedTitle = updatedTitleInput.value.trim();
            const updatedContent = updatedContentInput.value.trim();
            const postId = postIdInput.value;

            if (!updatedTitle || !updatedContent) {
                alert('لطفاً عنوان و محتوای نوشته را وارد کنید.');
                return;
            }

            const { error: updateError } = await supabase
                .from('posts')
                .update([{ title: updatedTitle, content: updatedContent }])
                .eq('id', postId);

            if (updateError) {
                console.error('Error updating post:', updateError);
                alert('خطا در به‌روزرسانی نوشته. لطفاً دوباره امتحان کنید.');
                return;
            }

            // Restore the form to its original state
            form.reset(); // پاک کردن فیلدهای فرم
            restoreFormToAddPost(); // بازگرداندن فرم به حالت افزودن
            loadPosts(); // بارگذاری مجدد لیست پست‌ها
        };
    } else {
        console.error("Element with id 'post-form' not found.");
    }
}

function restoreFormToAddPost() {
    const form = document.getElementById('post-form');
    if (form) {
        form.innerHTML = `
            <label for="post-title">عنوان:</label><br>
            <input type="text" id="post-title" required><br>
            <label for="post-content">محتوا:</label><br>
            <textarea id="post-content" required></textarea><br>
            <button type="submit">اضافه کردن نوشته</button>
        `;
        // Re-attach the addPost handler to the restored form
        form.addEventListener('submit', addPost);
    }
}

// Load posts when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ابتدا بارگذاری پست‌ها
    loadPosts();

    // سپس اضافه کردن event listener برای فرم افزودن پست
    const postForm = document.getElementById('post-form');
    if (postForm) {
        // اطمینان از اینکه addPost فقط یک بار اضافه می‌شود
        postForm.addEventListener('submit', addPost);
    } else {
        console.error("Element with id 'post-form' not found.");
    }
});

// Initialize Supabase client (if not already done)
// Ensure supabaseClient is loaded before this script runs
// Example: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// const supabaseClient = window.supabase; // این خط در بالا تکرار 
