import Generator from './Generator.js';
import Node from '../core/Node.js';
import Connection from '../core/Connection.js';

/**
 * HybridGenerator - Combines radial and path patterns
 * Creates a central radial hub with flowing paths extending outward
 */
class HybridGenerator extends Generator {
  constructor() {
    super('HybridGenerator');
  }

  /**
   * Get default parameters for hybrid generation
   * @returns {Object} Default parameters
   */
  getDefaultParams() {
    return {
      // Radial hub parameters
      hubNodeCount: 8,
      hubRadius: 100,
      hubRotation: 0,

      // Path parameters
      pathsPerNode: 1,
      nodesPerPath: 6,
      pathLength: 250,
      pathCurve: 50,

      // Connection parameters
      connectHub: true,
      connectPaths: true,
      connectHubToPaths: true
    };
  }

  /**
   * Generate hybrid radial-path diagram pattern
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

    const hubNodes = [];
    const pathsByHub = [];

    // Create central radial hub
    const angleStep = TWO_PI / config.hubNodeCount;

    for (let i = 0; i < config.hubNodeCount; i++) {
      const angle = i * angleStep + config.hubRotation;
      const x = cos(angle) * config.hubRadius;
      const y = sin(angle) * config.hubRadius;

      const position = createVector(x, y);
      const node = new Node(position, `hub_${i}`);

      hubNodes.push(node);
      diagram.nodes.push(node);
    }

    // Connect hub nodes in a circle
    if (config.connectHub) {
      for (let i = 0; i < hubNodes.length; i++) {
        const currentNode = hubNodes[i];
        const nextNode = hubNodes[(i + 1) % hubNodes.length];

        const connection = new Connection(currentNode, nextNode, 'straight');
        diagram.connections.push(connection);
        currentNode.connect(nextNode);
      }
    }

    // Create flowing paths extending from each hub node
    for (let hubIndex = 0; hubIndex < hubNodes.length; hubIndex++) {
      const hubNode = hubNodes[hubIndex];
      const hubAngle = hubIndex * angleStep + config.hubRotation;

      pathsByHub[hubIndex] = [];

      for (let pathIndex = 0; pathIndex < config.pathsPerNode; pathIndex++) {
        const pathNodes = [hubNode]; // Start path from hub node

        // Calculate path direction (spread paths if multiple per node)
        const pathAngleOffset = config.pathsPerNode > 1
          ? (pathIndex - (config.pathsPerNode - 1) / 2) * 0.3
          : 0;
        const pathDirection = hubAngle + pathAngleOffset;

        // Create nodes along the path extending outward
        for (let nodeIndex = 1; nodeIndex <= config.nodesPerPath; nodeIndex++) {
          const t = nodeIndex / config.nodesPerPath;

          // Calculate distance from hub
          const distance = config.hubRadius + (config.pathLength * t);

          // Use Perlin noise for organic curves
          const noiseOffset = hubIndex * 100 + pathIndex * 50 + nodeIndex * 10;
          const noiseValue = noise(noiseOffset * 0.02);

          // Calculate position with curve
          const curveOffset = (noiseValue - 0.5) * config.pathCurve * t;
          const angle = pathDirection + curveOffset * 0.01;

          const x = cos(angle) * distance;
          const y = sin(angle) * distance;

          const position = createVector(x, y);
          const node = new Node(position, `hub_${hubIndex}_path_${pathIndex}_node_${nodeIndex}`);

          pathNodes.push(node);
          diagram.nodes.push(node);
        }

        pathsByHub[hubIndex].push(pathNodes);

        // Connect nodes sequentially along the path
        if (config.connectPaths) {
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

    // Optional: Connect hub to path endpoints for web-like structure
    if (config.connectHubToPaths && config.pathsPerNode > 0) {
      for (let hubIndex = 0; hubIndex < hubNodes.length; hubIndex++) {
        const paths = pathsByHub[hubIndex];

        // Connect to adjacent hub's paths for a web effect
        const nextHubIndex = (hubIndex + 1) % hubNodes.length;
        const nextPaths = pathsByHub[nextHubIndex];

        if (paths.length > 0 && nextPaths.length > 0) {
          // Connect the outermost nodes of adjacent paths
          const lastNodeCurrent = paths[0][paths[0].length - 1];
          const lastNodeNext = nextPaths[nextPaths.length - 1][nextPaths[nextPaths.length - 1].length - 1];

          const connection = new Connection(lastNodeCurrent, lastNodeNext, 'straight');
          diagram.connections.push(connection);
          lastNodeCurrent.connect(lastNodeNext);
        }
      }
    }
  }
}

export default HybridGenerator;
