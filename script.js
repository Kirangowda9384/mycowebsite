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

    // Default Mock Reviews
    const defaultReviews = [
        {
            name: "Sarah L.",
            rating: 5,
            text: "The Focus Chocolate is incredible. I've completely replaced my afternoon coffee with it. Highly recommend for deep work sessions!",
            date: new Date(Date.now() - 86400000 * 2).toLocaleDateString() // 2 days ago
        },
        {
            name: "Marcus T.",
            rating: 5,
            text: "Loving the Reishi snacks before bed. They actually help me wind down and sleep better.",
            date: new Date(Date.now() - 86400000 * 5).toLocaleDateString() // 5 days ago
        }
    ];

    // Load reviews from localStorage or use defaults
    let reviews = JSON.parse(localStorage.getItem('mycohaven_reviews'));
    if (!reviews || reviews.length === 0) {
        reviews = defaultReviews;
        localStorage.setItem('mycohaven_reviews', JSON.stringify(reviews));
    }

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

        // Add to array
        reviews.push(newReview);
        
        // Save to localStorage
        localStorage.setItem('mycohaven_reviews', JSON.stringify(reviews));
        
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
