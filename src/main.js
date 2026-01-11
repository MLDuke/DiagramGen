import CONFIG from './config.js';
import Diagram from './core/Diagram.js';
import RadialGenerator from './generators/RadialGenerator.js';

// Global diagram instance
let diagram;

// Generator instance
let radialGenerator;

/**
 * P5.js setup function - runs once at start
 */
window.setup = function() {
  const canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  canvas.parent(document.body);

  // Center origin at canvas center
  translate(width / 2, height / 2);

  // Create global diagram instance
  diagram = new Diagram();

  // Create generator
  radialGenerator = new RadialGenerator();

  // Generate initial radial pattern with default parameters
  diagram.generate(radialGenerator);
};

/**
 * P5.js draw function - runs continuously
 */
window.draw = function() {
  // Apply dark background
  background(CONFIG.canvas.backgroundColor);

  // Center origin for all drawing operations
  push();
  translate(width / 2, height / 2);

  // Update and render diagram
  diagram.update();
  diagram.render();

  pop();
};

/**
 * P5.js keyPressed function - handles keyboard input
 */
window.keyPressed = function() {
  if (key === 'r' || key === 'R') {
    // Generate random node count between 8 and 20
    const randomNodeCount = floor(random(8, 21));

    // Regenerate with random node count
    diagram.generate(radialGenerator, { nodeCount: randomNodeCount });
  }
};
