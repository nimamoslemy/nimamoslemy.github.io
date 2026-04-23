// Main JavaScript for Interactions and Lattice Canvas
document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------------------
    // STARTUP BOOT SEQUENCE (ICON TRANSITION)
    // ----------------------------------------------------
    const startupOverlay = document.getElementById('startup-overlay');
    const iconTransitionContainer = document.getElementById('icon-transition-container');
    const progressBar = document.getElementById('startup-progress-bar');
    
    if (startupOverlay && iconTransitionContainer) {
        // Prevent scrolling while booting
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        const bootSequence = [
            { type: 'icon', content: "fa-book" },        // Book
            { type: 'icon', content: "fa-microscope" },  // Lab icon
            { type: 'icon', content: "fa-cubes" },       // 3D printing
            { type: 'icon', content: "fa-cogs" },        // Mechanical stuff
            { type: 'image', content: "my%20pic.jpeg" }  // User image
        ];

        let delaySum = 300; // Initial delay
        const stepDuration = 1200; // Matches CSS animation
        
        bootSequence.forEach((step, index) => {
            setTimeout(() => {
                iconTransitionContainer.innerHTML = ''; // clear previous
                
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
                
                // Update progress bar
                if (progressBar) {
                    progressBar.style.width = `${((index + 1) / bootSequence.length) * 100}%`;
                }
                
                // End sequence
                if (index === bootSequence.length - 1) {
                    setTimeout(() => {
                        startupOverlay.classList.add('hidden');
                        document.body.style.overflow = ''; // Restore scrolling
                        
                        // Remove from DOM eventually
                        setTimeout(() => {
                            startupOverlay.remove();
                        }, 1000);
                    }, stepDuration);
                }
            }, delaySum);
            delaySum += stepDuration - 100; // slight overlap
        });
    }

    // ----------------------------------------------------
    // SYSTEM DATE & TIME
    // ----------------------------------------------------
    document.getElementById('year').textContent = new Date().getFullYear();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString('en-US', options) + " // SYS.SYNC";
    
    // ----------------------------------------------------
    // MOBILE NAV TOGGLE
    // ----------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.menu-toggle') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // ----------------------------------------------------
    // SCROLL INTERACTIONS
    // ----------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
            
            if (formAction && formAction.includes("YOUR_FORMSPREE_ID")) {
                alert("SYSTEM MSG: Please create a free account at formspree.io and update the 'YOUR_FORMSPREE_ID' in index.html form action attribute with your actual endpoint to enable email sending.");
                return;
            }

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
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
        let numParticles = Math.floor((width * height) / 15000); // Responsive density
        
        // Settings
        const config = {
            particleColor: 'rgba(197, 160, 89, 0.4)',
            lineColor: 'rgba(197, 160, 89, 0.15)',
            particleRadius: 2.5,
            lineDistance: 140,
            baseSpeed: 0.15
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
                // Movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interaction - repel
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
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

                // Connect particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.lineDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(197, 160, 89, ${0.2 - distance/config.lineDistance * 0.2})`;
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
