import keyMirror from 'keymirror';

import {AGGREGATION_TYPES} from 'constants/default-settings';
import {DefaultColorRange} from 'constants/color-ranges';

export const PROPERTY_GROUPS = keyMirror({
  color: null,
  stroke: null,
  radius: null,
  height: null,

  // for heatmap aggregation
  cell: null,
  precision: null
});

export const LAYER_VIS_CONFIGS = {
  thickness: {
    type: 'number',
    defaultValue: 2,
    label: 'Stroke Width',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'thickness'
  },
  strokeWidthRange: {
    type: 'number',
    defaultValue: [0, 10],
    label: 'Stroke Width Range',
    isRanged: true,
    range: [0, 200],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'sizeRange'
  },
  // radius is actually radiusScale in deck.gl
  radius: {
    type: 'number',
    defaultValue: 10,
    label: 'Radius',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'radius'
  },
  fixedRadius: {
    defaultValue: false,
    type: 'boolean',
    label: 'Fixed Radius to meter',
    description: 'Map radius to absolute radius in meters, e.g. 5 to 5 meters',
    group: PROPERTY_GROUPS.radius,
    property: 'fixedRadius'
  },
  radiusRange: {
    type: 'number',
    defaultValue: [0, 50],
    isRanged: true,
    range: [0, 500],
    step: 0.1,
    label: 'Radius Range',
    group: PROPERTY_GROUPS.radius,
    property: 'radiusRange'
  },
  clusterRadius: {
    type: 'number',
    label: 'Cluster Size (m)',
    defaultValue: 40,
    isRanged: false,
    range: [1, 500],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'clusterRadius'
  },
  clusterRadiusRange: {
    type: 'number',
    label: 'Radius Range (m)',
    defaultValue: [1, 40],
    isRanged: true,
    range: [1, 150],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'radiusRange'
  },
  opacity: {
    type: 'number',
    defaultValue: 0.8,
    label: 'Opacity',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.color,
    property: 'opacity'
  },
  coverage: {
    type: 'number',
    defaultValue: 1,
    label: 'Coverage',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'coverage'
  },
  outline: {
    type: 'boolean',
    defaultValue: false,
    label: 'Draw outline',
    group: PROPERTY_GROUPS.display,
    property: 'outline'
  },
  colorRange: {
    type: 'color-range-select',
    defaultValue: DefaultColorRange,
    label: 'Color range',
    group: PROPERTY_GROUPS.color,
    property: 'colorRange'
  },
  targetColor: {
    type: 'color-select',
    label: 'Target Color',
    defaultValue: null,
    group: PROPERTY_GROUPS.color,
    property: 'targetColor'
  },
  aggregation: {
    type: 'select',
    defaultValue: AGGREGATION_TYPES.average,
    label: 'Color Aggregation',
    options: Object.keys(AGGREGATION_TYPES),
    group: PROPERTY_GROUPS.color,
    property: 'colorAggregation'
  },
  percentile: {
    type: 'number',
    defaultValue: [0, 100],
    label: config =>
      `Filter by ${
        config.colorField
          ? `${config.visConfig.colorAggregation} ${config.colorField.name}`
          : 'count'
      } percentile`,
    isRanged: true,
    range: [0, 100],
    step: 0.01,
    group: PROPERTY_GROUPS.color,
    property: 'percentile'
  },
  elevationPercentile: {
    type: 'number',
    defaultValue: [0, 100],
    label: config =>
      `Filter by ${
        config.sizeField
          ? `${config.visConfig.sizeAggregation} ${config.sizeField.name}`
          : 'count'
      } percentile`,
    isRanged: true,
    range: [0, 100],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'elevationPercentile'
  },
  resolution: {
    type: 'number',
    defaultValue: 8,
    label: 'Resolution range',
    isRanged: false,
    range: [0, 13],
    step: 1,
    group: PROPERTY_GROUPS.cell,
    property: 'resolution'
  },
  worldUnitSize: {
    type: 'number',
    defaultValue: 1,
    label: 'World Unit Size',
    isRanged: false,
    range: [0.01, 500],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'worldUnitSize'
  },
  elevationScale: {
    type: 'number',
    defaultValue: 5,
    label: 'Elevation Scale',
    isRanged: false,
    range: [0, 100],
    step: 1,
    group: PROPERTY_GROUPS.height,
    property: 'elevationScale'
  },
  elevationRange: {
    type: 'number',
    defaultValue: [0, 500],
    label: 'Height Scale',
    isRanged: true,
    range: [0, 1000],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'sizeRange'
  },
  'hi-precision': {
    type: 'boolean',
    defaultValue: false,
    label: 'High Precision Rendering',
    group: PROPERTY_GROUPS.precision,
    property: 'hi-precision',
    description: 'High precision will result in slower performance'
  },
  enable3d: {
    type: 'boolean',
    defaultValue: false,
    label: 'Enable Height',
    group: PROPERTY_GROUPS.height,
    property: 'enable3d',
    description: 'Click button at top right of the map to switch to 3d view'
  },
  stroked: {
    type: 'boolean',
    label: 'Polygon Stroke',
    defaultValue: true,
    group: PROPERTY_GROUPS.display,
    property: 'stroked'
  },
  filled: {
    type: 'boolean',
    label: 'Polygon Fill',
    defaultValue: false,
    group: PROPERTY_GROUPS.display,
    property: 'filled'
  },
  extruded: {
    type: 'boolean',
    defaultValue: false,
    label: 'Enable Polygon Height',
    group: PROPERTY_GROUPS.display,
    property: 'extruded'
  },
  wireframe: {
    type: 'boolean',
    defaultValue: false,
    label: 'Show Wireframe',
    group: PROPERTY_GROUPS.display,
    property: 'wireframe'
  },
  // used for heatmap
  weight: {
    type: 'number',
    defaultValue: 1,
    label: 'Weight',
    isRanged: false,
    range: [0.01, 500],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'weight'
  }
};
