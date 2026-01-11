/**
 * Connection class - Links two nodes with optional curve styling
 */
class Connection {
  /**
   * @param {Node} nodeA - First node
   * @param {Node} nodeB - Second node
   * @param {string} type - Connection type: 'straight', 'bezier', or 'arc'
   */
  constructor(nodeA, nodeB, type = 'straight') {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.type = type;
    this.controlPoints = [];
    this.data = {};
  }
}

export default Connection;
