// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            const parent = entry.target.parentElement;
            if (parent && (parent.classList.contains('pillars-grid') || 
                          parent.classList.contains('team-grid') || 
                          parent.classList.contains('testimonials-grid'))) {
                const siblings = Array.from(parent.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
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

// CONTACT FORM - Opens Gmail directly with pre-filled message
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Format the email body
    const emailBody = `
Hello Bra Salty Foundation,

I hope this message finds you well.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Best regards,
${name}
    `.trim();
    
    // Create Gmail compose URL with your email address
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info.brasaltyfoundation@gmail.com&su=${encodeURIComponent(subject + ' - Contact from ' + name)}&body=${encodeURIComponent(emailBody)}&from=${encodeURIComponent(email)}`;
    
    // Open Gmail in new tab
    window.open(gmailUrl, '_blank');
    
    // Show success message
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Opening Gmail...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        contactForm.classList.add('hidden');
        document.getElementById('formSuccess').classList.add('active');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Reset form function
function resetForm() {
    contactForm.reset();
    contactForm.classList.remove('hidden');
    document.getElementById('formSuccess').classList.remove('active');
}

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    const btn = newsletterForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Subscribed!';
    btn.style.background = '#059669';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        newsletterForm.reset();
    }, 3000);
});

// Parallax effect for hero images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImages = document.querySelector('.hero-images');
    
    if (heroImages && scrolled < window.innerHeight) {
        heroImages.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to program cards
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderLeftWidth = '8px';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderLeftWidth = '4px';
    });
});

// Initialize animations on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
        el.classList.add('animated');
    });
});

// Performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        observer.disconnect();
    } else {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });
    }
});