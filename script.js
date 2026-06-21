const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk5MDU2NiwiZXhwIjoyMDk3NTY2NTY2fQ.-i5niJMhqv8lEFciLZjgUdJ3zZs5tzNRPs2qaTxFJLA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// تابع باز و بسته کردن منو
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// اضافه کردن ایونت کلیک به دکمه سه نقطه
document.getElementById("menu-btn").addEventListener("click", toggleSidebar);

// تابع لود کردن نوشته‌ها
async function loadPosts() {
    const container = document.getElementById('posts-container');
    let { data: posts, error } = await supabase.from('posts').select('*');
    
    if (error) {
        container.innerHTML = "خطا در بارگذاری!";
        console.error(error);
        return;
    }
    
    container.innerHTML = posts.length > 0 ? "" : "هنوز نوشته‌ای وجود ندارد.";
    posts.forEach(post => {
        container.innerHTML += `<div><h2>${post.title}</h2><p>${post.content}</p></div>`;
    });
}

document.addEventListener('DOMContentLoaded', loadPosts);
