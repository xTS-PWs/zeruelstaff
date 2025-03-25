import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import './auth.js';

async function loadBlogPosts() {
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
                        <div class="blog-card-date">${new Date(post.date).toLocaleDateString()}</div>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || post.content.substring(0, 150)}...</p>
                        <a href="blog-post.html?id=${doc.id}" class="article-link">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `;
        });
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
