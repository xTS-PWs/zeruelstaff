import { signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";
import './auth.js';

async function loadAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, orderBy('date', 'desc'), limit(1));

    try {
        const querySnapshot = await getDocs(q);
        announcementsList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const announcement = doc.data();
            const date = announcement.date?.toDate() || new Date();
            announcementsList.innerHTML += `
                <div class="broadcast-card">
                    <div class="broadcast-icon">
                        <i class="fas fa-broadcast-tower"></i>
                    </div>
                    <div class="broadcast-content">
                        <div class="broadcast-date">${date.toLocaleDateString()}</div>
                        <h3>${announcement.title}</h3>
                        <div class="rich-text">${announcement.content}</div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading announcements:", error);
    }
}

async function loadRecentBlogPosts() {
    const blogGrid = document.getElementById('blogPosts');
    const blogCollection = collection(db, 'staff-blog-posts');  // Updated collection name
    const q = query(blogCollection, orderBy('date', 'desc'), limit(3));

    try {
        const querySnapshot = await getDocs(q);
        blogGrid.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const date = post.date?.toDate() || new Date();
            blogGrid.innerHTML += `
                <article class="article-card">
                    <h3>${post.title}</h3>
                    <div class="article-date">${post.date ? new Date(post.date.toDate()).toLocaleDateString() : 'No date'}</div>
                    <p>${post.textContent?.substring(0, 150) || ''}...</p>
                    <a href="blog-post.html?id=${doc.id}" class="article-link">Read More <i class="fas fa-arrow-right"></i></a>
                </article>
            `;
        });
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add error handling at the start
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'unauthorized') {
        alert('Unauthorized access. You must be an admin to view that page.');
    }

    // Wait for header component to load before adding event listeners
    const headerLoaded = new Promise(resolve => {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById('mobileMenuBtn')) {
                obs.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    headerLoaded.then(() => {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    });

    // Load dynamic content
    loadAnnouncements();
    loadRecentBlogPosts();
});
