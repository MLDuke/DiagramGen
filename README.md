# Diagram Generator

A generative node-based diagram tool built with P5.js for creating animated, shader-enhanced visual diagrams.

## Overview

This project creates parametric diagrams inspired by Art Nouveau geometry, network visualizations, and parametric design. Built with vanilla JavaScript and P5.js, it provides a flexible system for generating and rendering node-based diagrams with customizable aesthetics.

## Features

- Node-based diagram system
- Flexible connection types (straight, bezier, arc)
- Modular architecture with generators, renderers, and modifiers
- Export capabilities
- Dark aesthetic with high-contrast rendering

## Technology Stack

- P5.js (creative coding framework)
- Vanilla JavaScript (ES6+)
- HTML/CSS (minimal UI)

## Getting Started

1. Open `index.html` in a modern web browser
2. The canvas will display at 1200x800 with a dark background

## Project Structure

```
DiagramGen/
├── index.html          # Main HTML file
├── styles.css          # Minimal styling
├── src/
│   ├── main.js         # P5 sketch entry point
│   ├── config.js       # Global configuration
│   └── core/
│       ├── Node.js     # Node class
│       ├── Connection.js # Connection class
│       └── Diagram.js  # Diagram manager
```

## Configuration

All defaults are defined in `src/config.js`:
- Canvas size: 1200x800
- Background: #0a0a0a (dark)
- Node color: white
- Connection color: white

## Development

The project follows strict coding conventions documented in `claude_context.md`. Key principles:
- One class per file
- ES6+ syntax
- JSDoc comments
- Centered origin for easier radial patterns
- Modular, single-purpose methods

## License

MIT
