const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPosts() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    container.innerHTML = "در حال دریافت اطلاعات از دیتابیس...";

    try {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Supabase Error:", error);
            container.innerHTML = "خطا در اتصال به دیتابیس. لطفا بعداً تلاش کنید.";
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML = "هنوز پستی در وبلاگ ثبت نشده است.";
            return;
        }

        container.innerHTML = ""; // پاک کردن پیام لودینگ
        data.forEach(post => {
            const div = document.createElement("div");
            div.className = "post";
            div.style.borderBottom = "1px solid #ccc";
            div.style.marginBottom = "20px";
            div.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
            container.appendChild(div);
        });

    } catch (e) {
        console.error("System Error:", e);
        container.innerHTML = "خطای غیرمنتظره رخ داد.";
    }
}

document.addEventListener("DOMContentLoaded", loadPosts);
