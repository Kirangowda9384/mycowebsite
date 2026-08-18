document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Cart Interaction Simulation
    const addBtns = document.querySelectorAll('.add-to-cart');
    const cartBadge = document.querySelector('.cart-badge');
    const toast = document.getElementById('toast');
    let cartCount = 0;

    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Increment cart count
            cartCount++;
            cartBadge.textContent = cartCount;
            
            // Add a little pop animation to the badge
            cartBadge.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 200);

            // Show Toast
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    });

    // 5. Glowing Spores Particle System (Biotech + Nature)
    const canvas = document.getElementById('sporeCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        }

        class Spore {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height + height; // Start slightly below
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * -1 - 0.5; // Float upwards
                this.speedX = Math.random() * 1 - 0.5; // Sway
                // Glowing green or gold colors
                this.color = Math.random() > 0.5 ? 'rgba(16, 185, 129,' : 'rgba(212, 175, 55,';
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5; // Swaying motion

                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color + '0.8)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Spore());
                // Randomize starting Y to fill screen immediately
                particles[i].y = Math.random() * height;
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animateParticles();
    }
});

// Global function for expandable cards
window.toggleSubProducts = function(cardElement) {
    cardElement.classList.toggle('expanded');
};

// 6. Reviews & Feedback System
document.addEventListener("DOMContentLoaded", () => {
    const starRating = document.getElementById('starRating');
    const reviewRatingInput = document.getElementById('reviewRating');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');

    if (!starRating || !reviewForm || !reviewsList) return;

    // Default Customer & Team Feedback (stored locally as base)
    const defaultReviews = [
        {
            name: "Dr. Priya Nair",
            rating: 5,
            text: "As a biochemist, I am highly impressed by MycoHaven's scientific approach to functional food. The pure natural honey is outstanding—rich in flavor and completely raw. Can't wait for the liquid extracts!",
            date: "25/05/2026"
        },
        {
            name: "Rajesh K.",
            rating: 5,
            text: "This raw honey is absolutely authentic! It has a distinct wild floral note that you just don't get in commercial honey. Truly excellent quality.",
            date: "18/05/2026"
        },
        {
            name: "Meera Sen",
            rating: 4,
            text: "Excellent packaging and fast response on WhatsApp. The honey is very fresh. Hope the mushroom chocolates are launched soon!",
            date: "12/05/2026"
        },
        {
            name: "Suresh R",
            rating: 5,
            text: "Pure natural honey quality is excellent! Very fresh and authentic.",
            date: "28/04/2026"
        },
        {
            name: "Kiran Kumar",
            rating: 5,
            text: "Tested the Cordyceps samples, excellent bioactive compounds. Looking forward to the commercial release!",
            date: "29/04/2026"
        }
    ];

    const STORAGE_KEY = 'mycohaven_public_reviews_prod_v1';
    const API_GET_URL = `https://api.keyval.org/get/${STORAGE_KEY}`;
    const API_SET_URL = `https://api.keyval.org/set/${STORAGE_KEY}`;

    let customReviews = [];
    let reviews = [...defaultReviews];

    // Helper for fetch with timeout
    const fetchWithTimeout = async (url, options = {}, timeout = 6000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    };

    // Function to generate Star HTML
    const generateStars = (rating) => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= rating ? '★' : '☆';
        }
        return starsHtml;
    };

    // Render reviews to UI
    const renderReviews = () => {
        reviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px; font-style: italic;">No reviews yet. Be the first to share your experience!</p>';
            return;
        }

        // Reverse to show newest first
        [...reviews].reverse().forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card reveal active';
            card.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-stars">${generateStars(review.rating)}</div>
                <div class="review-body">${review.text}</div>
            `;
            reviewsList.appendChild(card);
        });
    };

    // Main fetch reviews logic
    const loadLiveReviews = async () => {
        try {
            // First load from localStorage to show something immediately (instant load)
            customReviews = JSON.parse(localStorage.getItem('mycohaven_custom_reviews')) || [];
            reviews = [...defaultReviews, ...customReviews];
            renderReviews();

            // Fetch latest reviews from global API
            const response = await fetchWithTimeout(API_GET_URL);
            if (response.ok) {
                const text = await response.text();
                let remoteReviews = [];
                if (text && text.trim()) {
                    try {
                        const parsed = JSON.parse(text);
                        if (Array.isArray(parsed)) {
                            remoteReviews = parsed;
                        }
                    } catch (e) {
                        console.warn("Could not parse remote reviews string:", e);
                    }
                }
                
                if (remoteReviews.length > 0) {
                    customReviews = remoteReviews;
                    
                    // Merge local-only custom reviews to preserve user's local submissions
                    const existingReviewKeys = new Set(customReviews.map(r => `${r.name}_${r.text.substring(0,20)}_${r.date}`));
                    const localCustom = JSON.parse(localStorage.getItem('mycohaven_custom_reviews')) || [];
                    localCustom.forEach(r => {
                        const key = `${r.name}_${r.text.substring(0,20)}_${r.date}`;
                        if (!existingReviewKeys.has(key)) {
                            customReviews.push(r);
                        }
                    });

                    // Save the merged list back to localStorage
                    localStorage.setItem('mycohaven_custom_reviews', JSON.stringify(customReviews));
                }
                
                reviews = [...defaultReviews, ...customReviews];
                renderReviews();
            }
        } catch (err) {
            console.warn("Failed to load live reviews from database, using cached local copy:", err);
        }
    };

    // Run the loader immediately
    loadLiveReviews();

    // Star Rating Interaction
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            reviewRatingInput.value = value;
            
            // Update UI
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Form Submission
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('reviewName');
        const textInput = document.getElementById('reviewText');
        const submitBtn = reviewForm.querySelector('.review-submit');
        
        const newReview = {
            name: nameInput.value.trim(),
            rating: parseInt(reviewRatingInput.value),
            text: textInput.value.trim(),
            date: new Date().toLocaleDateString()
        };

        // Disable button & show loading state
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Publishing...";

        try {
            // Fetch latest reviews first to avoid overwriting other submissions
            let latestRemote = [];
            try {
                const getResp = await fetchWithTimeout(API_GET_URL);
                if (getResp.ok) {
                    const text = await getResp.text();
                    if (text && text.trim()) {
                        const parsed = JSON.parse(text);
                        if (Array.isArray(parsed)) {
                            latestRemote = parsed;
                        }
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch latest remote reviews before submit, appending to cached local copy:", e);
                latestRemote = customReviews;
            }

            // Append the new review
            latestRemote.push(newReview);
            customReviews = latestRemote;

            // Save custom reviews to localStorage
            localStorage.setItem('mycohaven_custom_reviews', JSON.stringify(customReviews));

            // Sync with global API
            const encodedVal = encodeURIComponent(JSON.stringify(customReviews));
            const setResp = await fetchWithTimeout(`${API_SET_URL}/${encodedVal}`);
            if (!setResp.ok) {
                throw new Error(`Failed to upload feedback: ${setResp.status}`);
            }

            // Update UI list and re-render
            reviews = [...defaultReviews, ...customReviews];
            renderReviews();

            // Reset form
            reviewForm.reset();
            stars.forEach(s => s.classList.add('active'));
            reviewRatingInput.value = 5;

            // Success feedback
            submitBtn.textContent = "Feedback Live!";
            submitBtn.style.backgroundColor = "var(--accent-green)";
        } catch (err) {
            console.error("Failed to post live review:", err);

            // Local fallback save so the user doesn't lose their input
            if (!customReviews.some(r => r.name === newReview.name && r.text === newReview.text)) {
                customReviews.push(newReview);
                localStorage.setItem('mycohaven_custom_reviews', JSON.stringify(customReviews));
            }
            reviews = [...defaultReviews, ...customReviews];
            renderReviews();

            reviewForm.reset();
            stars.forEach(s => s.classList.add('active'));
            reviewRatingInput.value = 5;

            submitBtn.textContent = "Submitted!";
            submitBtn.style.backgroundColor = "var(--accent-gold)";
        } finally {
            submitBtn.disabled = false;
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = "";
            }, 3000);
        }
    });
});

// 7. Honey Cultivation Modal Logic
function openHoneyModal() {
    const modal = document.getElementById('honeyModal');
    const video = document.getElementById('honeyVideo');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        if (video) video.play();
    }
}

function closeHoneyModal() {
    const modal = document.getElementById('honeyModal');
    const video = document.getElementById('honeyVideo');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        if (video) {
            video.pause();
            video.currentTime = 0; // Reset video
        }
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('honeyModal');
    if (event.target == modal) {
        closeHoneyModal();
    }
}
