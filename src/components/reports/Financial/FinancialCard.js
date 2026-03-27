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

const FinancialCard = ({onPress}) => {
  const [selectedIndex, setSelectedIndex] = useState(3); // Default to April (index 3)
  const [isInteracting, setIsInteracting] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true); // Visible on first entry
  const hasInteractedRef = useRef(false); // Track if user has interacted before

  // Enhanced mock data for the line graph
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const revenueData = [1200, 1800, 1500, 3500, 2200, 2800, 3200, 4100];
  const expensesData = [800, 1200, 1100, 1800, 1400, 1600, 1900, 2200];

  const graphWidth = width - 80; // Further reduced margin
  const graphHeight = 140;
  const leftPadding = 35; // Further reduced left padding
  const rightPadding = 20;
  const bottomPadding = 25; // Reduced bottom padding
  const topPadding = 20;

  // Enhanced Y-axis scale with better distribution and cleaner values
  const yAxisData = useMemo(() => {
    const allData = [...revenueData, ...expensesData];
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
  }, [revenueData, expensesData]);

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
    index => (index / (months.length - 1)) * graphWidth + leftPadding,
    [months.length],
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
  const createRevenuePath = useMemo(() => {
    if (revenueData.length < 2) return '';

    return d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))(revenueData);
  }, [revenueData, xScale, yScale]);

  const createExpensesPath = useMemo(() => {
    if (expensesData.length < 2) return '';

    return d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))(expensesData);
  }, [expensesData, xScale, yScale]);

  // Enhanced pan responder with better touch handling
  // Enhanced pan responder with smooth sequential navigation
  const lastIndexRef = useRef(3);
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
            (normalizedX / graphWidth) * (months.length - 1),
          );
          const clampedIndex = Math.max(0, Math.min(index, months.length - 1));
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
        const rawIndex = (normalizedX / graphWidth) * (months.length - 1);
        const newIndex = Math.round(rawIndex);
        const clampedIndex = Math.max(0, Math.min(newIndex, months.length - 1));

        // Only update if index actually changed (prevents jumps)
        if (clampedIndex !== lastIndexRef.current) {
          // Allow only one step at a time for smooth transitions
          const step = clampedIndex > lastIndexRef.current ? 1 : -1;
          const nextIndex = lastIndexRef.current + step;

          // Check if we've moved enough to warrant an index change
          const segmentWidth = graphWidth / (months.length - 1);
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

  // Calculate profit for selected month
  const currentRevenue = revenueData[selectedIndex];
  const currentExpenses = expensesData[selectedIndex];
  const currentProfit = currentRevenue - currentExpenses;
  const profitPercentage =
    currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Icons.FinancialIcon height={20} width={20} />
          </View>
          <Text style={styles.title}>Financial Overview</Text>
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
          {/* <Text style={styles.tooltipTitle}>
              {months[selectedIndex]} 2024
            </Text> */}
          <View style={styles.tooltipRow}>
            <View style={[styles.tooltipDot, {backgroundColor: '#10B981'}]} />
            <Text style={styles.tooltipLabel}>Revenue:</Text>
            <Text style={styles.tooltipValue}>
              ₹{formatCompactNumber(currentRevenue)}
            </Text>
          </View>
          <View style={styles.tooltipRow}>
            <View style={[styles.tooltipDot, {backgroundColor: '#F59E0B'}]} />
            <Text style={styles.tooltipLabel}>Expenses:</Text>
            <Text style={styles.tooltipValue}>
              ₹{formatCompactNumber(currentExpenses)}
            </Text>
          </View>
          <View style={styles.tooltipRow}>
            {/* <View
                style={[
                  styles.tooltipDot,
                  {backgroundColor: currentProfit >= 0 ? '#10B981' : '#EF4444'},
                ]}
              /> */}
            {/* <Text style={styles.tooltipLabel}>Profit:</Text>
              <Text
                style={[
                  styles.tooltipValue,
                  {color: currentProfit >= 0 ? '#10B981' : '#EF4444'},
                ]}>
                ₹{formatCompactNumber(Math.abs(currentProfit))} (
                {profitPercentage.toFixed(1)}%)
              </Text> */}
          </View>
          </View>
        )}

        <Svg
          width={graphWidth + leftPadding + rightPadding}
          height={graphHeight + bottomPadding + topPadding}>
          {/* Background */}
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
          {months.map((_, index) => (
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

          {/* Revenue line with enhanced styling */}
          <Path
            d={createRevenuePath}
            stroke="#10B981"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Expenses line with enhanced styling */}
          <Path
            d={createExpensesPath}
            stroke="#F59E0B"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points for revenue */}
          {revenueData.map((value, index) => (
            <Circle
              key={`revenue-point-${index}`}
              cx={xScale(index)}
              cy={yScale(value)}
              r={index === selectedIndex && isInteracting ? 6 : 3}
              fill="#10B981"
              strokeWidth={2}
              opacity={index === selectedIndex && isInteracting ? 1 : 0.8}
            />
          ))}

          {/* Data points for expenses */}
          {expensesData.map((value, index) => (
            <Circle
              key={`expenses-point-${index}`}
              cx={xScale(index)}
              cy={yScale(value)}
              r={index === selectedIndex && isInteracting ? 6 : 3}
              fill="#F59E0B"
              strokeWidth={2}
              opacity={index === selectedIndex && isInteracting ? 1 : 0.8}
            />
          ))}

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
              cy={yScale(revenueData[selectedIndex])}
              r={4}
              fill="#10B981"
              stroke="#10B981"
              strokeWidth={3}
            />
            <Circle
              cx={xScale(selectedIndex)}
              cy={yScale(expensesData[selectedIndex])}
              r={4}
              fill="#F59E0B"
              stroke="#F59E0B"
              strokeWidth={3}
            />
          </>

          {/* Enhanced X-axis labels with better spacing and rotation */}
          {months.map((month, index) => {
            const isSelected = index === selectedIndex && isInteracting;
            return (
              <SvgText
                key={`x-label-${index}`}
                x={xScale(index)}
                y={graphHeight + topPadding + 22}
                fontSize={isSelected ? '12' : '10'}
                fill={isSelected ? '#1F2937' : '#64748B'}
                textAnchor="middle"
                fontWeight={isSelected ? '600' : '500'}>
                {month}
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
          {months.map((_, index) => (
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
          <Text style={styles.legendText}>Revenue</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#F59E0B'}]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        {/* <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#10B981'}]} />
          <Text style={styles.legendText}>Profit</Text>
        </View> */}
      </View>

      {/* Summary metrics */}
      {/* <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={styles.summaryValue}>
            ₹{formatCompactNumber(revenueData.reduce((a, b) => a + b, 0))}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryValue}>
            ₹{formatCompactNumber(expensesData.reduce((a, b) => a + b, 0))}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Profit</Text>
          <Text style={[styles.summaryValue, {color: '#10B981'}]}>
            ₹
            {formatCompactNumber(
              revenueData.reduce((a, b) => a + b, 0) -
                expensesData.reduce((a, b) => a + b, 0),
            )}
          </Text>
        </View>
      </View> */}
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
    marginBottom: 16,
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
    marginTop: 50,
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
  // summaryContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingTop: 10,
  //   borderTopWidth: 1,
  //   borderTopColor: Colors.border,
  // },
  // summaryItem: {
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // summaryLabel: {
  //   fontSize: 11,
  //   color: '#6B7280',
  //   fontWeight: '500',
  //   marginBottom: 4,
  // },
  // summaryValue: {
  //   fontSize: 14,
  //   color: Colors.primaryTitle,
  //   fontWeight: '600',
  // },
});

export default FinancialCard;
