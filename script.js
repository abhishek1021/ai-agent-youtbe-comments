// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const signupForm = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatContent = document.querySelector('.chat-content');

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function addMicroInteraction(element, type = 'bounce') {
    element.style.transform = type === 'bounce' ? 'scale(0.95)' : 'translateY(-2px)';
    setTimeout(() => {
        element.style.transform = type === 'bounce' ? 'scale(1.05)' : 'translateY(0)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }, 100);
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile Navigation Toggle
function toggleMobileNav() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const channel = document.getElementById('channel').value.trim();
    
    let isValid = true;
    
    // Reset previous errors
    hideError('email');
    hideError('name');
    
    // Validate email
    if (!email) {
        showError('email', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate name
    if (!name) {
        showError('name', 'Full name is required');
        isValid = false;
    } else if (!validateName(name)) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate YouTube channel URL if provided
    if (channel && !channel.match(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/)) {
        showError('channel', 'Please enter a valid YouTube URL');
        isValid = false;
    }
    
    if (isValid) {
        // Add loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Store user data (in real app, this would be sent to server)
            const userData = {
                email,
                name,
                channel: channel || null,
                timestamp: new Date().toISOString()
            };
            
            console.log('User signup data:', userData);
            
            // Show success message
            successMessage.style.display = 'flex';
            
            // Reset form
            signupForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Add micro-interaction
            addMicroInteraction(successMessage.querySelector('.success-content'));
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
        }, 2000); // Simulate network delay
    } else {
        // Add shake animation to form
        const form = event.target;
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Chat Widget Functionality
function toggleChat() {
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
    
    if (!isVisible) {
        chatInput.focus();
        addMicroInteraction(chatWindow);
    }
}

function closeChat() {
    chatWindow.style.display = 'none';
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            "Thanks for your interest! Our AI can analyze any YouTube video in seconds. What specific feature would you like to know more about?",
            "Great question! Our sentiment analysis uses advanced NLP to understand viewer emotions. Would you like to see a demo?",
            "Our transcription service supports 95+ languages with 99% accuracy. Perfect for global content creators!",
            "Thumbnail scoring helps predict click-through rates before you publish. It's like having a crystal ball for your content!",
            "I'd be happy to help you get started! You can sign up for our free trial above. No credit card required!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'bot');
    }, 1000 + Math.random() * 2000); // Random delay for realism
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight;
    
    // Add entrance animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
}

// Smooth scroll for navigation links
function handleNavLinkClick(event) {
    const href = event.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        event.preventDefault();
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    }
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .workflow-step, .contact-form');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

// Add CSS for shake animation
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
function init() {
    // Add shake animation CSS
    addShakeAnimation();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Event Listeners
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    window.addEventListener('scroll', debounce(handleParallax, 10));
    
    // Navigation
    hamburger?.addEventListener('click', toggleMobileNav);
    
    // Add click handlers to all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Form submission
    signupForm?.addEventListener('submit', handleFormSubmission);
    
    // Real-time form validation
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    
    emailInput?.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
        } else {
            hideError('email');
        }
    });
    
    nameInput?.addEventListener('blur', () => {
        const name = nameInput.value.trim();
        if (name && !validateName(name)) {
            showError('name', 'Name must be at least 2 characters long');
        } else {
            hideError('name');
        }
    });
    
    // Chat widget
    chatToggle?.addEventListener('click', toggleChat);
    chatClose?.addEventListener('click', closeChat);
    chatSend?.addEventListener('click', sendChatMessage);
    
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Close success message when clicking outside
    successMessage?.addEventListener('click', (e) => {
        if (e.target === successMessage) {
            successMessage.style.display = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMobileNav();
        }
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            addMicroInteraction(btn, 'lift');
        });
    });
    
    // Add click effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            addMicroInteraction(card);
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // ESC key closes chat and success message
        if (e.key === 'Escape') {
            if (chatWindow.style.display === 'flex') {
                closeChat();
            }
            if (successMessage.style.display === 'flex') {
                successMessage.style.display = 'none';
            }
        }
    });
    
    // Add loading states to all buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type !== 'submit') {
                const originalContent = this.innerHTML;
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Initialize navbar state
    handleNavbarScroll();
    
    console.log('VideoInsight AI website initialized successfully!');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Global functions for inline event handlers
window.scrollToSection = scrollToSection;

// Performance optimization: Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Call preload function
preloadResources();

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder for real implementation)
function trackEvent(eventName, properties = {}) {
    console.log('Analytics Event:', eventName, properties);
    // In a real implementation, this would send data to your analytics service
    // Example: gtag('event', eventName, properties);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('cta_click', { button_text: e.target.textContent.trim() });
    }
    if (e.target.matches('.feature-card')) {
        trackEvent('feature_card_click', { feature: e.target.querySelector('h3')?.textContent });
    }
});

// Track form submissions
signupForm?.addEventListener('submit', () => {
    trackEvent('form_submission', { form_type: 'signup' });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', debounce(() => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth >= 25 && scrollDepth < 50) {
            trackEvent('scroll_depth', { depth: '25%' });
        } else if (scrollDepth >= 50 && scrollDepth < 75) {
            trackEvent('scroll_depth', { depth: '50%' });
        } else if (scrollDepth >= 75 && scrollDepth < 90) {
            trackEvent('scroll_depth', { depth: '75%' });
        } else if (scrollDepth >= 90) {
            trackEvent('scroll_depth', { depth: '90%' });
        }
    }
}, 1000));