/**
 * Renderer base class - Abstract class for rendering diagram elements
 */
class Renderer {
  /**
   * Render diagram elements
   * Must be overridden by subclasses
   * @param {Diagram} diagram - The diagram to render
   */
  render(diagram) {
    throw new Error('render() must be implemented by subclass');
  }
}

export default Renderer;
