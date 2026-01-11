/**
 * Node class - Represents a point in the diagram with position, connections, and data
 */
class Node {
  /**
   * @param {p5.Vector} position - Position vector for the node
   * @param {string} id - Unique identifier for the node
   */
  constructor(position, id) {
    this.id = id;
    this.position = position;
    this.originalPosition = position.copy();
    this.connections = [];
    this.data = {};
  }

  /**
   * Connect this node to another node
   * @param {Node} otherNode - The node to connect to
   */
  connect(otherNode) {
    if (!this.connections.includes(otherNode)) {
      this.connections.push(otherNode);
    }
  }
}

export default Node;
