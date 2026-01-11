/**
 * CurveUtils - Utility functions for generating curve control points
 */
class CurveUtils {
  /**
   * Calculate control point for arc curve (quadratic bezier)
   * @param {p5.Vector} posA - Start position
   * @param {p5.Vector} posB - End position
   * @param {number} curveAmount - Intensity of curve (0-100)
   * @returns {p5.Vector} Control point
   */
  static getArcControlPoint(posA, posB, curveAmount) {
    // Calculate midpoint
    const midX = (posA.x + posB.x) / 2;
    const midY = (posA.y + posB.y) / 2;

    // Calculate perpendicular direction
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;

    // Perpendicular vector (rotated 90 degrees)
    const perpX = -dy;
    const perpY = dx;

    // Normalize and scale by curve amount
    const length = Math.sqrt(perpX * perpX + perpY * perpY);
    const normalizedPerpX = perpX / length;
    const normalizedPerpY = perpY / length;

    // Apply curve amount (scale factor)
    const offset = curveAmount * 0.5; // Scale curve amount to reasonable range

    // Create control point offset from midpoint
    const controlX = midX + normalizedPerpX * offset;
    const controlY = midY + normalizedPerpY * offset;

    return createVector(controlX, controlY);
  }

  /**
   * Calculate two control points for bezier curve
   * @param {p5.Vector} posA - Start position
   * @param {p5.Vector} posB - End position
   * @param {number} curveAmount - Intensity of curve (0-100)
   * @returns {Array<p5.Vector>} Two control points [cp1, cp2]
   */
  static getBezierControlPoints(posA, posB, curveAmount) {
    // Calculate direction vector
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular vector
    const perpX = -dy / distance;
    const perpY = dx / distance;

    // Scale by curve amount
    const offset = curveAmount * 0.5;

    // Place control points at 1/3 and 2/3 along the line
    // with perpendicular offsets
    const cp1X = posA.x + dx * 0.33 + perpX * offset;
    const cp1Y = posA.y + dy * 0.33 + perpY * offset;

    const cp2X = posA.x + dx * 0.67 - perpX * offset;
    const cp2Y = posA.y + dy * 0.67 - perpY * offset;

    return [
      createVector(cp1X, cp1Y),
      createVector(cp2X, cp2Y)
    ];
  }

  /**
   * Apply curve to a connection based on CONFIG settings
   * @param {Connection} connection - The connection to apply curve to
   * @param {Object} config - CONFIG.rendering.connections
   */
  static applyCurveToConnection(connection, config) {
    const type = config.type || 'straight';

    // Clear existing control points
    connection.controlPoints = [];

    if (type === 'straight') {
      connection.type = 'straight';
    } else if (type === 'curved') {
      // Use arc (quadratic bezier) for curved
      connection.type = 'arc';
      const curveAmount = config.curveAmount || 50;
      const controlPoint = CurveUtils.getArcControlPoint(
        connection.nodeA.position,
        connection.nodeB.position,
        curveAmount
      );
      connection.controlPoints = [controlPoint];
    } else if (type === 'bezier') {
      // Use bezier curve
      connection.type = 'bezier';
      const curveAmount = config.curveAmount || 50;
      const controlPoints = CurveUtils.getBezierControlPoints(
        connection.nodeA.position,
        connection.nodeB.position,
        curveAmount
      );
      connection.controlPoints = controlPoints;
    }
  }
}

export default CurveUtils;
