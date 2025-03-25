import { db } from '../firebase-config.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { requireAdmin } from '../auth.js';

let quill;
let currentId = null;
const modal = document.getElementById('editModal');
const form = document.getElementById('editForm');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await requireAdmin();
        initializeQuill();
        initializeEventListeners();
        loadAnnouncements();
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
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    form.addEventListener('submit', handleUpdate);
    document.getElementById('deleteBtn').addEventListener('click', handleDelete);
}

async function loadAnnouncements() {
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, orderBy('date', 'desc'));
    const tbody = document.getElementById('announcementsTable');

    try {
        const querySnapshot = await getDocs(q);
        tbody.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const announcement = doc.data();
            const date = announcement.date?.toDate() || new Date();
            
            tbody.innerHTML += `
                <tr>
                    <td>${date.toLocaleDateString()}</td>
                    <td>${announcement.title}</td>
                    <td>${announcement.textContent?.substring(0, 100) || ''}...</td>
                    <td>
                        <div class="table-actions">
                            <button onclick="editAnnouncement('${doc.id}')" class="btn-icon">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading announcements:", error);
    }
}

async function editAnnouncement(id) {
    currentId = id;
    const docRef = doc(db, 'announcements', id);
    
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('editTitle').value = data.title;
            quill.root.innerHTML = data.content;
            document.getElementById('editImage').value = data.image || '';
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error("Error loading announcement:", error);
    }
}

async function handleUpdate(e) {
    e.preventDefault();
    if (!currentId) return;

    const docRef = doc(db, 'announcements', currentId);
    const data = {
        title: form.editTitle.value,
        content: quill.root.innerHTML,
        textContent: quill.getText().trim(),
    };

    if (form.editImage.value) {
        data.image = form.editImage.value;
    }

    try {
        await updateDoc(docRef, data);
        closeModal();
        loadAnnouncements();
        alert('Announcement updated successfully!');
    } catch (error) {
        console.error('Error updating announcement:', error);
        alert('Error updating announcement. Please try again.');
    }
}

async function handleDelete() {
    if (!currentId || !confirm('Are you sure you want to delete this announcement?')) return;

    try {
        await deleteDoc(doc(db, 'announcements', currentId));
        closeModal();
        loadAnnouncements();
        alert('Announcement deleted successfully!');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Error deleting announcement. Please try again.');
    }
}

function closeModal() {
    modal.style.display = 'none';
    form.reset();
    quill.root.innerHTML = '';
    currentId = null;
}

// Make edit function available globally
window.editAnnouncement = editAnnouncement;
