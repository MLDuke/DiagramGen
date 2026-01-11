import CONFIG from './config.js';
import Diagram from './core/Diagram.js';
import RadialGenerator from './generators/RadialGenerator.js';
import NodeRenderer from './renderers/NodeRenderer.js';
import ConnectionRenderer from './renderers/ConnectionRenderer.js';

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

  // Create renderers
  const nodeRenderer = new NodeRenderer();
  const connectionRenderer = new ConnectionRenderer();

  // Create global diagram instance with renderers
  diagram = new Diagram(nodeRenderer, connectionRenderer);

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

  // Display parameters in top-left corner
  _displayParameters();
};

/**
 * Display current generator parameters
 * @private
 */
function _displayParameters() {
  push();

  // Set text properties
  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  noStroke();

  // Position in top-left corner
  const x = 20;
  const y = 20;
  const lineHeight = 16;

  // Display generator name
  text(`Generator: ${radialGenerator.name}`, x, y);

  // Display key parameters
  if (radialGenerator.params) {
    const params = radialGenerator.params;
    text(`Nodes: ${params.nodeCount}`, x, y + lineHeight);
    text(`Outer Radius: ${round(params.outerRadius)}`, x, y + lineHeight * 2);
    text(`Jitter: ${round(params.jitter)}`, x, y + lineHeight * 3);
    text(`Rotation: ${round(degrees(params.rotation))}°`, x, y + lineHeight * 4);
  }

  // Display keyboard shortcuts
  text(`[R] Random Nodes | [J] Random Jitter | [O] Random Radius | [S] Save`, x, y + lineHeight * 6);

  pop();
}

/**
 * P5.js keyPressed function - handles keyboard input
 */
window.keyPressed = function() {
  if (key === 'r' || key === 'R') {
    // Generate random node count between 8 and 24
    const randomNodeCount = floor(random(8, 25));
    diagram.generate(radialGenerator, { nodeCount: randomNodeCount });
  } else if (key === 'j' || key === 'J') {
    // Generate with random jitter between 0 and 20
    const randomJitter = random(0, 21);
    diagram.generate(radialGenerator, { jitter: randomJitter });
  } else if (key === 'o' || key === 'O') {
    // Generate with random outer radius between 150 and 300
    const randomRadius = random(150, 301);
    diagram.generate(radialGenerator, { outerRadius: randomRadius });
  } else if (key === 's' || key === 'S') {
    // Save canvas as PNG
    save('diagram.png');
  }
};
