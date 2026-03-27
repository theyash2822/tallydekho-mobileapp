export const setGlobalFont = ({
  regular = 'SF-Pro-Display-Regular',
  medium = 'SF-Pro-Display-Medium',
  bold = 'SF-Pro-Display-Bold',
} = {}) => {
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  Text.defaultProps.style = {fontFamily: regular};

  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
  TextInput.defaultProps.style = {fontFamily: regular};
};
