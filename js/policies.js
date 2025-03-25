import '../js/auth.js';  // Add this to all protected pages

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for policy navigation
    document.querySelectorAll('.policy-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Highlight current section in navigation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.policy-nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.policy-section').forEach(section => {
        observer.observe(section);
    });
});
