async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // Re-attach event listeners for header components
        if (elementId === 'header') {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');
            
            mobileMenuBtn?.addEventListener('click', () => {
                navLinks?.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar')) {
                    navLinks?.classList.remove('active');
                }
            });
        }

        // Set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '/components/header.html');
    loadComponent('footer', '/components/footer.html');
});
