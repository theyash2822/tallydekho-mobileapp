import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CustomSwitch = ({value, onValueChange}) => {
  const [isOn, setIsOn] = useState(value || false);
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setIsOn(value || false);
  }, [value]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const switchBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#16C47F'],
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleToggle}>
      <Animated.View
        style={[
          styles.switchContainer,
          {backgroundColor: switchBackgroundColor},
        ]}>
        <Animated.View
          style={[styles.switchThumb, {transform: [{translateX}]}]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 26,
    borderRadius: 20,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
});

export default CustomSwitch;
