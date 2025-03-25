import '../js/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('.handbook-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active section highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.handbook-nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.handbook-section').forEach(section => {
        observer.observe(section);
    });
});
