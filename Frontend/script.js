// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
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

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Therapist Carousel Implementation
class TherapistCarousel {
    constructor() {
        this.carousel = document.getElementById('therapistCarousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.currentSlide = 0;
        this.totalSlides = 2;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCarousel();
        this.setupTouchEvents();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            e.preventDefault();
        });

        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            isDragging = false;
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const translateX = -this.currentSlide * 50;
        this.carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TherapistCarousel();
    
    // Initialize social links animations
    initializeSocialAnimations();
});

// Social Links Animations
function initializeSocialAnimations() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    // Add entrance animation
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px) scale(0.8)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0) scale(1)';
        }, 100 * (index + 1));
    });
    
    // Add click ripple effect
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.height, rect.width);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// FIXED FORM SUBMISSION WITH PROPER ERROR HANDLING
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const responseDiv = document.getElementById('responseMessage');
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.style.opacity = '0.7';
        
        responseDiv.style.display = 'block';
        responseDiv.innerHTML = `
            <div style="color: #6b46c1; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                <i class="fas fa-paper-plane"></i> Sending your appointment request...
            </div>
        `;

        console.log('Sending form data:', data);

        // Send to backend
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok && result.success) {
            // Show success message
            responseDiv.innerHTML = `
                <div style="color: #065f46; background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1.5rem; margin-top: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.2rem;"></i>
                        <strong>Success!</strong>
                    </div>
                    <p style="margin: 0; line-height: 1.5;">${result.message}</p>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #10b981; font-size: 0.9rem; opacity: 0.8;">
                        <p style="margin: 0;">💌 Check your email for confirmation details</p>
                        <p style="margin: 0;">📞 We'll call you within 24 hours to schedule your appointment</p>
                    </div>
                </div>
            `;
            
            // Reset form after successful submission
            this.reset();
            
            // Auto-hide success message after 10 seconds
            setTimeout(() => {
                responseDiv.style.display = 'none';
            }, 10000);
            
        } else {
            throw new Error(result.message || 'Failed to send appointment request');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        responseDiv.innerHTML = `
            <div style="color: #991b1b; background: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 1.5rem; margin-top: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-exclamation-triangle" style="color: #f87171; font-size: 1.2rem;"></i>
                    <strong>Error</strong>
                </div>
                <p style="margin: 0 0 1rem 0;">${error.message}</p>
                <div style="background: rgba(248, 113, 113, 0.1); padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                    <strong>Alternative ways to reach us:</strong><br>
                    📞 Call: <a href="tel:+919022101648" style="color: #6b46c1;">+91 90221 01648</a><br>
                    📞 Call: <a href="tel:+919136632156" style="color: #6b46c1;">+91 91366 32156</a><br>
                    💬 WhatsApp: <a href="https://wa.me/9022101648" style="color: #6b46c1;" target="_blank">Click here</a><br>
                    📧 Email: <a href="mailto:omdhyannamtherapy@gmail.com" style="color: #6b46c1;">omdhyannamtherapy@gmail.com</a>
                </div>
            </div>
        `;
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.style.opacity = '1';
    }
});

// Mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.boxShadow = '0 8px 32px rgba(44, 85, 48, 0.08)';
        navLinks.style.padding = '1rem';
    }
});

// Auto-animate stats on scroll
let statsAnimated = false;
const statsSection = document.querySelector('.stats');

function animateStats() {
    if (statsAnimated) return;
    
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const originalText = stat.textContent;
        let finalValue, suffix = '';
        
        // Extract number and suffix
        if (originalText.includes('+')) {
            finalValue = parseInt(originalText.replace('+', ''));
            suffix = '+';
        } else if (originalText.includes('/')) {
            finalValue = 24; // for 24/7
            suffix = '/7';
        } else {
            finalValue = parseInt(originalText);
        }
        
        let currentValue = 0;
        const increment = finalValue / 50;
        const delay = index * 200; // Stagger animations
        
        setTimeout(() => {
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                
                stat.textContent = Math.floor(currentValue) + suffix;
            }, 30);
        }, delay);
    });
    
    statsAnimated = true;
}

// Trigger stats animation when section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.background = 'transparent';
        navLinks.style.boxShadow = 'none';
        navLinks.style.padding = '0';
    } else {
        navLinks.style.display = 'none';
    }
});

// Test server connection on page load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/test');
        const result = await response.json();
        console.log('✅ Server connection test:', result.message);
    } catch (error) {
        console.error('❌ Server connection failed:', error);
        console.log('Make sure your backend server is running on port 3000');
    }
});