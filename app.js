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

// ============================================
// GALLERY / INITIATIVES PAGE FUNCTIONALITY
// ============================================

(function() {
    // Only run on initiatives page
    if (!document.getElementById('galleryGrid')) return;

    const ITEMS_PER_PAGE = 6;
    let allItems = [];
    let filteredItems = [];
    let currentPage = 1;
    let currentFilter = 'all';
    let currentLightboxIndex = 0;

    // Load gallery data from JSON
    async function loadGalleryData() {
        try {
            showSkeletons();
            const response = await fetch('initiatives.json');
            if (!response.ok) throw new Error('Failed to load data');
            allItems = await response.json();
            filteredItems = [...allItems];
            
            generateFilters();
            renderPage();
        } 
        catch (error) {
    console.error('Gallery load error:', error);

    document.getElementById('galleryGrid').innerHTML = `
        <div class="no-results">
            ${error.message}
        </div>
    `;
}
    }

    function showSkeletons() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            grid.appendChild(skeleton);
        }
    }

    // Generate filter buttons from data
    function generateFilters() {
        const categories = [...new Set(allItems.map(item => item.category))];
        const filterContainer = document.getElementById('filters');
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = cat;
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            btn.onclick = () => setFilter(cat);
            filterContainer.appendChild(btn);
        });
    }

    function setFilter(category) {
        currentFilter = category;
        currentPage = 1;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
        
        filteredItems = category === 'all' 
            ? [...allItems] 
            : allItems.filter(item => item.category === category);
        
        renderPage();
    }

    // Render current page
    function renderPage() {
        const grid = document.getElementById('galleryGrid');
        const pagination = document.getElementById('pagination');
        
        if (filteredItems.length === 0) {
            grid.innerHTML = '<div class="no-results">No initiatives found in this category.</div>';
            pagination.style.display = 'none';
            return;
        }
        
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = filteredItems.slice(start, end);
        
        grid.innerHTML = pageItems.map((item, index) => createItemHTML(item, start + index)).join('');
        
        // Setup video hover previews
        document.querySelectorAll('.gallery-item video').forEach(video => {
            const parent = video.closest('.gallery-item');
            parent.addEventListener('mouseenter', () => video.play());
            parent.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
        
        // Update pagination
        const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
        pagination.style.display = totalPages > 1 ? 'flex' : 'none';
        document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prevBtn').disabled = currentPage === 1;
        document.getElementById('nextBtn').disabled = currentPage === totalPages;
        
        document.querySelector('.gallery').scrollIntoView({ behavior: 'smooth' });
    }

    function createItemHTML(item, index) {
        const isVideo = item.type === 'video';
        const mediaHTML = isVideo 
            ? `<video poster="${item.poster || item.thumbnail}" muted loop loading="lazy">
                 <source src="${item.src}" type="video/mp4">
               </video>
               <span class="video-badge">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M8 5v14l11-7z"/>
                 </svg>
                 Video
               </span>`
            : `<img src="${item.thumbnail || item.src}" alt="${item.title}" loading="lazy">`;
        
        return `
            <div class="gallery-item" data-category="${item.category}" 
                 onclick="window.openLightbox(${index})" 
                 style="animation-delay: ${(index % ITEMS_PER_PAGE) * 0.1}s">
                ${mediaHTML}
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <span>${item.category.charAt(0).toUpperCase() + item.category.slice(1)} • ${item.date}</span>
                </div>
            </div>
        `;
    }

    // Expose to global scope for onclick handlers
    window.changePage = function(direction) {
        currentPage += direction;
        renderPage();
    };

    window.openLightbox = function(index) {
        currentLightboxIndex = index;
        const lightbox = document.getElementById('lightbox');
        const mediaContainer = document.getElementById('lightboxMedia');
        const caption = document.getElementById('lightboxCaption');
        const item = filteredItems[index];
        
        mediaContainer.innerHTML = '';
        
        if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = true;
            video.muted = false;
            video.style.maxHeight = '85vh';
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            mediaContainer.appendChild(img);
        }
        
        caption.textContent = `${item.title} — ${item.category.charAt(0).toUpperCase() + item.category.slice(1)} • ${item.date}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function(e) {
        if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
            const lightbox = document.getElementById('lightbox');
            const videos = lightbox.querySelectorAll('video');
            videos.forEach(v => v.pause());
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.navigateLightbox = function(direction, e) {
        e.stopPropagation();
        const newIndex = currentLightboxIndex + direction;
        if (newIndex >= 0 && newIndex < filteredItems.length) {
            window.openLightbox(newIndex);
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') window.closeLightbox({ target: lightbox });
        if (e.key === 'ArrowLeft') window.navigateLightbox(-1, { stopPropagation: () => {} });
        if (e.key === 'ArrowRight') window.navigateLightbox(1, { stopPropagation: () => {} });
    });

    // Initialize
    loadGalleryData();
})();