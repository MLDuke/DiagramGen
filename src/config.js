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
      stroke: '#ffffff',
      strokeWeight: 2
    },
    connections: {
      stroke: '#ffffff',
      strokeWeight: 1.5,
      alpha: 180,
      fill: null,
      type: 'straight',
      curveAmount: 50
    }
  }
};

export default CONFIG;
