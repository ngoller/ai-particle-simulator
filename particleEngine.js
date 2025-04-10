class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 5;
        this.color = options.color || '#ffffff';
        this.life = options.life || 1.0;
        this.decay = options.decay || 0.01;
        this.gravity = options.gravity || 0.1;
        this.friction = options.friction || 0.99;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;

        this.life -= this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ParticleEmitter {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.rate = options.rate || 5;
        this.maxParticles = options.maxParticles || 1000;
        this.particleOptions = options.particleOptions || {};
    }

    emit() {
        if (this.particles.length < this.maxParticles) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2;
            const particle = new Particle(this.x, this.y, {
                ...this.particleOptions,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            });
            this.particles.push(particle);
        }
    }

    update() {
        // Emit new particles
        for (let i = 0; i < this.rate; i++) {
            this.emit();
        }

        // Update existing particles
        this.particles = this.particles.filter(particle => particle.update());
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.emitters = [];

        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse interaction
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Start animation loop
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a new emitter at mouse position
        this.emitters.push(new ParticleEmitter(x, y, {
            rate: 2,
            maxParticles: 200,
            particleOptions: {
                size: 3,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                life: 1.0,
                decay: 0.01,
                gravity: 0.05
            }
        }));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all emitters
        this.emitters.forEach(emitter => {
            emitter.update();
            emitter.draw(this.ctx);
        });

        // Remove emitters with no particles
        this.emitters = this.emitters.filter(emitter => emitter.particles.length > 0);

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle engine
const engine = new ParticleEngine('particleCanvas'); 