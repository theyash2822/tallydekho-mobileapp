/**
 * Pairing Animation Utilities
 * Handles loading animation for pairing process
 */

import {Animated} from 'react-native';

/**
 * Setup blinking animation for loading dots
 * @param {boolean} isPairing - Whether pairing is in progress
 * @param {Animated.Value} dot1Opacity - Opacity value for dot 1
 * @param {Animated.Value} dot2Opacity - Opacity value for dot 2
 * @param {Animated.Value} dot3Opacity - Opacity value for dot 3
 */
export const setupBlinkAnimation = (isPairing, dot1Opacity, dot2Opacity, dot3Opacity) => {
  if (isPairing) {
    const blinkAnimation = () => {
      const animations = [
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ];
      Animated.stagger(200, animations).start(() => {
        if (isPairing) {
          blinkAnimation(); // Continue blinking while pairing
        }
      });
    };
    blinkAnimation();
  } else {
    dot1Opacity.setValue(1);
    dot2Opacity.setValue(1);
    dot3Opacity.setValue(1);
  }
};

