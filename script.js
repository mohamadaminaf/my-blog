// const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co'; // آدرس پروژه شما
// const SUPABASE_KEY = 'YOUR_ANON_KEY'; // کلید عمومی شما (Publishable Key)

// این کلید Service Role Key است که برای عملیات نوشتن (حذف و ویرایش) لازم است.
// توجه: استفاده از این کلید در کلاینت امن نیست و باید در بک‌اند استفاده شود.
const SUPABASE_URL = 'https://pjqfufgikfzqnttovgvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZGRuanh6a2Vyb2hnZXhmYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTA1NjYsImV4cCI6MjA5NzU2NjU2Nn0.EVYUTiNvj7xxtCTZLyBafI7XiH3yVAqnbHiZkwdQwW8';

const supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPosts() {
    let { data: posts, error } = await supabase
        .from('posts')
        .select('*');

    if (error) {
        console.error('Error loading posts:', error);
        return;
    }

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>Created at: ${new Date(post.created_at).toLocaleString()}</small><br>
            <button onclick="editPost(${post.id})">Edit</button>
            <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

async function addPost(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content }]);

    if (error) {
        console.error('Error adding post:', error);
        return;
    }

    document.getElementById('post-form').reset();
    loadPosts();
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return;
    }

    loadPosts();
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
        return;
    }

    // Populate the form with post data
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-content').value = post.content;

    // Change the form submit button to update
    const form = document.getElementById('post-form');
    form.innerHTML = `
        <input type="hidden" id="post-id" value="${id}">
        <label for="post-title">Title:</label><br>
        <input type="text" id="post-title" value="${post.title}"><br>
        <label for="post-content">Content:</label><br>
        <textarea id="post-content">${post.content}</textarea><br>
        <button type="submit">Update Post</button>
    `;

    // Add event listener for the updated form
    form.onsubmit = async function(event) {
        event.preventDefault();
        const updatedTitle = document.getElementById('post-title').value;
        const updatedContent = document.getElementById('post-content').value;
        const postId = document.getElementById('post-id').value;

        const { error } = await supabase
            .from('posts')
            .update([{ title: updatedTitle, content: updatedContent }])
            .eq('id', postId);

        if (error) {
            console.error('Error updating post:', error);
            return;
        }

        form.reset();
        // Restore the form to its original state
        form.innerHTML = `
            <label for="post-title">Title:</label><br>
            <input type="text" id="post-title"><br>
            <label for="post-content">Content:</label><br>
            <textarea id="post-content"></textarea><br>
            <button type="submit">Add Post</button>
        `;
        form.onsubmit = addPost; // Re-attach the addPost handler
        loadPosts();
    };
}

// Load posts when the page is loaded
document.addEventListener('DOMContentLoaded', loadPosts);

// Attach the addPost handler to the form submission
document.getElementById('post-form').addEventListener('submit', addPost);

// Initialize Supabase client (if not already done)
// Ensure supabaseClient is loaded before this script runs
// Example: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseClient = window.supabase;
if (!supabaseClient) {
    console.error("Supabase client script not loaded. Make sure to include it.");
}
