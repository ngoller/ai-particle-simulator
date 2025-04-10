const { Engine, Render, World, Bodies, Body, Composite, Vector } = Matter;
export class ParticleEngine {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Canvas element not found');
        }
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;
        this.particles = [];
        this.isMouseDown = false;
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / 60;
        this.currentParticleType = 'sand';
        // Initialize Matter.js
        this.engine = Engine.create();
        // Set up the renderer
        this.render = Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                showDebug: false,
                showCollisions: false,
                showVelocity: false,
                showIds: false,
                showBounds: false,
                showAngleIndicator: false,
                showStats: false
            }
        });
        // Start the renderer and engine
        Render.run(this.render);
        Engine.run(this.engine);
        // Add walls
        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        Composite.add(this.engine.world, [ground, leftWall, rightWall]);
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        // Mouse interaction
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        // Start animation loop
        this.animate();
    }
    setParticleType(type) {
        this.currentParticleType = type;
    }
    createParticle(x, y) {
        const baseOptions = {
            friction: 0.1,
            restitution: 0.3,
            density: 0.001,
            render: {
                strokeStyle: 'transparent',
                lineWidth: 0
            }
        };
        let particle;
        switch (this.currentParticleType) {
            case 'sand':
                particle = Bodies.circle(x, y, 6, {
                    ...baseOptions,
                    friction: 0.8,
                    density: 0.001,
                    render: {
                        ...baseOptions.render,
                        fillStyle: '#c2b280'
                    }
                });
                break;
            case 'water':
                particle = Bodies.circle(x, y, 8, {
                    ...baseOptions,
                    friction: 0.1,
                    density: 0.0005,
                    render: {
                        ...baseOptions.render,
                        fillStyle: '#4d80e6'
                    }
                });
                break;
            case 'fire':
                particle = Bodies.circle(x, y, 6, {
                    ...baseOptions,
                    friction: 0.8,
                    density: 0.001,
                    render: {
                        ...baseOptions.render,
                        fillStyle: '#ff4500'
                    }
                });
                break;
            default:
                particle = Bodies.circle(x, y, 6, baseOptions);
        }
        return particle;
    }
    handleMouseDown(e) {
        this.isMouseDown = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            const particle = this.createParticle(x + offsetX, y + offsetY);
            this.particles.push(particle);
            Composite.add(this.engine.world, particle);
        }
    }
    handleMouseMove(e) {
        if (this.isMouseDown) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Create particles while moving
            for (let i = 0; i < 5; i++) {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                const particle = this.createParticle(x + offsetX, y + offsetY);
                this.particles.push(particle);
                Composite.add(this.engine.world, particle);
            }
        }
    }
    handleMouseUp() {
        this.isMouseDown = false;
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render.canvas.width = window.innerWidth;
        this.render.canvas.height = window.innerHeight;
        this.render.options.width = window.innerWidth;
        this.render.options.height = window.innerHeight;
    }
    animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        if (deltaTime >= this.updateInterval) {
            Engine.update(this.engine, deltaTime);
            // Remove particles that are out of bounds
            this.particles = this.particles.filter(particle => {
                if (particle.position.y > window.innerHeight + 100) {
                    Composite.remove(this.engine.world, particle);
                    return false;
                }
                return true;
            });
            this.lastUpdateTime = currentTime;
        }
        requestAnimationFrame(() => this.animate());
    }
}
