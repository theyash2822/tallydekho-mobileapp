import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import Colors from '../../utils/Colors';

const CustomSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 500,
  step = 100,
  showLabels = true,
  showCurrentValue = true,
  trackColor = '#E5E7EB',
  progressColor = '#10B981',
  thumbColor = '#10B981',
  labelColor = '#6B7280',
  currentValueColor = '#10B981',
  trackHeight = 4,
  thumbSize = 16,
  labelSize = 12,
  currentValueSize = 14,
  containerStyle,
  trackStyle,
  progressStyle,
  thumbStyle,
  labelStyle,
  currentValueStyle,
  disabled = false,
  showStepIndicators = false,
  hapticFeedback = true,
  formatValue = val => `₹${val}`,
  animationDuration = 200,
}) => {
  // Normalize value to position (0-1)
  const normalizeValue = useCallback(
    val => {
      const clampedValue = Math.max(min, Math.min(max, val));
      return (clampedValue - min) / (max - min);
    },
    [min, max],
  );

  // Convert position to value
  const positionToValue = useCallback(
    position => {
      const rawValue = min + position * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max],
  );

  const [sliderPosition, setSliderPosition] = useState(normalizeValue(value));
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const animatedValue = useRef(
    new Animated.Value(normalizeValue(value)),
  ).current;
  const currentPositionRef = useRef(normalizeValue(value));

  // Update position when value prop changes (only from external changes, not during dragging)
  useEffect(() => {
    if (!isDragging) {
      const newPosition = normalizeValue(value);
      if (Math.abs(newPosition - sliderPosition) > 0.001) {
        setSliderPosition(newPosition);
        currentPositionRef.current = newPosition;
        animatedValue.setValue(newPosition);
      }
    }
  }, [value, normalizeValue, isDragging, sliderPosition]);

  // Calculate snap points and values
  const {snapPoints, values} = React.useMemo(() => {
    const points = [];
    const vals = [];
    const stepCount = Math.floor((max - min) / step);

    for (let i = 0; i <= stepCount; i++) {
      const val = min + i * step;
      if (val <= max) {
        points.push(normalizeValue(val));
        vals.push(val);
      }
    }

    // Ensure max value is included
    if (vals[vals.length - 1] !== max) {
      points.push(1);
      vals.push(max);
    }

    return {snapPoints: points, values: vals};
  }, [min, max, step, normalizeValue]);

  // Find closest snap point
  const findClosestSnapPoint = useCallback(
    position => {
      let closestIndex = 0;
      let minDistance = Math.abs(position - snapPoints[0]);

      for (let i = 1; i < snapPoints.length; i++) {
        const distance = Math.abs(position - snapPoints[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      return {
        index: closestIndex,
        position: snapPoints[closestIndex],
        value: values[closestIndex],
      };
    },
    [snapPoints, values],
  );

  // Haptic feedback (mock implementation - you'd use a haptic library)
  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback) {
      // Implementation would depend on your haptic library
      // e.g., Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [hapticFeedback]);

  // PanResponder for slider
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt, gestureState) => {
        setIsDragging(true);
        triggerHapticFeedback();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sliderRef.current && !disabled) {
          sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            const touchX = evt.nativeEvent.pageX;
            const relativeX = touchX - pageX;
            const newPosition = Math.max(0, Math.min(1, relativeX / width));

            setSliderPosition(newPosition);
            currentPositionRef.current = newPosition;
            animatedValue.setValue(newPosition);

            // Calculate value based on position (rounded to nearest integer)
            const rawValue = positionToValue(newPosition);
            const newValue = Math.round(rawValue);

            // Only call onValueChange if the value actually changed
            if (newValue !== value) {
              onValueChange(newValue);
            }
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!disabled) {
          // Ensure final value is properly set
          const currentPos = currentPositionRef.current;
          const rawValue = positionToValue(currentPos);
          const finalValue = Math.round(rawValue);

          if (finalValue !== value) {
            onValueChange(finalValue);
          }
        }
        setIsDragging(false);
      },
    }),
  ).current;

  const renderStepIndicators = () => {
    if (!showStepIndicators) return null;

    return (
      <View style={styles.stepIndicators}>
        {snapPoints.map((position, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {
                left: `${position * 100}%`,
                backgroundColor:
                  position <= currentPosition ? progressColor : trackColor,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderLabels = () => {
    if (!showLabels) return null;

    return (
      <View style={styles.sliderLabels}>
        {values.map((val, index) => {
          const position = snapPoints[index];

          return (
            <Text
              key={val}
              style={[
                styles.sliderLabel,
                labelStyle,
                {
                  position: 'absolute',
                  left: `${position * 100}%`,
                  transform: [{translateX: -15}],
                  fontSize: labelSize,
                  color: labelColor,
                },
              ]}>
              {Math.round(val)}
            </Text>
          );
        })}
      </View>
    );
  };

  const renderCurrentValue = () => {
    if (!showCurrentValue) return null;

    return (
      <Text
        style={[
          styles.currentValue,
          currentValueStyle,
          {
            fontSize: currentValueSize,
            color: currentValueColor,
          },
        ]}>
        Current: ₹{Math.round(value)}
      </Text>
    );
  };

  const currentPosition = isDragging ? sliderPosition : normalizeValue(value);

  return (
    <View
      style={[
        styles.sliderContainer,
        containerStyle,
        disabled && styles.disabled,
      ]}>
      <View
        ref={sliderRef}
        style={[
          styles.sliderTrack,
          trackStyle,
          {
            height: trackHeight,
            backgroundColor: trackColor,
          },
        ]}
        {...panResponder.panHandlers}>
        {/* Progress fill */}
        <Animated.View
          style={[
            styles.sliderProgress,
            progressStyle,
            {
              width: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: disabled ? '#CBD5E0' : progressColor,
            },
          ]}
        />

        {/* Step indicators */}
        {renderStepIndicators()}

        {/* Thumb */}
        <Animated.View
          style={[
            styles.sliderThumb,
            thumbStyle,
            {
              left: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              width: thumbSize,
              height: thumbSize,
              backgroundColor: disabled ? '#CBD5E0' : thumbColor,
              top: -(thumbSize / 2 - trackHeight / 2),
              transform: [
                {translateX: -thumbSize / 2},
                {scale: isDragging ? 1.2 : 1},
              ],
            },
          ]}
        />
      </View>

      {renderLabels()}
      {renderCurrentValue()}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  sliderTrack: {
    borderRadius: 2,
    marginBottom: 12,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  stepIndicator: {
    position: 'absolute',
    width: 2,
    height: '100%',
    transform: [{translateX: -1}],
  },
  sliderLabels: {
    position: 'relative',
    height: 20,
    marginBottom: 8,
  },
  sliderLabel: {
    textAlign: 'center',
    width: 30,
  },
  currentValue: {
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CustomSlider;
