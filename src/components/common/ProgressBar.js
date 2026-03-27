import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, View, StyleSheet} from 'react-native';

const AnimatedProgressBar = () => {
  const {width} = Dimensions.get('window');
  const progressAnim = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 20000,
      useNativeDriver: true,
    }).start(() => {
      startAnimation();
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const animatedStyle = {
    transform: [
      {translateX: width / 2},
      {scaleX: progressAnim},
      {translateX: -width / 2},
    ],
  };

  return (
    <View style={styles.progressContainer}>
      <View style={styles.clipContainer}>
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  clipContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#009688',
  },
});

export default AnimatedProgressBar;


// <AnimatedProgressBar>
