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

    // Default Customer & Team Feedback
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

    // Load custom reviews from localStorage (keep them separate from defaults)
    let customReviews = JSON.parse(localStorage.getItem('mycohaven_custom_reviews')) || [];

    // Combine default reviews with user-submitted custom reviews
    let reviews = [...defaultReviews, ...customReviews];

    // Function to generate Star HTML
    const generateStars = (rating) => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= rating ? '★' : '☆';
        }
        return starsHtml;
    };

    // Render reviews
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

    renderReviews();

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
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('reviewName');
        const textInput = document.getElementById('reviewText');
        
        const newReview = {
            name: nameInput.value.trim(),
            rating: parseInt(reviewRatingInput.value),
            text: textInput.value.trim(),
            date: new Date().toLocaleDateString()
        };

        // Add to custom reviews
        customReviews.push(newReview);
        
        // Save custom reviews to localStorage
        localStorage.setItem('mycohaven_custom_reviews', JSON.stringify(customReviews));
        
        // Update the full list
        reviews = [...defaultReviews, ...customReviews];
        
        // Re-render
        renderReviews();
        
        // Reset form
        reviewForm.reset();
        
        // Reset stars to 5 visually
        stars.forEach(s => s.classList.add('active'));
        reviewRatingInput.value = 5;
        
        // Show success
        const submitBtn = reviewForm.querySelector('.review-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Thank you!";
        submitBtn.style.backgroundColor = "var(--accent-green)";
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = "";
        }, 3000);
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
