import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

export function initAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = '/index.html';
                reject('User not authenticated');
            } else {
                resolve(user);
            }
        });
    });
}

export async function checkAdminStatus(user) {
    if (!user) return false;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() && userDoc.data().isAdmin === true;
}

export async function requireAdmin() {
    try {
        const user = await initAuth();
        const isAdmin = await checkAdminStatus(user);
        if (!isAdmin) {
            window.location.href = '/home.html?error=unauthorized';
            throw new Error('Unauthorized access');
        }
        return user;
    } catch (error) {
        console.error('Admin check failed:', error);
        window.location.href = '/home.html?error=unauthorized';
        throw error;
    }
}

// Initialize auth on all protected pages
document.addEventListener('DOMContentLoaded', () => {
    // Skip auth check on login page
    if (!window.location.pathname.includes('index.html')) {
        initAuth().then(user => {
            // Update user name if element exists
            const userNameEl = document.getElementById('userName');
            if (userNameEl) {
                userNameEl.textContent = user.email.split('@')[0];
            }
        });
    }
});
