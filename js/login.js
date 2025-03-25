import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

async function initializeUserDocument(user) {
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userDocRef, {
                email: user.email,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            console.log('Created new user document');
        } else {
            // Update last login time
            await updateDoc(userDocRef, {
                lastLogin: new Date().toISOString()
            });
            console.log('Updated last login');
        }
    } catch (error) {
        console.error('Error managing user document:', error);
    }
}

// Help modal functionality
function initializeHelpModal() {
    const modal = document.getElementById('helpModal');
    const btn = document.getElementById('helpBtn');
    const span = document.getElementsByClassName('help-close')[0];

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    };
}

document.addEventListener('DOMContentLoaded', initializeHelpModal);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await initializeUserDocument(userCredential.user);
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
    }
});
