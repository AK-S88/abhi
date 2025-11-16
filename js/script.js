// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
const navbarContainer = document.querySelector('.navbar .container');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbarContainer.style.background = 'rgba(17, 17, 17, 0.95)';
        navbarContainer.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
    } else {
        navbarContainer.style.background = 'rgba(17, 17, 17, 0.8)';
        navbarContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for Fade-In Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to all animatable elements
    const animateElements = document.querySelectorAll('.card, .section-header, .hero-text, .profile-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate skill progress bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => skillObserver.observe(bar));

    // Animate stat numbers
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    };

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Parallax Scroll Effect - Hero Section
    const parallaxLayer = document.querySelector('.parallax-layer');
    const parallaxName = document.querySelector('.parallax-name');
    const parallaxIcons = document.querySelectorAll('.parallax-icon');
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    if (parallaxLayer && heroSection) {
        const handleParallaxScroll = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;

            // Calculate scroll progress (0 to 1) through the hero section
            const scrollProgress = Math.min(scrolled / heroHeight, 1);

            // Name moves slower (foreground element)
            // Transform: move up based on scroll, but slower than scroll speed
            const nameTransform = scrolled * 0.5; // Slower speed
            parallaxName.style.transform = `translateY(-${nameTransform}px)`;

            // Fade out based on scroll progress
            // Start fading at 30% scroll, fully transparent at 80%
            let opacity = 1;
            if (scrollProgress > 0.3) {
                opacity = 1 - ((scrollProgress - 0.3) / 0.5);
            }
            parallaxName.style.opacity = Math.max(0, opacity);

            // Icons move faster (background elements) - creates depth
            parallaxIcons.forEach(icon => {
                const speed = parseFloat(icon.getAttribute('data-speed')) || 1.5;
                const iconTransform = scrolled * speed; // Faster speed
                icon.style.transform = `translateY(-${iconTransform}px)`;
                icon.style.opacity = Math.max(0, opacity);
            });

            // Show hero content as parallax fades
            // Start showing at 20% scroll
            if (scrollProgress > 0.2 && heroContent) {
                heroContent.classList.add('visible');
            } else if (heroContent) {
                heroContent.classList.remove('visible');
            }

            // Hide entire layer when fully scrolled
            if (scrollProgress >= 0.8) {
                parallaxLayer.style.pointerEvents = 'none';
            } else {
                parallaxLayer.style.pointerEvents = 'auto';
            }
        };

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleParallaxScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial call
        handleParallaxScroll();
    }

    // Add parallax effect to hero background
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('.hero-content');
            if (parallax && scrolled < window.innerHeight) {
                parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });

    // Typing effect for hero title (optional - can be enabled)
    const typeEffect = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    };

    // Uncomment to enable typing effect
    // const nameElement = document.querySelector('.name');
    // if (nameElement) {
    //     const originalText = nameElement.textContent;
    //     typeEffect(nameElement, originalText, 80);
    // }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Smooth reveal for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Add cursor glow effect (optional premium feature)
    const createCursorGlow = () => {
        const glow = document.createElement('div');
        glow.classList.add('cursor-glow');
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    };

    // Uncomment to enable cursor glow
    // createCursorGlow();
});

// Add smooth transitions to all interactive elements
const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll('a, button, .card, .btn');
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
};

addHoverEffects();

// Performance optimization: Debounce scroll events
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Use debounced scroll handler for better performance
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based animations can be added here
}, 10));

// Add loading state
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Console message
console.log('%c👋 Hello there!', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a talented data analyst? Let\'s connect!', 'color: #8b5cf6; font-size: 14px;');
