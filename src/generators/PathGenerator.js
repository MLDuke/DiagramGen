import Generator from './Generator.js';
import Node from '../core/Node.js';
import Connection from '../core/Connection.js';

/**
 * PathGenerator - Creates flowing curved paths across the canvas
 */
class PathGenerator extends Generator {
  constructor() {
    super('PathGenerator');
  }

  /**
   * Get default parameters for path generation
   * @returns {Object} Default parameters
   */
  getDefaultParams() {
    return {
      pathCount: 5,
      nodesPerPath: 10,
      waveAmplitude: 100,
      waveFrequency: 0.02,
      horizontalSpacing: 150,
      connectSequential: true
    };
  }

  /**
   * Generate flowing path diagram pattern
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

    const allPaths = [];

    // Create multiple flowing paths
    for (let pathIndex = 0; pathIndex < config.pathCount; pathIndex++) {
      const pathNodes = [];

      // Calculate vertical position for this path
      const pathY = (pathIndex - (config.pathCount - 1) / 2) * (config.waveAmplitude * 0.8);

      // Create nodes along this path
      for (let nodeIndex = 0; nodeIndex < config.nodesPerPath; nodeIndex++) {
        // Calculate horizontal position
        const t = nodeIndex / (config.nodesPerPath - 1);
        const x = (t - 0.5) * config.horizontalSpacing * (config.nodesPerPath / 2);

        // Use Perlin noise for organic curves
        const noiseOffset = pathIndex * 100 + nodeIndex * 10;
        const noiseValue = noise(noiseOffset * config.waveFrequency);

        // Calculate vertical position with wave
        const wave = sin(nodeIndex * config.waveFrequency * TWO_PI * 2) * config.waveAmplitude * 0.5;
        const noiseWave = (noiseValue - 0.5) * config.waveAmplitude;
        const y = pathY + wave * 0.3 + noiseWave * 0.7;

        // Create node
        const position = createVector(x, y);
        const node = new Node(position, `path_${pathIndex}_node_${nodeIndex}`);

        pathNodes.push(node);
        diagram.nodes.push(node);
      }

      allPaths.push(pathNodes);

      // Connect sequential nodes within this path
      if (config.connectSequential) {
        for (let i = 0; i < pathNodes.length - 1; i++) {
          const currentNode = pathNodes[i];
          const nextNode = pathNodes[i + 1];

          const connection = new Connection(currentNode, nextNode, 'straight');
          diagram.connections.push(connection);

          currentNode.connect(nextNode);
        }
      }
    }
  }
}

export default PathGenerator;
