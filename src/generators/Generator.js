/**
 * Generator base class - Abstract class for creating diagram structures
 * Generators create nodes and connections based on configurable parameters
 */
class Generator {
  /**
   * @param {string} name - Name of the generator
   */
  constructor(name) {
    this.name = name;
    this.params = this.getDefaultParams();
  }

  /**
   * Get default parameters for this generator
   * Should be overridden by subclasses
   * @returns {Object} Default parameter object
   */
  getDefaultParams() {
    return {};
  }

  /**
   * Generate diagram structure
   * Must be overridden by subclasses
   * @param {Diagram} diagram - The diagram to populate
   * @param {Object} params - Parameters to configure generation
   */
  generate(diagram, params) {
    throw new Error('generate() must be implemented by subclass');
  }
}

export default Generator;
