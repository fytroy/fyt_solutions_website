document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is on the same page OR if it's on the services page with an anchor
            const currentPath = window.location.pathname.split('/').pop();
            const targetPath = this.pathname.split('/').pop();

            if (this.hash && (currentPath === targetPath || (currentPath === 'index.html' && targetPath === 'services.html'))) {
                e.preventDefault();

                // If on the same page, scroll
                if (currentPath === targetPath) {
                    const targetElement = document.querySelector(this.hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } else { // If navigating to services.html with a hash from index.html
                    // Store the hash and navigate
                    sessionStorage.setItem('scrollToHash', this.hash);
                    window.location.href = this.href;
                }
            }
        });
    });

    // Check for hash on page load (especially for services.html after navigation)
    if (sessionStorage.getItem('scrollToHash')) {
        const hash = sessionStorage.getItem('scrollToHash');
        sessionStorage.removeItem('scrollToHash'); // Clean up
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            // Use setTimeout to ensure the browser has rendered the page before scrolling
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100); // Small delay
        }
    }


    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.main-nav .nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile nav when a link is clicked
        // Exclude dropdown parent links from immediately closing the main nav
        document.querySelectorAll('.main-nav .nav-list a:not(.has-dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close dropdowns if clicking outside (for both desktop and mobile)
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('active'); // Close active dropdowns
                });
            }
        });
    }

    // Dropdown menu (basic functionality)
    const hasDropdowns = document.querySelectorAll('.main-nav .has-dropdown');
    hasDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        if (dropdownLink && dropdownMenu) {
            // Toggle dropdown on click (for mobile, or if JS control is preferred)
            dropdownLink.addEventListener('click', (e) => {
                // Only prevent default if it's the parent dropdown link and not a child link
                if (dropdown.contains(e.target) && !e.target.closest('.dropdown-menu')) {
                     e.preventDefault();
                }

                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('active');
                    }
                });
                dropdownMenu.classList.toggle('active');
            });
        }
    });

    // Scroll Reveal Effect
    const fadeInElements = document.querySelectorAll('.fade-in');
    const revealItems = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => fadeInObserver.observe(el));
    revealItems.forEach(el => fadeInObserver.observe(el)); // Re-use observer for reveal items

    // Dynamic current year in footer
    const currentYearSpan = document.querySelector('#current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});