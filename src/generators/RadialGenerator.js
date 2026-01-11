import Generator from './Generator.js';
import Node from '../core/Node.js';
import Connection from '../core/Connection.js';

/**
 * RadialGenerator - Creates nodes in a circular pattern around the origin
 */
class RadialGenerator extends Generator {
  constructor() {
    super('RadialGenerator');
  }

  /**
   * Get default parameters for radial generation
   * @returns {Object} Default parameters
   */
  getDefaultParams() {
    return {
      nodeCount: 12,
      innerRadius: 0,
      outerRadius: 200,
      rotation: 0,
      jitter: 0,
      connectAdjacent: true
    };
  }

  /**
   * Generate a radial diagram pattern
   * @param {Diagram} diagram - The diagram to populate
   * @param {Object} params - Generation parameters
   */
  generate(diagram, params) {
    // Merge provided params with defaults
    const config = { ...this.getDefaultParams(), ...params };

    // Store current params for display
    this.params = config;

    // Clear existing diagram
    diagram.clear();

    const nodes = [];
    const angleStep = TWO_PI / config.nodeCount;

    // Create nodes in a circle or ring
    for (let i = 0; i < config.nodeCount; i++) {
      const angle = i * angleStep + config.rotation;

      // Calculate radius (for ring patterns, interpolate between inner and outer)
      const radius = config.innerRadius === 0
        ? config.outerRadius
        : config.innerRadius + (config.outerRadius - config.innerRadius);

      // Calculate base position
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      // Apply jitter if specified
      if (config.jitter > 0) {
        x += random(-config.jitter, config.jitter);
        y += random(-config.jitter, config.jitter);
      }

      const position = createVector(x, y);
      const node = new Node(position, `node_${i}`);

      nodes.push(node);
      diagram.nodes.push(node);
    }

    // Create connections between adjacent nodes
    if (config.connectAdjacent) {
      for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        const nextNode = nodes[(i + 1) % nodes.length];

        const connection = new Connection(currentNode, nextNode, 'straight');
        diagram.connections.push(connection);

        // Also add to node's connection list
        currentNode.connect(nextNode);
      }
    }
  }
}

export default RadialGenerator;
