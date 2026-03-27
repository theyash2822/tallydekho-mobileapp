import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';
import Svg, {Line, Circle, Text as SvgText, Path, Rect} from 'react-native-svg';
import * as d3 from 'd3-shape';
import {Icons} from '../../../utils/Icons';
import {formatCompactNumber} from '../../../utils/formatUtils';

const {width} = Dimensions.get('window');

const AIInsightsCard = ({onPress}) => {
  const [selectedIndex, setSelectedIndex] = useState(3); // Default to Week 4
  const [isInteracting, setIsInteracting] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true); // Visible on first entry
  const hasInteractedRef = useRef(false); // Track if user has interacted before
  const lastIndexRef = useRef(3); // Track last index for smooth transitions
  const DEFAULT_INDEX = 3; // Week 4
  // const lastIndexRef = useRef(DEFAULT_INDEX);

  // Enhanced mock data for sales forecast vs actual
  const weeks = ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7', 'Wk8'];

  // Sales forecast data - starts around ₹100, peaks around ₹1k
  const forecastData = [100, 200, 150, 300, 400, 600, 1100, 900];

  // Actual sales data - starts around ₹1k, peaks around ₹10k
  const actualData = [1000, 1200, 1100, 1500, 2000, 3000, 9500, 8000];

  const graphWidth = width - 80; // Reduced margin
  const graphHeight = 140;
  const leftPadding = 35; // Reduced left padding
  const rightPadding = 20;
  const bottomPadding = 25; // Reduced bottom padding
  const topPadding = 20;

  // Enhanced Y-axis scale with better distribution and cleaner values
  const yAxisData = useMemo(() => {
    const allData = [...forecastData, ...actualData];
    const maxValue = Math.max(...allData);
    const minValue = 0; // Start from 0 for better visualization

    // Create nice round numbers for y-axis with better spacing
    const niceMax = Math.ceil(maxValue / 1000) * 1000; // Round to nearest 1000
    const steps = 4; // Reduced steps to prevent overlap

    return {
      min: minValue,
      max: niceMax,
      labels: Array.from({length: steps}, (_, i) => {
        const value = minValue + (i / (steps - 1)) * niceMax;
        return Math.round(value);
      }),
    };
  }, [forecastData, actualData]);

  // Enhanced scaling functions
  const yScale = useCallback(
    value => {
      const range = yAxisData.max - yAxisData.min || 1;
      return (
        graphHeight -
        ((value - yAxisData.min) / range) * graphHeight +
        topPadding
      );
    },
    [yAxisData],
  );

  const xScale = useCallback(
    index => (index / (weeks.length - 1)) * graphWidth + leftPadding,
    [weeks.length],
  );

  const formatYAxisLabel = amount => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${Math.round(amount / 1000)}K`;
    } else {
      return `${amount}`;
    }
  };

  // Enhanced smooth paths using d3-shape
  const createForecastPath = useMemo(() => {
    if (forecastData.length < 2) return '';

    return d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))(forecastData);
  }, [forecastData, xScale, yScale]);

  const createActualPath = useMemo(() => {
    if (actualData.length < 2) return '';

    return d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))(actualData);
  }, [actualData, xScale, yScale]);

  // Enhanced pan responder with smooth sequential navigation
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: evt => {
        // Check if touch is within graph bounds - capture immediately on iOS
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;
        const isInBounds =
          touchX >= leftPadding &&
          touchX <= graphWidth + leftPadding &&
          touchY >= topPadding &&
          touchY <= graphHeight + topPadding;
        return isInBounds;
      },
      onStartShouldSetPanResponderCapture: evt => {
        // Capture the gesture immediately to prevent ScrollView from taking over
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;
        const isInBounds =
          touchX >= leftPadding &&
          touchX <= graphWidth + leftPadding &&
          touchY >= topPadding &&
          touchY <= graphHeight + topPadding;
        return isInBounds;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only capture if movement is primarily horizontal (prevents vertical scrolling on iOS)
        const {dx, dy} = gestureState;
        // Be more lenient - if horizontal movement exists, capture it
        return Math.abs(dx) > 3 || (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2);
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Capture horizontal movements to prevent ScrollView interference
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 3 || (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2);
      },
      onPanResponderTerminationRequest: () => {
        // Don't allow ScrollView to terminate our gesture when interacting
        return false;
      },
      onPanResponderGrant: evt => {
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;

        // Only activate if touch is within graph bounds
        if (
          touchX >= leftPadding &&
          touchX <= graphWidth + leftPadding &&
          touchY >= topPadding &&
          touchY <= graphHeight + topPadding
        ) {
          setIsInteracting(true);
          setTooltipVisible(true); // Show tooltip on interaction
          hasInteractedRef.current = true; // Mark that user has interacted
          const normalizedX = touchX - leftPadding;
          const index = Math.round(
            (normalizedX / graphWidth) * (weeks.length - 1),
          );
          const clampedIndex = Math.max(0, Math.min(index, weeks.length - 1));
          setSelectedIndex(clampedIndex);
          lastIndexRef.current = clampedIndex;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touchX = evt.nativeEvent.locationX;

        // Calculate movement threshold for smoother transitions
        const normalizedX = Math.max(
          0,
          Math.min(touchX - leftPadding, graphWidth),
        );
        const rawIndex = (normalizedX / graphWidth) * (weeks.length - 1);
        const newIndex = Math.round(rawIndex);
        const clampedIndex = Math.max(0, Math.min(newIndex, weeks.length - 1));

        // Only update if index actually changed (prevents jumps)
        if (clampedIndex !== lastIndexRef.current) {
          // Allow only one step at a time for smooth transitions
          const step = clampedIndex > lastIndexRef.current ? 1 : -1;
          const nextIndex = lastIndexRef.current + step;

          // Check if we've moved enough to warrant an index change
          const segmentWidth = graphWidth / (weeks.length - 1);
          const currentX = xScale(lastIndexRef.current) - leftPadding;
          const distanceMoved = Math.abs(normalizedX - currentX);

          // Require at least 50% of segment width to move to next point
          if (distanceMoved >= segmentWidth * 0.5) {
            setSelectedIndex(nextIndex);
            lastIndexRef.current = nextIndex;
          }
        }
      },
      onPanResponderRelease: () => {
        setIsInteracting(false); // just end interaction
        // Hide tooltip after release if user has interacted before
        if (hasInteractedRef.current) {
          setTooltipVisible(false);
        }
      },
      onPanResponderTerminate: () => {
        setIsInteracting(false); // just end interaction
        // Hide tooltip after termination if user has interacted before
        if (hasInteractedRef.current) {
          setTooltipVisible(false);
        }
      },
    }),
  ).current;

  // Calculate accuracy for selected week
  const currentForecast = forecastData[selectedIndex];
  const currentActual = actualData[selectedIndex];
  const accuracy =
    currentActual > 0 ? (currentForecast / currentActual) * 100 : 0;
  const accuracyColor =
    accuracy >= 80 ? '#10B981' : accuracy >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Icons.AIInsightsIcon height={22} width={22} />
          </View>
          <Text style={styles.title}>AI Insights</Text>
        </View>
        <Icon name="chevron-right" size={16} color="#6B7280" />
      </View>

      <View 
        style={styles.graphContainer} 
        {...panResponder.panHandlers}
        collapsable={false}>
        {/* Enhanced Interactive Tooltip */}
        {tooltipVisible && (
          <View
            style={[
              styles.tooltip,
              {
                left: Math.min(
                  Math.max(xScale(selectedIndex) - 80, 0),
                  graphWidth + leftPadding - 160,
                ),
              },
            ]}>
          {/* <Text style={styles.tooltipTitle}>{weeks[selectedIndex]} 2024</Text> */}
          <View style={styles.tooltipRow}>
            <View style={[styles.tooltipDot, {backgroundColor: '#10B981'}]} />
            <Text style={styles.tooltipLabel}>Forecast:</Text>
            <Text style={styles.tooltipValue}>
              ₹{formatCompactNumber(currentForecast)}
            </Text>
          </View>
          <View style={styles.tooltipRow}>
            <View style={[styles.tooltipDot, {backgroundColor: '#F59E0B'}]} />
            <Text style={styles.tooltipLabel}>Actual:</Text>
            <Text style={styles.tooltipValue}>
              ₹{formatCompactNumber(currentActual)}
            </Text>
          </View>
          {/* <View style={styles.tooltipRow}>
              <View
                style={[styles.tooltipDot, {backgroundColor: accuracyColor}]}
              />
              <Text style={styles.tooltipLabel}>Accuracy:</Text>
              <Text style={[styles.tooltipValue, {color: accuracyColor}]}>
                {accuracy.toFixed(1)}%
              </Text>
            </View> */}
          </View>
        )}

        <Svg
          width={graphWidth + leftPadding + rightPadding}
          height={graphHeight + bottomPadding + topPadding}>
          <Rect
            x={leftPadding}
            y={topPadding}
            width={graphWidth}
            height={graphHeight}
            fill="rgba(248, 250, 252, 0.5)"
            stroke="#F1F5F9"
            strokeWidth={1}
            rx={8}
          />

          {/* Enhanced horizontal grid lines */}
          {yAxisData.labels.map((value, index) => (
            <Line
              key={`grid-${index}`}
              x1={leftPadding}
              y1={yScale(value)}
              x2={graphWidth + leftPadding}
              y2={yScale(value)}
              stroke="#E2E8F0"
              strokeWidth={index === 0 ? 1.5 : 0.8}
              opacity={index === 0 ? 1 : 0.6}
            />
          ))}

          {/* Enhanced vertical grid lines */}
          {weeks.map((_, index) => (
            <Line
              key={`v-grid-${index}`}
              x1={xScale(index)}
              y1={topPadding}
              x2={xScale(index)}
              y2={graphHeight + topPadding}
              stroke="#F1F5F9"
              strokeWidth={0.5}
              opacity={0.5}
            />
          ))}

          {/* Enhanced Y-axis labels with better positioning */}
          {yAxisData.labels.map((value, index) => (
            <SvgText
              key={`y-${index}`}
              x={leftPadding - 5}
              y={yScale(value) + 4}
              fontSize="10"
              fill="#64748B"
              textAnchor="end"
              fontWeight="500">
              {formatYAxisLabel(value)}
            </SvgText>
          ))}

          {/* Y-axis line */}
          <Line
            x1={leftPadding}
            y1={topPadding}
            x2={leftPadding}
            y2={graphHeight + topPadding}
            stroke="#CBD5E1"
            strokeWidth={1.5}
          />

          {/* X-axis line */}
          <Line
            x1={leftPadding}
            y1={graphHeight + topPadding}
            x2={graphWidth + leftPadding}
            y2={graphHeight + topPadding}
            stroke="#CBD5E1"
            strokeWidth={1.5}
          />

          {/* Sales Forecast line with enhanced styling */}
          <Path
            d={createForecastPath}
            stroke="#10B981"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Actual Sales line with enhanced styling */}
          <Path
            d={createActualPath}
            stroke="#F59E0B"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points for forecast */}
          {forecastData.map((value, index) => (
            <Circle
              key={`forecast-point-${index}`}
              cx={xScale(index)}
              cy={yScale(value)}
              r={index === selectedIndex && isInteracting ? 6 : 3}
              fill="#10B981"
              strokeWidth={2}
              opacity={index === selectedIndex && isInteracting ? 1 : 0.8}
            />
          ))}

          {/* Data points for actual */}
          {actualData.map((value, index) => (
            <Circle
              key={`actual-point-${index}`}
              cx={xScale(index)}
              cy={yScale(value)}
              r={index === selectedIndex && isInteracting ? 6 : 3}
              fill="#F59E0B"
              strokeWidth={2}
              opacity={index === selectedIndex && isInteracting ? 1 : 0.8}
            />
          ))}

          {/* Interactive elements */}
        
            <>
              {/* Vertical indicator line */}
              <Line
                x1={xScale(selectedIndex)}
                y1={topPadding}
                x2={xScale(selectedIndex)}
                y2={graphHeight + topPadding}
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray={[6, 4]}
              />

              {/* Enhanced highlighted points */}
              <Circle
                cx={xScale(selectedIndex)}
                cy={yScale(forecastData[selectedIndex])}
                r={4}
                fill="#10B981"
                stroke="#10B981"
                strokeWidth={3}
              />
              <Circle
                cx={xScale(selectedIndex)}
                cy={yScale(actualData[selectedIndex])}
                r={4}
                fill="#F59E0B"
                stroke="#F59E0B"
                strokeWidth={3}
              />
            </>
          

          {/* Enhanced X-axis labels with better spacing and rotation */}
          {weeks.map((week, index) => {
            const isSelected = index === selectedIndex && isInteracting;
            return (
              <SvgText
                key={`x-label-${index}`}
                x={xScale(index)}
                y={graphHeight + topPadding + 24}
                fontSize={isSelected ? '12' : '10'}
                fill={isSelected ? '#1F2937' : '#64748B'}
                textAnchor="middle"
                fontWeight={isSelected ? '600' : '500'}>
                {week}
              </SvgText>
            );
          })}

          {/* Y-axis tick marks */}
          {yAxisData.labels.map((value, index) => (
            <Line
              key={`y-tick-${index}`}
              x1={leftPadding - 3}
              y1={yScale(value)}
              x2={leftPadding}
              y2={yScale(value)}
              stroke="#CBD5E1"
              strokeWidth={1}
            />
          ))}

          {/* X-axis tick marks */}
          {weeks.map((_, index) => (
            <Line
              key={`x-tick-${index}`}
              x1={xScale(index)}
              y1={graphHeight + topPadding}
              x2={xScale(index)}
              y2={graphHeight + topPadding + 5}
              stroke="#CBD5E1"
              strokeWidth={1}
            />
          ))}
        </Svg>
      </View>

      {/* Enhanced Legend with better styling */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#10B981'}]} />
          <Text style={styles.legendText}>Sales Forecast</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#F59E0B'}]} />
          <Text style={styles.legendText}>Actual Sales</Text>
        </View>
        {/* <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#8B5CF6'}]} />
          <Text style={styles.legendText}>AI Accuracy</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECEFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  graphContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -70,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 10,
    minWidth: 150,
    marginTop: 60,
  },
  tooltipTitle: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  tooltipLabel: {
    fontSize: 10,
    color: '#8F939E',
    fontWeight: '400',
    flex: 1,
  },
  tooltipValue: {
    fontSize: 10,
    color: '#111111',
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.primaryTitle,
    fontWeight: '600',
  },
});

export default AIInsightsCard;
