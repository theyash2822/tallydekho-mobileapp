import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

/**
 * ShimmerPlaceholder - Beautiful shimmer loading effect
 * 
 * @param {number} width - Width of shimmer (default: 100)
 * @param {number} height - Height of shimmer (default: 20)
 * @param {number} borderRadius - Border radius (default: 4)
 * @param {object} style - Additional styles
 * @param {number} duration - Animation duration in ms (default: 1500)
 */
const ShimmerPlaceholder = ({
  width = 100,
  height = 20,
  borderRadius = 4,
  style,
  duration = 1500,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue, duration]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        styles.container,
        {width, height, borderRadius},
        style,
      ]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default ShimmerPlaceholder;

