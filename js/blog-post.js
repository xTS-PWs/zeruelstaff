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
            const readTime = Math.ceil(post.textContent?.split(' ').length / 200) || 1;

            blogPostElement.innerHTML = `
                <article>
                    <header class="blog-post-header">
                        <h1>${post.title}</h1>
                        <div class="blog-post-meta">
                            <div class="blog-post-date">
                                <i class="far fa-calendar"></i> 
                                ${post.date ? new Date(post.date.toDate()).toLocaleDateString() : 'No date'}
                            </div>
                            <div class="read-time">
                                <i class="far fa-clock"></i> ${readTime} min read
                            </div>
                        </div>
                    </header>
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-post-image">` : ''}
                    <div class="blog-post-body rich-text">
                        ${post.content}
                    </div>
                    <footer class="blog-post-footer">
                        <div class="share-post">
                            <h3>Share this post</h3>
                            <div class="share-buttons">
                                <button onclick="sharePost()" class="btn-share">
                                    <i class="fas fa-share-alt"></i> Share
                                </button>
                            </div>
                        </div>
                    </footer>
                </article>
            `;

            // Add share functionality
            window.sharePost = async () => {
                const url = window.location.href;
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: post.title,
                            url: url
                        });
                    } catch (err) {
                        console.error('Share failed:', err);
                    }
                } else {
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                }
            };

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
