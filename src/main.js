import CONFIG from './config.js';
import Diagram from './core/Diagram.js';

// Global diagram instance
let diagram;

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
