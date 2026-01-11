# Diagram Generator - Claude Code Context

## Project Overview
A generative node-based diagram tool built with P5.js for creating animated, shader-enhanced visual diagrams. Inspired by Art Nouveau geometry, network visualizations, and parametric design.

## Technology Stack
- P5.js (creative coding framework)
- Vanilla JavaScript (ES6+)
- WebGL/GLSL shaders (for visual effects)
- HTML/CSS (minimal UI)

## Code Style & Conventions

### JavaScript
- Use ES6 class syntax
- Use `const` and `let`, never `var`
- Descriptive variable names (e.g., `nodeCount` not `nc`)
- Methods should be verb-based (e.g., `generateNodes()`, `applyModifier()`)
- Add JSDoc comments for classes and complex methods
- Keep methods focused and single-purpose

### File Organization
- One class per file
- File names match class names (PascalCase)
- Group related files in subdirectories (`core/`, `generators/`, etc.)
- Imports at top of file

### P5.js Conventions
- Use P5 vector objects for positions (`createVector()`)
- Origin at canvas center (apply translate in setup)
- Use radians for angles
- Prefer `push()`/`pop()` for isolated transformations

## Architecture Principles

### Core Classes
- **Node**: Represents a point with position, connections, and data
- **Connection**: Links two nodes with optional curve styling
- **Diagram**: Container managing nodes, connections, and rendering

### Generator Pattern
- Generators create diagram structures (nodes + connections)
- Each generator extends base `Generator` class
- Generators are stateless - all config via params
- Must implement: `generate(diagram, params)`

### Renderer Pattern
- Renderers are responsible for drawing
- Separate renderers for nodes vs connections
- Renderers receive entire diagram and loop through elements
- Style properties come from CONFIG or element.data

### Modifier Pattern (future)
- Modifiers transform existing diagrams
- Applied after generation, before rendering
- Examples: noise displacement, physics, attraction

## Configuration
- All defaults in `src/config.js`
- Organized by concern: canvas, rendering, generators, etc.
- Use CONFIG object throughout codebase

## Naming Conventions
- Classes: PascalCase (e.g., `RadialGenerator`)
- Files: PascalCase matching class (e.g., `RadialGenerator.js`)
- Variables/functions: camelCase (e.g., `nodeCount`, `generateNodes()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_NODES`)
- Private methods: prefix with underscore (e.g., `_calculatePosition()`)

## Development Workflow
- Test after each feature addition
- Commit working states frequently
- Keep features modular and independent
- Build incrementally - simple first, complex later

## Current Project State
[Update this as you progress]
- ✅ Basic structure established
- ✅ Node, Connection, Diagram classes
- ✅ RadialGenerator implemented
- 🔄 Currently working on: [update this]
- ⏭️ Next: [what's coming]

## Design Goals
- Clean, minimal aesthetics (Art Nouveau meets data viz)
- Vector-quality rendering (crisp lines, precise curves)
- High degree of customization via parameters
- Support for animation and real-time interaction
- Shader-based visual effects
- Export capabilities (PNG, SVG eventually)

## Visual Style References
- Precise geometric construction
- Flowing organic curves
- Clean line work
- High contrast (dark backgrounds, light lines)
- Typography integrated into structure
- Network/node aesthetics

## Important Notes
- Center origin makes radial patterns easier
- Always check node position validity before rendering
- Use `originalPosition` for modifiers to reference unmodified state
- Keep rendering performant (avoid unnecessary calculations in draw loop)
```
