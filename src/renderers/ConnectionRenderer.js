import Renderer from './Renderer.js';
import CONFIG from '../config.js';

/**
 * ConnectionRenderer - Renders connections between nodes
 */
class ConnectionRenderer extends Renderer {
  /**
   * Render all connections in the diagram
   * @param {Diagram} diagram - The diagram containing connections to render
   */
  render(diagram) {
    noFill();

    for (const connection of diagram.connections) {
      const posA = connection.nodeA.position;
      const posB = connection.nodeB.position;

      // Get stroke weight from connection data or CONFIG
      const weight = connection.data.weight || CONFIG.rendering.connections.strokeWeight;

      // Get color from connection data or CONFIG
      const baseColor = connection.data.color || CONFIG.rendering.connections.stroke;

      // Apply stroke properties
      strokeWeight(weight);

      // Create color with alpha
      const c = color(baseColor);
      c.setAlpha(180);
      stroke(c);

      // Render based on connection type
      if (connection.type === 'straight') {
        line(posA.x, posA.y, posB.x, posB.y);
      } else if (connection.type === 'bezier' && connection.controlPoints.length >= 2) {
        const cp1 = connection.controlPoints[0];
        const cp2 = connection.controlPoints[1];
        bezier(posA.x, posA.y, cp1.x, cp1.y, cp2.x, cp2.y, posB.x, posB.y);
      } else if (connection.type === 'arc' && connection.controlPoints.length >= 1) {
        const cp = connection.controlPoints[0];
        beginShape();
        vertex(posA.x, posA.y);
        quadraticVertex(cp.x, cp.y, posB.x, posB.y);
        endShape();
      }
    }
  }
}

export default ConnectionRenderer;
