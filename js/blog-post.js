import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import './auth.js';

async function loadBlogPost() {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = '/blog.html';
        return;
    }

    const postRef = doc(db, 'staff-blog-posts', postId);

    try {
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
            const post = docSnap.data();
            const blogPostElement = document.getElementById('blogPost');

            blogPostElement.innerHTML = `
                <article>
                    <header class="blog-post-header">
                        <h1>${post.title}</h1>
                        <div class="blog-post-date">${new Date(post.date).toLocaleDateString()}</div>
                    </header>
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-post-image">` : ''}
                    <div class="blog-post-body rich-text">
                        ${post.content}
                    </div>
                </article>
            `;

            // Update page title
            document.title = `${post.title} - Zeruel Staff Portal`;
        } else {
            window.location.href = '/blog.html';
        }
    } catch (error) {
        console.error("Error loading blog post:", error);
        window.location.href = '/blog.html';
    }
}

document.addEventListener('DOMContentLoaded', loadBlogPost);
