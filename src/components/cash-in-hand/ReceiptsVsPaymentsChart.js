import React, {useState, useMemo, useCallback} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Svg, {
  Rect,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import {formatCurrencyCompactINR} from '../../utils/formatUtils';

const {width: screenWidth} = Dimensions.get('window');

// Chart constants
const CHART_WIDTH = screenWidth - 130;
const CHART_HEIGHT = 150;
const BAR_WIDTH = 16;
const BAR_SPACING = 4;

const ReceiptsVsPaymentsChart = ({data = []}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  // Reset when screen is focused
  useFocusEffect(
    useCallback(() => {
      setSelectedIndex(null);
      setHoveredIndex(-1);
    }, []),
  );

  // Ensure we have exactly 7 data points
  const chartData = useMemo(() => {
    if (data.length >= 7) return data.slice(0, 7);

    const paddedData = [...data];
    while (paddedData.length < 7) {
      paddedData.push({
        date: `Day ${paddedData.length + 1}`,
        receipts: 0,
        payments: 0,
      });
    }
    return paddedData;
  }, [data]);

  // Chart dimensions
  const chartDimensions = useMemo(() => {
    const maxY = Math.max(
      ...chartData.flatMap(item => [item.receipts, item.payments]),
    );
    const minY = Math.min(
      ...chartData.flatMap(item => [item.receipts, item.payments]),
    );

    const padding = 10;
    const adjustedMax = maxY + (maxY - minY) * 0.1 || maxY + padding;
    const adjustedMin = Math.max(0, minY - (maxY - minY) * 0.1);
    const range = adjustedMax - adjustedMin || 1;

    return {
      chartHeight: CHART_HEIGHT,
      chartWidth: CHART_WIDTH,
      adjustedMax,
      adjustedMin,
      range,
    };
  }, [chartData]);

  const scales = useMemo(() => {
    const {chartHeight, adjustedMin, range} = chartDimensions;

    const yScale = value =>
      chartHeight - ((value - adjustedMin) / range) * chartHeight;

    const xScale = index =>
      (index / Math.max(chartData.length - 1, 1)) * CHART_WIDTH;

    return {yScale, xScale};
  }, [chartDimensions, chartData.length]);

  const yAxisLabels = useMemo(() => {
    const {adjustedMax, adjustedMin, chartHeight} = chartDimensions;
    const steps = 5;

    return Array.from({length: steps}, (_, i) => {
      const value =
        adjustedMax - (i / (steps - 1)) * (adjustedMax - adjustedMin);
      return {
        value: Math.round(value),
        label: formatCurrencyCompactINR(Math.round(value)),
        y: (i / (steps - 1)) * chartHeight + 8,
      };
    });
  }, [chartDimensions]);

 const xAxisLabels = useMemo(() => {
   return chartData.map((item, index) => ({
     label: item.date,
     index,
     x: scales.xScale(index) + 40 + BAR_WIDTH, // center under group
   }));
 }, [chartData, scales.xScale]);


  const scaleY = useCallback(value => scales.yScale(value), [scales]);

  const renderBar = useCallback(
    (value, x, color, isReceipt, index) => {
      if (value <= 0) return null;

      const height = scaleY(0) - scaleY(value);
      const y = scaleY(value) + 15;
      const isSelected = selectedIndex === index;
      const isHovered = hoveredIndex === index;

      return (
        <Rect
          key={`${isReceipt ? 'receipt' : 'payment'}-${index}`}
          x={x}
          y={y}
          width={BAR_WIDTH}
          height={height}
          fill={color}
          rx={3}
          opacity={isSelected ? 1 : isHovered ? 0.8 : 0.7}
        />
      );
    },
    [scaleY, selectedIndex, hoveredIndex],
  );

  // Only calculate if selectedIndex is set
  const valueInfo = useMemo(() => {
    if (selectedIndex === null) return null;

    const item = chartData[selectedIndex] || chartData[chartData.length - 1];
    const previousItem =
      selectedIndex > 0 ? chartData[selectedIndex - 1] : chartData[0];

    const receiptsChange = item.receipts - previousItem.receipts;
    const paymentsChange = item.payments - previousItem.payments;

    return {
      receipts: item.receipts,
      payments: item.payments,
      receiptsChange,
      paymentsChange,
      receiptsChangePercent:
        previousItem.receipts !== 0
          ? ((receiptsChange / previousItem.receipts) * 100).toFixed(1)
          : 0,
      paymentsChangePercent:
        previousItem.payments !== 0
          ? ((paymentsChange / previousItem.payments) * 100).toFixed(1)
          : 0,
    };
  }, [selectedIndex, chartData]);

  const interactiveElements = useMemo(() => {
    if (selectedIndex === null) return null;

    const item = chartData[selectedIndex];
    const groupX = scales.xScale(selectedIndex);
    const receiptsX = groupX + 40;
    const paymentsX = groupX + BAR_WIDTH + BAR_SPACING + 40;
    const receiptsY = scaleY(item.receipts) + 15;
    const paymentsY = scaleY(item.payments) + 15;

    return (
      <>
        <Line
          x1={receiptsX + BAR_WIDTH / 2 + BAR_SPACING / 2}
          y1={15}
          x2={receiptsX + BAR_WIDTH / 2 + BAR_SPACING / 2}
          y2={CHART_HEIGHT + 15}
          stroke="#ccc"
          strokeDasharray={[4, 4]}
        />
        {item.receipts > 0 && (
          <>
            <Rect
              x={receiptsX + BAR_WIDTH / 2 - 25}
              y={receiptsY - 20}
              width={50}
              height={20}
              rx={8}
              fill="#A78BFA"
              opacity={0.9}
            />
            <SvgText
              x={receiptsX + BAR_WIDTH / 2}
              y={receiptsY - 8}
              fontSize="10"
              fill="white"
              textAnchor="middle"
              fontWeight="600">
              {formatCurrencyCompactINR(item.receipts)}
            </SvgText>
          </>
        )}
        {item.payments > 0 && (
          <>
            <Rect
              x={paymentsX + BAR_WIDTH / 2 - 25}
              y={paymentsY - 20}
              width={50}
              height={20}
              rx={8}
              fill="#10B981"
              opacity={0.9}
            />
            <SvgText
              x={paymentsX + BAR_WIDTH / 2}
              y={paymentsY - 8}
              fontSize="10"
              fill="white"
              textAnchor="middle"
              fontWeight="600">
              {formatCurrencyCompactINR(item.payments)}
            </SvgText>
          </>
        )}
      </>
    );
  }, [selectedIndex, chartData, scales, scaleY]);

  const handleTouch = useCallback(
    event => {
      const {locationX} = event.nativeEvent;
      const touchX = Math.max(
        0,
        Math.min(locationX - 40, chartDimensions.chartWidth),
      );
      const index = Math.round(
        (touchX / chartDimensions.chartWidth) * (chartData.length - 1),
      );
      setSelectedIndex(Math.max(0, Math.min(index, chartData.length - 1)));
    },
    [chartDimensions.chartWidth, chartData.length],
  );

  const handleTouchMove = useCallback(
    event => {
      const {locationX} = event.nativeEvent;
      const touchX = Math.max(
        0,
        Math.min(locationX - 40, chartDimensions.chartWidth),
      );
      const index = Math.round(
        (touchX / chartDimensions.chartWidth) * (chartData.length - 1),
      );
      if (index >= 0 && index < chartData.length) setHoveredIndex(index);
      else setHoveredIndex(-1);
    },
    [chartData.length, chartDimensions.chartWidth],
  );

  const handleTouchEnd = useCallback(() => {
    setHoveredIndex(-1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipts vs Payments</Text>

      {valueInfo && (
        <View style={styles.chartHeader}>
          <View style={styles.valueInfo}>
            <View style={styles.valueRow}>
              <Text style={[styles.currentValue, {color: '#A78BFA'}]}>
                {formatCurrencyCompactINR(valueInfo.receipts)}
              </Text>
              <Text
                style={[
                  styles.valueChange,
                  {
                    color:
                      valueInfo.receiptsChange >= 0 ? '#16C47F' : '#FF4444',
                  },
                ]}>
                {valueInfo.receiptsChange >= 0 ? '+' : ''}
                {formatCurrencyCompactINR(Math.abs(valueInfo.receiptsChange))} (
                {valueInfo.receiptsChangePercent}%)
              </Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.currentValue, {color: '#10B981'}]}>
                {formatCurrencyCompactINR(valueInfo.payments)}
              </Text>
              <Text
                style={[
                  styles.valueChange,
                  {
                    color:
                      valueInfo.paymentsChange >= 0 ? '#16C47F' : '#FF4444',
                  },
                ]}>
                {valueInfo.paymentsChange >= 0 ? '+' : ''}
                {formatCurrencyCompactINR(Math.abs(valueInfo.paymentsChange))} (
                {valueInfo.paymentsChangePercent}%)
              </Text>
            </View>
          </View>
          <Text style={styles.selectedDate}>
            {chartData[selectedIndex]?.date}
          </Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#A78BFA'}]} />
          <Text style={styles.legendText}>Receipts</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#10B981'}]} />
          <Text style={styles.legendText}>Payments</Text>
        </View>
      </View>

      {/* Chart */}
      <View
        style={styles.chartContainer}
        onTouchStart={handleTouch}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <Svg
          height={chartDimensions.chartHeight + 60}
          width={chartDimensions.chartWidth + 80}>
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

          <Defs>
            <LinearGradient id="receiptsGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#A78BFA" stopOpacity="0.7" />
            </LinearGradient>
            <LinearGradient id="paymentsGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
            </LinearGradient>
          </Defs>

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

          {chartData.map((item, index) => {
            const groupX = scales.xScale(index);
            return (
              <G key={index}>
                {renderBar(
                  item.receipts,
                  groupX + 40,
                  'url(#receiptsGradient)',
                  true,
                  index,
                )}
                {renderBar(
                  item.payments,
                  groupX + BAR_WIDTH + BAR_SPACING + 40,
                  'url(#paymentsGradient)',
                  false,
                  index,
                )}
              </G>
            );
          })}

          {interactiveElements}
        </Svg>

        {/* X-axis */}
        <View style={{width: chartDimensions.chartWidth + 80, marginTop: 8}}>
          <Svg height={20} width={chartDimensions.chartWidth + 80}>
            {xAxisLabels.map(label => (
              <SvgText
                key={label.index}
                x={label.x}
                y={15}
                fontSize="10"
                fill={selectedIndex === label.index ? '#10B981' : '#8F939E'}
                textAnchor="middle"
                fontWeight={selectedIndex === label.index ? '600' : '400'}>
                {label.label}
              </SvgText>
            ))}
          </Svg>
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
  title: {fontSize: 14, fontWeight: '500', color: '#111', marginBottom: 12},
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueInfo: {flex: 1},
  valueRow: {marginBottom: 4},
  currentValue: {fontSize: 18, fontWeight: '700', color: '#1A1A1A'},
  valueChange: {fontSize: 12, fontWeight: '500', marginTop: 2},
  selectedDate: {fontSize: 12, color: '#8F939E', fontWeight: '500'},
  legend: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 14,
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  legendColor: {width: 12, height: 12, borderRadius: 2},
  legendText: {fontSize: 12, color: '#6B7280', fontWeight: '500'},
  chartContainer: {alignItems: 'center'},
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  xAxisLabelContainer: { alignItems: 'center'},
  xAxisLabel: {
    fontSize: 10,
    color: '#8F939E',
    textAlign: 'center',
    fontWeight: '400',
  },
  selectedXAxisLabel: {color: '#10B981', fontWeight: '600'},
});

export default ReceiptsVsPaymentsChart;
