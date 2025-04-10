# Particle Engine

A TypeScript-based particle simulation engine that creates interactive sand, water, and fire particles using Matter.js physics.

## Features

- Three particle types:
  - Sand: Dense particles that pile up realistically
  - Water: Fluid particles with lower density and friction
  - Fire: Glowing particles with unique properties
- Real-time physics simulation using Matter.js
- Mouse interaction for creating particles
- Continuous building with TypeScript watch mode

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server with continuous building:
```bash
npm run dev
```

3. Open your browser to `http://localhost:8080`

## How to Use

1. Select a particle type using the particle selector
2. Click and drag on the canvas to create particles
3. Watch particles interact with each other and the environment:
   - Sand particles will pile up and form mounds
   - Water particles will flow and spread out
   - Fire particles will rise and glow

## Code Structure

The particle engine is built using TypeScript and Matter.js:

- `src/particleEngine.ts`: Main engine implementation
  - `ParticleEngine` class handles:
    - Particle creation and physics
    - Mouse interaction
    - Canvas rendering
    - Matter.js integration

- Key components:
  - Matter.js engine for physics simulation
  - HTML5 Canvas for rendering
  - Event listeners for mouse interaction
  - TypeScript for type safety and better development experience

## Development

- The code uses TypeScript for better type safety and development experience
- Continuous building is set up using `tsc -w`
- The HTTP server serves the compiled files
- Changes to TypeScript files will automatically trigger recompilation

## Commands

- `npm run dev`: Start development server with continuous building
- `npm run watch`: Run TypeScript compiler in watch mode
- `npm run start`: Start the HTTP server only
- `npm run build`: Build TypeScript files once

## Dependencies

- Matter.js: Physics engine
- TypeScript: Programming language
- http-server: Static file server
- concurrently: Run multiple commands simultaneously 