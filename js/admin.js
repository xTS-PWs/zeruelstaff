import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { requireAdmin } from './auth.js';

let currentCollection = '';
let quill;
const modal = document.getElementById('createModal');
const form = document.getElementById('contentForm');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await requireAdmin();
        initializeQuill();
        initializeEventListeners();
    } catch (error) {
        console.error('Admin check failed:', error);
    }
});

function initializeQuill() {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'blockquote'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ],
            clipboard: {
                matchVisual: false,
                allowed: {
                    tags: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3'],
                    attributes: ['href']
                }
            }
        }
    });

    // Add paste handler
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
        let ops = [];
        delta.ops.forEach(op => {
            if (op.insert && typeof op.insert === 'string') {
                ops.push({
                    insert: op.insert,
                    attributes: op.attributes
                });
            }
        });
        delta.ops = ops;
        return delta;
    });
}

function initializeEventListeners() {
    document.getElementById('newAnnouncementBtn').addEventListener('click', () => {
        openModal('Create Announcement', 'announcements');
    });

    document.getElementById('newBlogPostBtn').addEventListener('click', () => {
        openModal('Create Blog Post', 'staff-blog-posts');
    });

    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', handleSubmit);
}

function openModal(title, collection) {
    document.getElementById('modalTitle').textContent = title;
    currentCollection = collection;
    modal.style.display = 'block';
    form.reset();
    quill.root.innerHTML = '';
}

function closeModal() {
    modal.style.display = 'none';
    form.reset();
    quill.root.innerHTML = '';
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const data = {
        title: form.title.value,
        content: quill.root.innerHTML,
        textContent: quill.getText().trim(), // For excerpts
        date: serverTimestamp(),
    };

    if (form.image.value) {
        data.image = form.image.value;
    }

    try {
        await addDoc(collection(db, currentCollection), data);
        closeModal();
        alert('Published successfully!');
    } catch (error) {
        console.error('Error publishing:', error);
        alert('Error publishing content. Please try again.');
    }
}
