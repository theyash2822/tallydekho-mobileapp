const Colors = {
  // primary: '#3498db',
  // secondary: '#2ecc71',
  // accent: '#e67e22',

  // text: '#333333',
  // textLight: '#777777',

  // error: '#e74c3c',
  // success: '#2ecc71',
  // warning: '#f1c40f',
  // info: '#3498db',
  // transparent: 'transparent',

  // Common
  IconColor: '#898E9A',
  white: '#FFF',
  black: '#000',

  // Borders
  border: '#F0EFF4',

  //Text
  primaryText: '#1F1F1F', // Black
  secondaryText: '#8F939E', // Light

  primaryTitle: '#494D58',

  //BackgroundColor
  backgroundColorPrimary: '#F6F8FA',

  // Primary color for focus states
  primary: '#07624c',

  // Placeholder text color
  placeholder: '#8F939E',
};

/**
 * Cross-platform shadow utility
 * @param {number} elevation - Android elevation (0-24)
 * @param {object} options - iOS shadow options
 * @param {string} options.shadowColor - Shadow color (default: '#000')
 * @param {number} options.shadowOpacity - Shadow opacity 0-1 (default: 0.1)
 * @param {number} options.shadowRadius - Shadow blur radius (default: elevation * 0.5)
 * @param {object} options.shadowOffset - Shadow offset {width, height} (default: {width: 0, height: elevation * 0.5})
 * @returns {object} Style object with elevation and shadow properties
 */
export const getShadowStyle = (
  elevation = 4,
  options = {},
) => {
  const {
    shadowColor = '#000',
    shadowOpacity = 0.1,
    shadowRadius = elevation * 0.5,
    shadowOffset = {width: 0, height: elevation * 0.5},
  } = options;

  return {
    elevation,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  };
};

export default Colors;
