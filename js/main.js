// Main JavaScript for 2026 Portfolio Interactions, Cursor Spotlight & Dynamic Lattice Canvas
document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------------------
    // STARTUP BOOT SEQUENCE (FAST + SKIPPABLE)
    // ----------------------------------------------------
    const startupOverlay = document.getElementById('startup-overlay');
    const iconTransitionContainer = document.getElementById('icon-transition-container');
    const progressBar = document.getElementById('startup-progress-bar');
    const skipIntroBtn = document.getElementById('skip-intro-btn');

    function closeStartupOverlay() {
        if (!startupOverlay || startupOverlay.classList.contains('hidden')) return;
        startupOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (startupOverlay.parentNode) startupOverlay.remove();
        }, 550);
    }

    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', closeStartupOverlay);
    }

    if (startupOverlay && iconTransitionContainer) {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const bootSequence = [
            { type: 'icon', content: 'fa-cubes' },
            { type: 'icon', content: 'fa-microscope' },
            { type: 'icon', content: 'fa-brain' },
            { type: 'image', content: 'my%20pic.jpeg' }
        ];

        let delaySum = 120;
        const stepDuration = 420;

        bootSequence.forEach((step, index) => {
            setTimeout(() => {
                if (!startupOverlay || startupOverlay.classList.contains('hidden')) return;
                iconTransitionContainer.innerHTML = '';

                let elem;
                if (step.type === 'icon') {
                    elem = document.createElement('i');
                    elem.className = `fa ${step.content} transition-element`;
                } else if (step.type === 'image') {
                    elem = document.createElement('div');
                    elem.className = 'transition-element transition-image-wrapper';

                    const img = document.createElement('img');
                    img.src = step.content;
                    img.className = 'transition-image';

                    const name = document.createElement('h1');
                    name.textContent = 'NIMA MOSLEMY';
                    name.className = 'transition-name';

                    elem.appendChild(img);
                    elem.appendChild(name);
                }

                iconTransitionContainer.appendChild(elem);

                if (progressBar) {
                    progressBar.style.width = `${((index + 1) / bootSequence.length) * 100}%`;
                }

                if (index === bootSequence.length - 1) {
                    setTimeout(closeStartupOverlay, stepDuration + 220);
                }
            }, delaySum);
            delaySum += stepDuration;
        });
    }

    // ----------------------------------------------------
    // INTERACTIVE CURSOR SPOTLIGHT ON BENTO CARDS
    // ----------------------------------------------------
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    document.addEventListener('mousemove', function(e) {
        spotlightCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ----------------------------------------------------
    // SYSTEM DATE & TIME
    // ----------------------------------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        lastUpdatedEl.textContent = new Date().toLocaleDateString('en-US', options) + ' // SYS.SYNC';
    }

    // ----------------------------------------------------
    // MOBILE NAV TOGGLE
    // ----------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const expanded = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    document.addEventListener('click', function(event) {
        if (navMenu && menuToggle &&
            !event.target.closest('.nav-menu') &&
            !event.target.closest('.menu-toggle') &&
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ----------------------------------------------------
    // SCROLL INTERACTIONS
    // ----------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 75,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        const sections = document.querySelectorAll('section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // FORM HANDLING
    // ----------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formAction = contactForm.getAttribute('action');
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            try {
                submitBtn.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert('Thanks for your message! I will get back to you ASAP.');
                    contactForm.reset();
                } else {
                    alert('SYSTEM ERROR: Payload delivery failed. Please verify your Formspree setup.');
                }
            } catch (error) {
                alert('SYSTEM ERROR: Connection failed.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ----------------------------------------------------
    // DYNAMIC LATTICE BACKGROUND
    // ----------------------------------------------------
    const canvas = document.getElementById('lattice-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        let numParticles = Math.floor((width * height) / 15000);

        const config = {
            particleColor: 'rgba(212, 175, 55, 0.42)',
            particleRadius: 2.2,
            lineDistance: 145,
            baseSpeed: 0.16
        };

        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', function() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            numParticles = Math.floor((width * height) / 15000);
            initLattice();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.baseSpeed;
                this.vy = (Math.random() - 0.5) * config.baseSpeed;
                this.radius = config.particleRadius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius && distance > 0) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 2;
                        this.y -= forceDirectionY * force * 2;
                    }
                }

                this.draw();
            }
        }

        function initLattice() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateLattice() {
            requestAnimationFrame(animateLattice);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.lineDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(212, 175, 55, ${0.18 - (distance / config.lineDistance) * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        initLattice();
        animateLattice();
    }
});
