import CONFIG from './config.js';
import Diagram from './core/Diagram.js';
import RadialGenerator from './generators/RadialGenerator.js';
import PathGenerator from './generators/PathGenerator.js';
import NodeRenderer from './renderers/NodeRenderer.js';
import ConnectionRenderer from './renderers/ConnectionRenderer.js';

// Global diagram instance
let diagram;

// Generator instances
let radialGenerator;
let pathGenerator;

// Current active generator
let currentGenerator;

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

  // Create generators
  radialGenerator = new RadialGenerator();
  pathGenerator = new PathGenerator();

  // Set initial generator
  currentGenerator = radialGenerator;

  // Generate initial pattern with default parameters
  diagram.generate(currentGenerator);
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
  text(`Generator: ${currentGenerator.name}`, x, y);

  // Display key parameters based on generator type
  if (currentGenerator.params) {
    const params = currentGenerator.params;

    if (currentGenerator === radialGenerator) {
      text(`Nodes: ${params.nodeCount}`, x, y + lineHeight);
      text(`Outer Radius: ${round(params.outerRadius)}`, x, y + lineHeight * 2);
      text(`Jitter: ${round(params.jitter)}`, x, y + lineHeight * 3);
      text(`Rotation: ${round(degrees(params.rotation))}°`, x, y + lineHeight * 4);
    } else if (currentGenerator === pathGenerator) {
      text(`Paths: ${params.pathCount}`, x, y + lineHeight);
      text(`Nodes/Path: ${params.nodesPerPath}`, x, y + lineHeight * 2);
      text(`Wave Amplitude: ${round(params.waveAmplitude)}`, x, y + lineHeight * 3);
      text(`Frequency: ${params.waveFrequency.toFixed(3)}`, x, y + lineHeight * 4);
    }
  }

  // Display keyboard shortcuts
  text(`[P] Path Gen | [C] Radial Gen | [R/J/O] Random | [S] Save`, x, y + lineHeight * 6);

  pop();
}

/**
 * P5.js keyPressed function - handles keyboard input
 */
window.keyPressed = function() {
  if (key === 'p' || key === 'P') {
    // Switch to PathGenerator
    currentGenerator = pathGenerator;
    diagram.generate(currentGenerator);
  } else if (key === 'c' || key === 'C') {
    // Switch to RadialGenerator
    currentGenerator = radialGenerator;
    diagram.generate(currentGenerator);
  } else if (key === 'r' || key === 'R') {
    // Randomize primary count parameter (nodes or paths)
    if (currentGenerator === radialGenerator) {
      const randomNodeCount = floor(random(8, 25));
      diagram.generate(currentGenerator, { nodeCount: randomNodeCount });
    } else if (currentGenerator === pathGenerator) {
      const randomPathCount = floor(random(3, 9));
      diagram.generate(currentGenerator, { pathCount: randomPathCount });
    }
  } else if (key === 'j' || key === 'J') {
    // Randomize variation parameter (jitter or wave amplitude)
    if (currentGenerator === radialGenerator) {
      const randomJitter = random(0, 21);
      diagram.generate(currentGenerator, { jitter: randomJitter });
    } else if (currentGenerator === pathGenerator) {
      const randomAmplitude = random(50, 150);
      diagram.generate(currentGenerator, { waveAmplitude: randomAmplitude });
    }
  } else if (key === 'o' || key === 'O') {
    // Randomize size parameter (outer radius or nodes per path)
    if (currentGenerator === radialGenerator) {
      const randomRadius = random(150, 301);
      diagram.generate(currentGenerator, { outerRadius: randomRadius });
    } else if (currentGenerator === pathGenerator) {
      const randomNodesPerPath = floor(random(6, 16));
      diagram.generate(currentGenerator, { nodesPerPath: randomNodesPerPath });
    }
  } else if (key === 's' || key === 'S') {
    // Save canvas as PNG
    save('diagram.png');
  }
};
