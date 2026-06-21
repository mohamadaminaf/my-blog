// تنظیمات اتصال به Supabase
const SUPABASE_URL = 'https://iuddnjxzkerohgexfaqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0.EVYUTiNvj7xxtCTZLyBafI7XiH3yVAqnbHiZkwdQwW8';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// تابع نمایش پست‌ها
async function loadPosts() {
    const postContainer = document.getElementById('post-list'); // مطمئن شو در HTML این آیدی را داری
    
    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    if (postContainer) {
        postContainer.innerHTML = '';
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

loadPosts();
