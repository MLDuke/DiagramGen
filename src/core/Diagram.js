import CONFIG from '../config.js';

/**
 * Diagram class - Container managing nodes, connections, and rendering
 */
class Diagram {
  constructor() {
    this.nodes = [];
    this.connections = [];
  }

  /**
   * Clear all nodes and connections from the diagram
   */
  clear() {
    this.nodes = [];
    this.connections = [];
  }

  /**
   * Update diagram state (for animations and modifiers)
   */
  update() {
    // Placeholder for future update logic
  }

  /**
   * Render the diagram to the canvas
   */
  render() {
    // Render connections
    this._renderConnections();

    // Render nodes
    this._renderNodes();
  }

  /**
   * Render all connections
   * @private
   */
  _renderConnections() {
    const config = CONFIG.rendering.connections;

    stroke(config.stroke);
    strokeWeight(config.strokeWeight);
    if (config.fill) {
      fill(config.fill);
    } else {
      noFill();
    }

    for (const connection of this.connections) {
      const posA = connection.nodeA.position;
      const posB = connection.nodeB.position;

      if (connection.type === 'straight') {
        line(posA.x, posA.y, posB.x, posB.y);
      } else if (connection.type === 'bezier' && connection.controlPoints.length >= 2) {
        const cp1 = connection.controlPoints[0];
        const cp2 = connection.controlPoints[1];
        bezier(posA.x, posA.y, cp1.x, cp1.y, cp2.x, cp2.y, posB.x, posB.y);
      } else if (connection.type === 'arc' && connection.controlPoints.length >= 1) {
        // Simple arc implementation (can be enhanced)
        const cp = connection.controlPoints[0];
        noFill();
        beginShape();
        vertex(posA.x, posA.y);
        quadraticVertex(cp.x, cp.y, posB.x, posB.y);
        endShape();
      }
    }
  }

  /**
   * Render all nodes
   * @private
   */
  _renderNodes() {
    const config = CONFIG.rendering.nodes;

    if (config.stroke) {
      stroke(config.stroke);
      strokeWeight(config.strokeWeight);
    } else {
      noStroke();
    }

    fill(config.fill);

    for (const node of this.nodes) {
      const pos = node.position;
      ellipse(pos.x, pos.y, config.size, config.size);
    }
  }

  /**
   * Export diagram data as JSON
   * @returns {Object} Serialized diagram data
   */
  exportData() {
    return {
      nodes: this.nodes.map(node => ({
        id: node.id,
        position: { x: node.position.x, y: node.position.y },
        data: node.data
      })),
      connections: this.connections.map(connection => ({
        nodeA: connection.nodeA.id,
        nodeB: connection.nodeB.id,
        type: connection.type,
        controlPoints: connection.controlPoints.map(cp => ({ x: cp.x, y: cp.y })),
        data: connection.data
      }))
    };
  }
}

export default Diagram;
