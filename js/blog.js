import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import './auth.js';

// Add loading state
function showLoading() {
    const blogGrid = document.getElementById('blogPosts');
    blogGrid.innerHTML = Array(6).fill(`
        <article class="blog-card loading-skeleton">
            <div style="height: 200px"></div>
            <div class="blog-card-content">
                <div style="height: 24px; margin: 1rem 0;"></div>
                <div style="height: 100px;"></div>
            </div>
        </article>
    `).join('');
}

// Add back to top button
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

async function loadBlogPosts() {
    showLoading();
    const blogGrid = document.getElementById('blogPosts');
    const blogCollection = collection(db, 'staff-blog-posts');  // Updated collection name
    const q = query(blogCollection, orderBy('date', 'desc'));

    try {
        const querySnapshot = await getDocs(q);
        blogGrid.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            blogGrid.innerHTML += `
                <article class="blog-card">
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-card-image">` : ''}
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <div class="blog-card-date">
                                <i class="far fa-calendar"></i> 
                                ${post.date ? new Date(post.date.toDate()).toLocaleDateString() : 'No date'}
                            </div>
                            <div class="read-time">
                                <i class="far fa-clock"></i> 
                                ${Math.ceil(post.textContent?.split(' ').length / 200) || 1} min read
                            </div>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.textContent?.substring(0, 150) || ''}...</p>
                        <div class="blog-card-footer">
                            <a href="blog-post.html?id=${doc.id}" class="article-link">Read More <i class="fas fa-arrow-right"></i></a>
                            <div class="share-buttons">
                                <button onclick="shareBlog('${doc.id}', '${post.title}')" class="btn-share">
                                    <i class="fas fa-share-alt"></i> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);

// Add share functionality
window.shareBlog = async (id, title) => {
    const url = `${window.location.origin}/blog-post.html?id=${id}`;
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                url: url
            });
        } catch (err) {
            console.error('Share failed:', err);
        }
    } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
};
