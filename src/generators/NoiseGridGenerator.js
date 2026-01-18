import Generator from './Generator.js';
import Node from '../core/Node.js';
import Connection from '../core/Connection.js';

/**
 * NoiseGridGenerator - Creates organic grid patterns using Perlin noise
 * Uses noise to determine node existence, displacement, and connections
 */
class NoiseGridGenerator extends Generator {
  constructor() {
    super('NoiseGrid');
  }

  /**
   * Get default parameters for the generator
   * @returns {Object} Default parameters
   */
  getDefaultParams() {
    return {
      gridSize: 8,              // Number of nodes per row/column
      spacing: 80,              // Distance between grid points
      noiseScale: 0.15,         // Scale of noise for node existence (lower = smoother)
      noiseThreshold: 0.3,      // Threshold for node creation (-1 to 1, lower = more nodes)
      displacementAmount: 30,   // Maximum displacement from grid position
      displacementScale: 0.1,   // Scale of displacement noise
      connectionRadius: 150,    // Maximum distance for connections
      connectionProbability: 0.7, // Base probability of creating connection
      noiseSeed: 0              // Seed offset for noise variation
    };
  }

  /**
   * Generate the noise grid diagram
   * @param {Diagram} diagram - The diagram to populate
   * @param {Object} params - Generator parameters
   */
  generate(diagram, params) {
    const config = { ...this.getDefaultParams(), ...params };

    // Store params for reference
    this.params = config;

    // Clear existing diagram
    diagram.clear();

    // Calculate grid dimensions
    const halfSize = (config.gridSize - 1) * config.spacing / 2;

    // Phase 1: Generate potential grid positions and use noise to decide which to keep
    const potentialNodes = [];

    for (let row = 0; row < config.gridSize; row++) {
      for (let col = 0; col < config.gridSize; col++) {
        // Calculate base grid position (centered)
        const baseX = col * config.spacing - halfSize;
        const baseY = row * config.spacing - halfSize;

        // Use noise to determine if this node should exist
        const noiseValue = noise(
          col * config.noiseScale + config.noiseSeed,
          row * config.noiseScale + config.noiseSeed
        );

        // Keep node if noise exceeds threshold
        if (noiseValue > config.noiseThreshold) {
          // Use different noise for displacement
          const displaceX = noise(
            col * config.displacementScale + 1000 + config.noiseSeed,
            row * config.displacementScale + 1000 + config.noiseSeed
          ) * config.displacementAmount;

          const displaceY = noise(
            col * config.displacementScale + 2000 + config.noiseSeed,
            row * config.displacementScale + 2000 + config.noiseSeed
          ) * config.displacementAmount;

          // Calculate final position with displacement
          const finalX = baseX + displaceX;
          const finalY = baseY + displaceY;

          // Create node
          const node = new Node(createVector(finalX, finalY));
          node.data.gridPosition = { row, col };
          node.data.noiseValue = noiseValue;

          potentialNodes.push({
            node,
            row,
            col,
            baseX,
            baseY
          });

          diagram.nodes.push(node);
        }
      }
    }

    // Phase 2: Create connections between nearby nodes
    for (let i = 0; i < potentialNodes.length; i++) {
      const nodeA = potentialNodes[i].node;

      for (let j = i + 1; j < potentialNodes.length; j++) {
        const nodeB = potentialNodes[j].node;

        // Calculate distance
        const distance = nodeA.position.dist(nodeB.position);

        // Only connect if within radius
        if (distance < config.connectionRadius) {
          // Use distance-based probability (closer = more likely)
          const distanceFactor = 1 - (distance / config.connectionRadius);
          const probability = config.connectionProbability * distanceFactor;

          // Use noise to add organic variation to connection probability
          const connectionNoise = noise(
            nodeA.position.x * 0.01 + nodeB.position.x * 0.01 + config.noiseSeed,
            nodeA.position.y * 0.01 + nodeB.position.y * 0.01 + config.noiseSeed
          );

          // Create connection based on probability + noise
          if (random() < probability && connectionNoise > 0) {
            const connection = new Connection(nodeA, nodeB);
            diagram.connections.push(connection);
          }
        }
      }
    }
  }
}

export default NoiseGridGenerator;
