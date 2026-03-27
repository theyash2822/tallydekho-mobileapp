import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Text as SvgText,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import * as d3 from 'd3-shape';
import {formatCurrencyCompactINR} from '../../utils/formatUtils';

const {width: screenWidth} = Dimensions.get('window');

const DailyOutflowChart = ({
  title = 'Daily Outflow',
  data = [12500, 18900, 22400, 15800, 35200, 45600, 28900],
  dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  lineColor = '#10B981',
  pointColor = '#10B981',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(3);
  const [isInteracting, setIsInteracting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  // Memoize chart dimensions
  const chartDimensions = useMemo(() => {
    const chartHeight = 140;
    const chartWidth = screenWidth - 120;
    const maxY = Math.max(...data);
    const minY = Math.min(...data);

    const padding = 10;
    const adjustedMax = maxY + (maxY - minY) * 0.1 || maxY + padding;
    const adjustedMin = Math.max(0, minY - (maxY - minY) * 0.1);
    const range = adjustedMax - adjustedMin || 1;

    return {
      chartHeight,
      chartWidth,
      adjustedMax,
      adjustedMin,
      range,
      padding,
    };
  }, [data]);

  // Memoize scale functions
  const scales = useMemo(() => {
    const {chartHeight, chartWidth, adjustedMin, range} = chartDimensions;

    const yScale = value =>
      chartHeight - ((value - adjustedMin) / range) * chartHeight;

    const xScale = index => (index / Math.max(data.length - 1, 1)) * chartWidth;

    return {yScale, xScale};
  }, [chartDimensions, data.length]);

  // Memoize line path
  const path = useMemo(() => {
    if (data.length < 2) return '';

    return d3
      .line()
      .x((d, i) => scales.xScale(i))
      .y(d => scales.yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))(data);
  }, [data, scales]);

  // Memoize area path for gradient fill
  const areaPath = useMemo(() => {
    if (data.length < 2) return '';

    const area = d3
      .area()
      .x((d, i) => scales.xScale(i))
      .y0(chartDimensions.chartHeight) // Bottom of chart
      .y1(d => scales.yScale(d)) // Line data points
      .curve(d3.curveCatmullRom.alpha(0.5));

    return area(data);
  }, [data, scales, chartDimensions.chartHeight]);

  // Memoize Y-axis labels
  const yAxisLabels = useMemo(() => {
    const {adjustedMax, adjustedMin} = chartDimensions;
    const steps = 5;

    return Array.from({length: steps}, (_, i) => {
      const value =
        adjustedMax - (i / (steps - 1)) * (adjustedMax - adjustedMin);
      return {
        value: Math.round(value),
        label: formatCurrencyCompactINR(Math.round(value)),
        y: (i / (steps - 1)) * chartDimensions.chartHeight + 8,
      };
    });
  }, [chartDimensions]);

  // Memoize X-axis labels
  const xAxisLabels = useMemo(() => {
    return dates.map((date, index) => ({
      label: date,
      index: index,
      x: scales.xScale(index) + 40,
    }));
  }, [dates, scales.xScale]);

  // Optimized PanResponder with throttling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: useCallback(
        evt => {
          setIsInteracting(true);
          const touchX = Math.max(
            0,
            Math.min(
              evt.nativeEvent.locationX - 40,
              chartDimensions.chartWidth,
            ),
          );
          const index = Math.round(
            (touchX / chartDimensions.chartWidth) * (data.length - 1),
          );
          setSelectedIndex(Math.max(0, Math.min(index, data.length - 1)));
        },
        [chartDimensions.chartWidth, data.length],
      ),
      onPanResponderMove: useCallback(
        evt => {
          const touchX = Math.max(
            0,
            Math.min(
              evt.nativeEvent.locationX - 40,
              chartDimensions.chartWidth,
            ),
          );
          const index = Math.round(
            (touchX / chartDimensions.chartWidth) * (data.length - 1),
          );
          setSelectedIndex(Math.max(0, Math.min(index, data.length - 1)));
        },
        [chartDimensions.chartWidth, data.length],
      ),
      onPanResponderRelease: useCallback(() => {
        setIsInteracting(false);
      }, []),
    }),
  ).current;

  // Memoize current value calculations
  const valueInfo = useMemo(() => {
    const currentValue = data[selectedIndex] || data[data.length - 1];
    const previousValue = selectedIndex > 0 ? data[selectedIndex - 1] : data[0];
    const valueChange = currentValue - previousValue;
    const valueChangePercent =
      previousValue !== 0
        ? ((valueChange / previousValue) * 100).toFixed(1)
        : 0;

    return {
      currentValue,
      valueChange,
      valueChangePercent,
    };
  }, [selectedIndex, data]);

  // Memoize data points to prevent recreation
  const dataPoints = useMemo(() => {
    return data.map((value, index) => ({
      x: scales.xScale(index) + 40,
      y: scales.yScale(value) + 15,
      value,
      index,
      isSelected: index === selectedIndex,
    }));
  }, [data, scales, selectedIndex]);

  // Memoize interactive elements
  const interactiveElements = useMemo(() => {
    if (!isInteracting) return null;

    const selectedPoint = dataPoints[selectedIndex];
    if (!selectedPoint) return null;

    return (
      <>
        {/* Vertical indicator line */}
        <Line
          x1={selectedPoint.x}
          y1={15}
          x2={selectedPoint.x}
          y2={chartDimensions.chartHeight + 15}
          stroke="#ccc"
          strokeDasharray={[4, 4]}
        />

        {/* Highlighted point */}
        <Circle
          cx={selectedPoint.x}
          cy={selectedPoint.y}
          r={6}
          fill="white"
          stroke={lineColor}
          strokeWidth={3}
        />

        {/* Tooltip */}
        <Rect
          x={selectedPoint.x - 30}
          y={selectedPoint.y - 15}
          width={60}
          height={25}
          rx={8}
          fill="#333"
          opacity={0.9}
        />
        <SvgText
          x={selectedPoint.x}
          y={selectedPoint.y - 2}
          fontSize="11"
          fill="white"
          textAnchor="middle"
          fontWeight="600">
          {formatCurrencyCompactINR(selectedPoint.value)}
        </SvgText>
      </>
    );
  }, [
    isInteracting,
    selectedIndex,
    dataPoints,
    chartDimensions.chartHeight,
    valueInfo,
    lineColor,
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Value info header */}
      <View style={styles.chartHeader}>
        <View style={styles.valueInfo}>
          <Text style={styles.currentValue}>
            {formatCurrencyCompactINR(valueInfo.currentValue)}
          </Text>
          <Text
            style={[
              styles.valueChange,
              {color: valueInfo.valueChange >= 0 ? '#16C47F' : '#FF4444'},
            ]}>
            {valueInfo.valueChange >= 0 ? '+' : ''}
            {formatCurrencyCompactINR(Math.abs(valueInfo.valueChange))} (
            {valueInfo.valueChangePercent}%)
          </Text>
        </View>
        <Text style={styles.selectedDate}>{dates[selectedIndex]}</Text>
      </View>

      <View style={styles.chartContainer} {...panResponder.panHandlers}>
        <Svg
          height={chartDimensions.chartHeight + 50}
          width={chartDimensions.chartWidth + 80}>
          {/* Gradient definition */}
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {yAxisLabels.map((label, idx) => (
            <Line
              key={`grid-${idx}`}
              x1={40}
              y1={label.y}
              x2={chartDimensions.chartWidth + 40}
              y2={label.y}
              stroke="#F0F0F0"
              strokeWidth="0.5"
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, idx) => (
            <SvgText
              key={`y-${idx}`}
              x={35}
              y={label.y + 6}
              fontSize="10"
              fill="#8F939E"
              textAnchor="end"
              fontWeight="500">
              {label.label}
            </SvgText>
          ))}

          {/* Area fill (gradient) */}
          <Path
            d={areaPath}
            fill="url(#areaGradient)"
            transform={`translate(40, 15)`}
          />

          {/* Chart line */}
          <Path
            d={path}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(40, 15)`}
          />

          {/* Data points */}
          {dataPoints.map(point => (
            <Circle
              key={`point-${point.index}`}
              cx={point.x}
              cy={point.y}
              r={point.isSelected ? 4 : 2}
              fill={point.isSelected ? '#333' : pointColor}
              opacity={point.isSelected ? 1 : 0.6}
            />
          ))}

          {/* Interactive elements */}
          {interactiveElements}
        </Svg>

        {/* X-axis labels */}
        <View style={styles.xAxisContainer}>
          {xAxisLabels.map(label => (
            <View key={label.index} style={styles.xAxisLabelContainer}>
              <Text
                style={[
                  styles.xAxisLabel,
                  selectedIndex === label.index && styles.selectedXAxisLabel,
                ]}>
                {label.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueInfo: {
    flex: 1,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  valueChange: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  selectedDate: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  xAxisLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#8F939E',
    textAlign: 'center',
    fontWeight: '400',
  },
  selectedXAxisLabel: {
    color: '#10B981',
    fontWeight: '600',
  },
});

export default React.memo(DailyOutflowChart);
