/**
 * Global configuration object for the Diagram Generator
 */
const CONFIG = {
  // Canvas settings
  canvas: {
    width: 1200,
    height: 800,
    backgroundColor: '#0a0a0a'
  },

  // Rendering defaults
  rendering: {
    nodes: {
      size: 8,
      fill: '#ffffff',
      stroke: null,
      strokeWeight: 0
    },
    connections: {
      stroke: '#ffffff',
      strokeWeight: 1.5,
      fill: null
    }
  }
};

export default CONFIG;
