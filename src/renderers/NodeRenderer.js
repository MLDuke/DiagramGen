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
    for (const node of diagram.nodes) {
      const pos = node.position;

      // Get size from node data or CONFIG
      const size = node.data.size || CONFIG.rendering.nodes.size;

      // Get stroke properties from node data or CONFIG
      const strokeColor = node.data.stroke || CONFIG.rendering.nodes.stroke;
      const strokeWt = node.data.strokeWeight !== undefined
        ? node.data.strokeWeight
        : CONFIG.rendering.nodes.strokeWeight;

      // Get fill from node data or CONFIG
      const fillColor = node.data.fill || CONFIG.rendering.nodes.fill;

      // Apply stroke
      if (strokeWt > 0) {
        stroke(strokeColor);
        strokeWeight(strokeWt);
      } else {
        noStroke();
      }

      // Apply fill
      if (fillColor) {
        fill(fillColor);
      } else {
        noFill();
      }

      // Draw circle at node position
      ellipse(pos.x, pos.y, size, size);
    }
  }
}

export default NodeRenderer;
