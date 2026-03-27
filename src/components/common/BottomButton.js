import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const CustomBottomButton = ({
  // Primary button
  onPress,
  buttonText = 'Next',
  buttonColor = '#07624C',
  textColor = '#FFFFFF',
  buttonStyle = {},
  textStyle = {},
  disabled = false,
  icon = null,

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
    <View
      style={[
        styles.bottomcontainer,
        Platform.OS === 'ios' && {paddingBottom: 18},
        containerStyle,
      ]}
    >
      {/* Primary Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: disabled ? '#D1D5DB' : buttonColor},
          buttonStyle,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {icon && (
          <Icon
            name={icon}
            size={18}
            color={disabled ? '#9CA3AF' : textColor}
            style={styles.buttonIcon}
          />
        )}
        <Text
          style={[
            styles.text,
            {color: disabled ? '#9CA3AF' : textColor},
            textStyle,
          ]}
        >
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
          onPress={onSecondPress}
        >
          <Text
            style={[styles.text, {color: secondTextColor}, secondTextStyle]}
          >
            {secondButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomcontainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default CustomBottomButton;
