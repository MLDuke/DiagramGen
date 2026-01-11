import CONFIG from './config.js';
import Diagram from './core/Diagram.js';
import RadialGenerator from './generators/RadialGenerator.js';
import PathGenerator from './generators/PathGenerator.js';
import HybridGenerator from './generators/HybridGenerator.js';
import NodeRenderer from './renderers/NodeRenderer.js';
import ConnectionRenderer from './renderers/ConnectionRenderer.js';
import Controls from './ui/Controls.js';

// Global diagram instance
let diagram;

// Generator instances
let radialGenerator;
let pathGenerator;
let hybridGenerator;

// Current active generator
let currentGenerator;

// UI Controls
let controls;

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
  hybridGenerator = new HybridGenerator();

  // Set initial generator
  currentGenerator = radialGenerator;

  // Initialize UI controls
  controls = new Controls();
  controls.init(handleGeneratorChange, handleParameterChange, handleStyleChange);
  controls.setGenerator('radial');
  controls.updateSliders(currentGenerator);

  // Generate initial pattern with default parameters
  diagram.generate(currentGenerator);
};

/**
 * Handle generator change from UI
 * @param {string} generatorType - Type of generator ('radial', 'path', 'hybrid')
 */
function handleGeneratorChange(generatorType) {
  switch (generatorType) {
    case 'radial':
      currentGenerator = radialGenerator;
      break;
    case 'path':
      currentGenerator = pathGenerator;
      break;
    case 'hybrid':
      currentGenerator = hybridGenerator;
      break;
  }

  // Update sliders for new generator
  controls.updateSliders(currentGenerator);

  // Generate with new generator
  diagram.generate(currentGenerator);
}

/**
 * Handle parameter change from UI
 * @param {string} param - Parameter name
 * @param {number} value - New parameter value
 */
function handleParameterChange(param, value) {
  // Generate with updated parameter
  const params = {};
  params[param] = value;
  diagram.generate(currentGenerator, params);
}

/**
 * Handle style change from UI
 * @param {string} styleKey - Style property key
 * @param {*} value - New style value
 */
function handleStyleChange(styleKey, value) {
  // Update CONFIG based on styleKey
  switch (styleKey) {
    case 'nodeSize':
      CONFIG.rendering.nodes.size = value;
      break;
    case 'nodeColor':
      CONFIG.rendering.nodes.fill = value;
      CONFIG.rendering.nodes.stroke = value;
      break;
    case 'nodeStrokeWeight':
      CONFIG.rendering.nodes.strokeWeight = value;
      break;
    case 'connectionWeight':
      CONFIG.rendering.connections.strokeWeight = value;
      break;
    case 'connectionColor':
      CONFIG.rendering.connections.stroke = value;
      break;
    case 'connectionAlpha':
      CONFIG.rendering.connections.alpha = value;
      break;
    case 'connectionType':
      CONFIG.rendering.connections.type = value;
      break;
    case 'curveAmount':
      CONFIG.rendering.connections.curveAmount = value;
      break;
    case 'backgroundColor':
      CONFIG.canvas.backgroundColor = value;
      break;
  }

  // Regenerate diagram with current parameters to apply new styles
  diagram.generate(currentGenerator);
}

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
}

/**
 * P5.js keyPressed function - handles keyboard input
 */
window.keyPressed = function() {
  if (key === 's' || key === 'S') {
    // Save canvas as PNG
    save('diagram.png');
  }
};
