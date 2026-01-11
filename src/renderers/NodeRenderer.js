import Renderer from './Renderer.js';
import CONFIG from '../config.js';

/**
 * NodeRenderer - Renders nodes as circles with outlines
 */
class NodeRenderer extends Renderer {
  /**
   * Render all nodes in the diagram
   * @param {Diagram} diagram - The diagram containing nodes to render
   */
  render(diagram) {
    // Use clean outlines
    strokeWeight(2);
    noFill();

    for (const node of diagram.nodes) {
      const pos = node.position;

      // Get size from node data or CONFIG
      const size = node.data.size || CONFIG.rendering.nodes.size;

      // Get color from node data or CONFIG
      const color = node.data.color || CONFIG.rendering.nodes.fill;

      // Apply stroke color
      stroke(color);

      // Draw circle at node position
      ellipse(pos.x, pos.y, size, size);
    }
  }
}

export default NodeRenderer;
