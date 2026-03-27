import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const CustomBottomButtonTwo = ({
  // Primary button
  onPress,
  buttonText = 'Next',
  buttonColor = '#07624C',
  textColor = '#FFFFFF',
  buttonStyle = {},
  textStyle = {},

  // Secondary button
  showSecondButton = false,
  onSecondPress,
  secondButtonText = 'Back',
  secondButtonColor = '#EEEEEE',
  secondTextColor = '#000000',
  secondButtonStyle = {},
  secondTextStyle = {},

  // Container
  containerStyle = {},
}) => {
  return (
    <View style={[styles.bottomcontainer, containerStyle]}>
      {/* Primary Button */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: buttonColor}, buttonStyle]}
        onPress={onPress}>
        <Text style={[styles.text, {color: textColor}, textStyle]}>
          {buttonText}
        </Text>
      </TouchableOpacity>

      {/* Secondary Button */}
      {showSecondButton && (
        <TouchableOpacity
          style={[
            styles.button,
            {backgroundColor: secondButtonColor},
            secondButtonStyle,
          ]}
          onPress={onSecondPress}>
          <Text
            style={[styles.text, {color: secondTextColor}, secondTextStyle]}>
            {secondButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomcontainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    paddingBottom:10
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
  },
});

export default CustomBottomButtonTwo;
