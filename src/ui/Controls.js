/**
 * Controls class - Manages UI controls for diagram parameters
 */
class Controls {
  constructor() {
    this.container = null;
    this.generatorSelect = null;
    this.sliderContainer = null;
    this.styleContainer = null;
    this.sliders = {};
    this.styleControls = {};
    this.currentGenerator = null;
    this.currentParams = {}; // Track current parameter values
    this.onGeneratorChange = null;
    this.onParameterChange = null;
    this.onStyleChange = null;
  }

  /**
   * Initialize the control panel
   * @param {Function} onGeneratorChange - Callback when generator changes
   * @param {Function} onParameterChange - Callback when parameter changes
   * @param {Function} onStyleChange - Callback when style changes
   */
  init(onGeneratorChange, onParameterChange, onStyleChange) {
    this.onGeneratorChange = onGeneratorChange;
    this.onParameterChange = onParameterChange;
    this.onStyleChange = onStyleChange;

    // Create main container
    this.container = this._createElement('div', 'controls-container');
    document.body.appendChild(this.container);

    // Create generator selector section
    this._createGeneratorSelector();

    // Create sliders container
    this.sliderContainer = this._createElement('div', 'sliders-container');
    this.container.appendChild(this.sliderContainer);

    // Create style controls section
    this._createStyleSection();
  }

  /**
   * Create generator selector dropdown
   * @private
   */
  _createGeneratorSelector() {
    const selectorWrapper = this._createElement('div', 'selector-wrapper');

    const label = this._createElement('label', 'control-label');
    label.textContent = 'Generator';
    label.htmlFor = 'generator-select';

    this.generatorSelect = this._createElement('select', 'generator-select');
    this.generatorSelect.id = 'generator-select';

    // Add generator options
    const generators = [
      { value: 'radial', label: 'Radial' },
      { value: 'path', label: 'Path' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'noisegrid', label: 'Noise Grid' }
    ];

    generators.forEach(gen => {
      const option = document.createElement('option');
      option.value = gen.value;
      option.textContent = gen.label;
      this.generatorSelect.appendChild(option);
    });

    // Handle generator change
    this.generatorSelect.addEventListener('change', (e) => {
      if (this.onGeneratorChange) {
        this.onGeneratorChange(e.target.value);
      }
    });

    selectorWrapper.appendChild(label);
    selectorWrapper.appendChild(this.generatorSelect);
    this.container.appendChild(selectorWrapper);
  }

  /**
   * Update sliders for current generator parameters
   * @param {Generator} generator - The current generator
   */
  updateSliders(generator) {
    this.currentGenerator = generator;

    // Clear existing sliders
    this.sliderContainer.innerHTML = '';
    this.sliders = {};

    // Reset current params to generator defaults
    this.currentParams = generator.getDefaultParams();

    const sliderConfigs = this._getSliderConfigs(generator.name);

    // Create sliders based on configuration
    sliderConfigs.forEach(config => {
      if (this.currentParams.hasOwnProperty(config.param)) {
        this._createSlider(config);
      }
    });
  }

  /**
   * Get slider configurations for a specific generator
   * @param {string} generatorName - Name of the generator
   * @returns {Array} Slider configurations
   * @private
   */
  _getSliderConfigs(generatorName) {
    const configs = {
      RadialGenerator: [
        { param: 'nodeCount', label: 'Node Count', min: 3, max: 36, step: 1 },
        { param: 'outerRadius', label: 'Outer Radius', min: 50, max: 400, step: 10 },
        { param: 'innerRadius', label: 'Inner Radius', min: 0, max: 200, step: 10 },
        { param: 'rotation', label: 'Rotation', min: 0, max: 6.28, step: 0.1 },
        { param: 'jitter', label: 'Jitter', min: 0, max: 50, step: 1 }
      ],
      PathGenerator: [
        { param: 'pathCount', label: 'Path Count', min: 1, max: 12, step: 1 },
        { param: 'nodesPerPath', label: 'Nodes per Path', min: 3, max: 20, step: 1 },
        { param: 'waveAmplitude', label: 'Wave Amplitude', min: 20, max: 200, step: 5 },
        { param: 'waveFrequency', label: 'Wave Frequency', min: 0.005, max: 0.05, step: 0.005 },
        { param: 'horizontalSpacing', label: 'Spacing', min: 50, max: 300, step: 10 }
      ],
      HybridGenerator: [
        { param: 'hubNodeCount', label: 'Hub Nodes', min: 3, max: 16, step: 1 },
        { param: 'hubRadius', label: 'Hub Radius', min: 50, max: 200, step: 10 },
        { param: 'hubRotation', label: 'Hub Rotation', min: 0, max: 6.28, step: 0.1 },
        { param: 'pathsPerNode', label: 'Paths per Node', min: 0, max: 4, step: 1 },
        { param: 'nodesPerPath', label: 'Nodes per Path', min: 2, max: 12, step: 1 },
        { param: 'pathLength', label: 'Path Length', min: 100, max: 400, step: 10 },
        { param: 'pathCurve', label: 'Path Curve', min: 0, max: 150, step: 10 }
      ],
      NoiseGrid: [
        { param: 'gridSize', label: 'Grid Size', min: 4, max: 16, step: 1 },
        { param: 'spacing', label: 'Spacing', min: 40, max: 120, step: 5 },
        { param: 'noiseScale', label: 'Noise Scale', min: 0.05, max: 0.5, step: 0.01 },
        { param: 'noiseThreshold', label: 'Node Threshold', min: -0.5, max: 0.8, step: 0.05 },
        { param: 'displacementAmount', label: 'Displacement', min: 0, max: 60, step: 5 },
        { param: 'displacementScale', label: 'Displacement Scale', min: 0.05, max: 0.3, step: 0.01 },
        { param: 'connectionRadius', label: 'Connection Radius', min: 80, max: 250, step: 10 },
        { param: 'connectionProbability', label: 'Connection Probability', min: 0.1, max: 1.0, step: 0.05 },
        { param: 'noiseSeed', label: 'Noise Seed', min: 0, max: 100, step: 1 }
      ]
    };

    return configs[generatorName] || [];
  }

  /**
   * Create a slider control
   * @param {Object} config - Slider configuration
   * @private
   */
  _createSlider(config) {
    const sliderWrapper = this._createElement('div', 'slider-wrapper');

    // Label
    const label = this._createElement('label', 'control-label');
    label.textContent = config.label;
    label.htmlFor = `slider-${config.param}`;

    // Value display
    const valueDisplay = this._createElement('span', 'slider-value');
    const currentValue = this.currentParams[config.param];
    valueDisplay.textContent = this._formatValue(currentValue, config.param);

    // Slider
    const slider = this._createElement('input', 'slider');
    slider.id = `slider-${config.param}`;
    slider.type = 'range';
    slider.min = config.min;
    slider.max = config.max;
    slider.step = config.step;
    slider.value = currentValue;

    // Handle slider change
    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      valueDisplay.textContent = this._formatValue(value, config.param);

      // Update current params state
      this.currentParams[config.param] = value;

      if (this.onParameterChange) {
        // Pass all current params instead of just the changed one
        this.onParameterChange(this.currentParams);
      }
    });

    // Store slider reference
    this.sliders[config.param] = { slider, valueDisplay, config };

    // Assemble slider UI
    const labelRow = this._createElement('div', 'slider-label-row');
    labelRow.appendChild(label);
    labelRow.appendChild(valueDisplay);

    sliderWrapper.appendChild(labelRow);
    sliderWrapper.appendChild(slider);
    this.sliderContainer.appendChild(sliderWrapper);
  }

  /**
   * Format value for display
   * @param {number} value - The value to format
   * @param {string} param - Parameter name
   * @returns {string} Formatted value
   * @private
   */
  _formatValue(value, param) {
    if (param === 'rotation' || param === 'hubRotation') {
      return `${(value * 180 / Math.PI).toFixed(0)}°`;
    } else if (param.includes('Frequency')) {
      return value.toFixed(3);
    } else if (Number.isInteger(value)) {
      return value.toString();
    } else {
      return value.toFixed(1);
    }
  }

  /**
   * Helper to create DOM elements
   * @param {string} tag - HTML tag name
   * @param {string} className - CSS class name
   * @returns {HTMLElement} Created element
   * @private
   */
  _createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    return element;
  }

  /**
   * Set the current generator in the dropdown
   * @param {string} generatorType - Generator type ('radial', 'path', 'hybrid')
   */
  setGenerator(generatorType) {
    this.generatorSelect.value = generatorType;
  }

  /**
   * Update slider value programmatically
   * @param {string} param - Parameter name
   * @param {number} value - New value
   */
  updateSliderValue(param, value) {
    if (this.sliders[param]) {
      const { slider, valueDisplay, config } = this.sliders[param];
      slider.value = value;
      valueDisplay.textContent = this._formatValue(value, param);
    }
  }

  /**
   * Show or hide the control panel
   * @param {boolean} visible - Whether to show the panel
   */
  setVisible(visible) {
    if (this.container) {
      this.container.style.display = visible ? 'flex' : 'none';
    }
  }

  /**
   * Create style controls section
   * @private
   */
  _createStyleSection() {
    // Create section header
    const sectionHeader = this._createElement('div', 'section-header');
    sectionHeader.textContent = 'Style Settings';
    this.container.appendChild(sectionHeader);

    // Create style container
    this.styleContainer = this._createElement('div', 'style-container');
    this.container.appendChild(this.styleContainer);

    // Node style controls
    this._createStyleControl('nodeSize', 'Node Size', 'slider', { min: 2, max: 20, step: 1 });
    this._createStyleControl('nodeColor', 'Node Color', 'color');
    this._createStyleControl('nodeStrokeWeight', 'Node Stroke', 'slider', { min: 0, max: 5, step: 0.5 });

    // Connection style controls
    this._createStyleControl('connectionWeight', 'Line Weight', 'slider', { min: 0.5, max: 5, step: 0.5 });
    this._createStyleControl('connectionColor', 'Line Color', 'color');
    this._createStyleControl('connectionAlpha', 'Line Opacity', 'slider', { min: 0, max: 255, step: 5 });

    // Connection curve controls
    this._createStyleControl('connectionType', 'Line Style', 'dropdown', {
      options: [
        { value: 'straight', label: 'Straight' },
        { value: 'curved', label: 'Curved' },
        { value: 'bezier', label: 'Bezier' }
      ]
    });
    this._createStyleControl('curveAmount', 'Curve Amount', 'slider', { min: 0, max: 200, step: 5 });

    // Background control
    this._createStyleControl('backgroundColor', 'Background', 'color');
  }

  /**
   * Create a style control (slider, color picker, or dropdown)
   * @param {string} styleKey - Key for the style property
   * @param {string} label - Display label
   * @param {string} type - Control type ('slider', 'color', or 'dropdown')
   * @param {Object} options - Options for the control
   * @private
   */
  _createStyleControl(styleKey, label, type, options = {}) {
    const controlWrapper = this._createElement('div', 'style-control-wrapper');

    const controlLabel = this._createElement('label', 'control-label');
    controlLabel.textContent = label;
    controlLabel.htmlFor = `style-${styleKey}`;

    if (type === 'dropdown') {
      // Create dropdown select
      const selectInput = this._createElement('select', 'style-select');
      selectInput.id = `style-${styleKey}`;

      // Add options
      options.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        selectInput.appendChild(option);
      });

      // Set initial value
      const initialValue = this._getInitialStyleValue(styleKey);
      selectInput.value = initialValue;

      selectInput.addEventListener('change', (e) => {
        if (this.onStyleChange) {
          this.onStyleChange(styleKey, e.target.value);
        }
      });

      controlWrapper.appendChild(controlLabel);
      controlWrapper.appendChild(selectInput);

      this.styleControls[styleKey] = { input: selectInput };
    } else if (type === 'slider') {
      // Create slider with value display
      const valueDisplay = this._createElement('span', 'slider-value');

      const labelRow = this._createElement('div', 'slider-label-row');
      labelRow.appendChild(controlLabel);
      labelRow.appendChild(valueDisplay);

      const slider = this._createElement('input', 'slider');
      slider.id = `style-${styleKey}`;
      slider.type = 'range';
      slider.min = options.min;
      slider.max = options.max;
      slider.step = options.step;

      // Set initial value based on styleKey
      const initialValue = this._getInitialStyleValue(styleKey);
      slider.value = initialValue;
      valueDisplay.textContent = this._formatStyleValue(initialValue, styleKey);

      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        valueDisplay.textContent = this._formatStyleValue(value, styleKey);
        if (this.onStyleChange) {
          this.onStyleChange(styleKey, value);
        }
      });

      controlWrapper.appendChild(labelRow);
      controlWrapper.appendChild(slider);

      this.styleControls[styleKey] = { input: slider, valueDisplay };
    } else if (type === 'color') {
      // Create color picker
      const colorInput = this._createElement('input', 'color-picker');
      colorInput.id = `style-${styleKey}`;
      colorInput.type = 'color';

      // Set initial value
      const initialValue = this._getInitialStyleValue(styleKey);
      colorInput.value = initialValue;

      colorInput.addEventListener('input', (e) => {
        if (this.onStyleChange) {
          this.onStyleChange(styleKey, e.target.value);
        }
      });

      controlWrapper.appendChild(controlLabel);
      controlWrapper.appendChild(colorInput);

      this.styleControls[styleKey] = { input: colorInput };
    }

    this.styleContainer.appendChild(controlWrapper);
  }

  /**
   * Get initial style value from CONFIG
   * @param {string} styleKey - Style key
   * @returns {*} Initial value
   * @private
   */
  _getInitialStyleValue(styleKey) {
    // Import CONFIG dynamically
    // Note: This assumes CONFIG is accessible globally or passed in
    const styleMap = {
      nodeSize: 8,
      nodeColor: '#ffffff',
      nodeStrokeWeight: 2,
      connectionWeight: 1.5,
      connectionColor: '#ffffff',
      connectionAlpha: 180,
      connectionType: 'straight',
      curveAmount: 50,
      backgroundColor: '#0a0a0a'
    };

    return styleMap[styleKey];
  }

  /**
   * Format style value for display
   * @param {*} value - Value to format
   * @param {string} styleKey - Style key
   * @returns {string} Formatted value
   * @private
   */
  _formatStyleValue(value, styleKey) {
    if (styleKey.includes('Alpha') || styleKey.includes('Opacity')) {
      return Math.round(value).toString();
    } else if (Number.isInteger(value)) {
      return value.toString();
    } else {
      return value.toFixed(1);
    }
  }
}

export default Controls;
