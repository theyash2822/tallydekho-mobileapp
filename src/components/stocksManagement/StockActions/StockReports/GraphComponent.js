import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Svg, {
  Rect,
  Line,
  Path,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import * as d3 from 'd3-shape';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const GraphComponent = () => {
  // Sample data matching the chart
  const skuData = [
    {sku: 'SKU-A', salesValue: 30000},
    {sku: 'SKU-B', salesValue: 20000},
    {sku: 'SKU-C', salesValue: 15000},
    {sku: 'SKU-D', salesValue: 10000},
    {sku: 'SKU-E', salesValue: 8000},
    {sku: 'SKU-F', salesValue: 7000},
   
  ];

  // Responsive chart dimensions - further reduced height
  const containerPadding = 16;
  const chartWidth = screenWidth - (containerPadding * 2);
  const chartHeight = Math.min(screenHeight * 0.35, 320);
  
  // Responsive padding based on screen size - reduced left/right padding
  const leftPadding = Math.max(45, screenWidth * 0.08);
  const rightPadding = Math.max(45, screenWidth * 0.08);
  const topPadding = Math.max(28, chartHeight * 0.11);
  const bottomPadding = Math.max(40, chartHeight * 0.18);
  
  // Gap between y-axis and bars (both left and right)
  const yAxisBarGap = Math.max(8, screenWidth * 0.02);
  
  // Remove gap between bars and x-axis - bars will touch x-axis
  const barBottomGap = 0;
  
  const innerWidth = chartWidth - leftPadding - rightPadding - (yAxisBarGap * 2);
  const innerHeight = chartHeight - topPadding - bottomPadding;
  
  // Responsive font sizes
  const titleFontSize = Math.max(14, screenWidth * 0.04);
  const axisLabelFontSize = Math.max(10, screenWidth * 0.025);
  const tickFontSize = Math.max(9, screenWidth * 0.022);

  // Calculate cumulative percentages
  const totalSales = skuData.reduce((sum, item) => sum + item.salesValue, 0);
  const cumulativeData = useMemo(() => {
    let cumulative = 0;
    return skuData.map(item => {
      cumulative += item.salesValue;
      return {
        ...item,
        cumulativeValue: cumulative,
        cumulativePercent: (cumulative / totalSales) * 100,
      };
    });
  }, []);

  // Scales
  const maxSalesValue = Math.max(...skuData.map(d => d.salesValue));
  // Bars touch x-axis, so use full innerHeight
  const yScaleSales = (value) =>
    topPadding +
    innerHeight -
    (value / maxSalesValue) * innerHeight;

  // Responsive bar width and spacing
  const barSpacing = Math.max(4, innerWidth * 0.01);
  const barWidth = (innerWidth - (barSpacing * (skuData.length - 1))) / skuData.length;
  
  // X scale for bars (centered on bar positions) - add gap from y-axis
  const xScaleBar = (index) =>
    leftPadding + yAxisBarGap + (index * (barWidth + barSpacing)) + barWidth / 2;
  
  // X scale for line (same as bars to align properly)
  const xScale = (index) => xScaleBar(index);

  const yScalePercent = (percent) =>
    topPadding + innerHeight - (percent / 100) * innerHeight;

  // Build cumulative line path
  const cumulativePath = useMemo(() => {
    const points = cumulativeData.map((item, index) => [
      xScale(index),
      yScalePercent(item.cumulativePercent),
    ]);
    return d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX)(points);
  }, [cumulativeData]);

  // Y-axis ticks for sales value
  const salesTicks = [0, 5000, 10000, 15000, 20000, 25000, 30000];
  const percentTicks = [0, 20, 40, 60, 80, 100];

  return (
    <View style={styles.container}>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <Defs>
              <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
              </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {salesTicks.map((tick, i) => {
              const yPos = yScaleSales(tick);
              return (
                <Line
                  key={`grid-sales-${i}`}
                  x1={leftPadding + yAxisBarGap}
                  y1={yPos}
                  x2={leftPadding + yAxisBarGap + innerWidth}
                  y2={yPos}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Reference lines */}
            <Line
              x1={leftPadding + yAxisBarGap}
              y1={yScalePercent(80)}
              x2={leftPadding + yAxisBarGap + innerWidth}
              y2={yScalePercent(80)}
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="5,5"
              opacity={0.7}
            />
            <Line
              x1={leftPadding + yAxisBarGap}
              y1={yScalePercent(20)}
              x2={leftPadding + yAxisBarGap + innerWidth}
              y2={yScalePercent(20)}
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="5,5"
              opacity={0.7}
            />

            {/* Bars */}
            {skuData.map((item, index) => {
              const barHeight = (item.salesValue / maxSalesValue) * innerHeight;
              const barX = xScale(index) - barWidth / 2;
              const barY = yScaleSales(item.salesValue);

              return (
                <Rect
                  key={`bar-${index}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx={Math.max(2, barWidth * 0.1)}
                />
              );
            })}

            {/* Cumulative line */}
            <Path
              d={cumulativePath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={Math.max(2, screenWidth * 0.006)}
            />

            {/* Cumulative line points */}
            {cumulativeData.map((item, index) => {
              const pointRadius = Math.max(3, screenWidth * 0.01);
              return (
                <Circle
                  key={`point-${index}`}
                  cx={xScale(index)}
                  cy={yScalePercent(item.cumulativePercent)}
                  r={pointRadius}
                  fill="#3B82F6"
                  stroke="#fff"
                  strokeWidth={Math.max(1.5, pointRadius * 0.4)}
                />
              );
            })}

            {/* Left Y-axis - Sales Value */}
            <Line
              x1={leftPadding}
              y1={topPadding}
              x2={leftPadding}
              y2={topPadding + innerHeight}
              stroke="#374151"
              strokeWidth={Math.max(1, screenWidth * 0.003)}
            />
            {salesTicks.map((tick, i) => {
              const yPos = yScaleSales(tick);
              const tickLength = Math.max(4, screenWidth * 0.01);
              return (
                <G key={`y-label-sales-${i}`}>
                  <Line
                    x1={leftPadding - tickLength}
                    y1={yPos}
                    x2={leftPadding}
                    y2={yPos}
                    stroke="#374151"
                    strokeWidth={Math.max(1, screenWidth * 0.002)}
                  />
                  <SvgText
                    x={leftPadding - tickLength - 5}
                    y={yPos + tickFontSize / 3}
                    fontSize={tickFontSize}
                    fill="#6B7280"
                    textAnchor="end">
                    {tick === 0 ? '0' : `${tick / 1000}k`}
                  </SvgText>
                </G>
              );
            })}

            {/* Right Y-axis - Cumulative % - Hidden */}
            {/* <Line
              x1={leftPadding + yAxisBarGap + innerWidth}
              y1={topPadding}
              x2={leftPadding + yAxisBarGap + innerWidth}
              y2={topPadding + innerHeight}
              stroke="#374151"
              strokeWidth={Math.max(1, screenWidth * 0.003)}
            /> */}
            {percentTicks.map((tick, i) => {
              const yPos = yScalePercent(tick);
              const tickLength = Math.max(4, screenWidth * 0.01);
              const rightAxisX = leftPadding + yAxisBarGap + innerWidth;
              return (
                <G key={`y-label-percent-${i}`}>
                  <Line
                    x1={rightAxisX}
                    y1={yPos}
                    x2={rightAxisX + tickLength}
                    y2={yPos}
                    stroke="#374151"
                    strokeWidth={Math.max(1, screenWidth * 0.002)}
                  />
                  <SvgText
                    x={rightAxisX + tickLength + 5}
                    y={yPos + tickFontSize / 3}
                    fontSize={tickFontSize}
                    fill="#6B7280"
                    textAnchor="start">
                    {tick}%
                  </SvgText>
                </G>
              );
            })}

            {/* X-axis */}
            <Line
              x1={leftPadding + yAxisBarGap}
              y1={topPadding + innerHeight}
              x2={leftPadding + yAxisBarGap + innerWidth}
              y2={topPadding + innerHeight}
              stroke="#374151"
              strokeWidth={Math.max(1, screenWidth * 0.003)}
            />

            {/* X-axis labels */}
            {skuData.map((item, index) => {
              const xPos = xScale(index);
              const labelY = topPadding + innerHeight + Math.max(18, chartHeight * 0.06);
              return (
                <SvgText
                  key={`x-label-${index}`}
                  x={xPos}
                  y={labelY}
                  fontSize={tickFontSize}
                  fill="#6B7280"
                  textAnchor="middle"
                  transform={`rotate(-45 ${xPos} ${labelY})`}>
                  {item.sku}
                </SvgText>
              );
            })}

            {/* Axis labels */}
            <SvgText
              x={leftPadding - Math.max(20, screenWidth * 0.04)}
              y={topPadding + innerHeight / 2 - 18 }
              fontSize={axisLabelFontSize}
              fill="#374151"
              fontWeight="500"
              textAnchor="middle"
              transform={`rotate(-90 ${leftPadding - Math.max(20, screenWidth * 0.04)} ${topPadding + innerHeight / 2})`}>
              Sales Value (₹)
            </SvgText>
            <SvgText
              x={leftPadding + yAxisBarGap + innerWidth + Math.max(20, screenWidth * 0.04)}
              y={topPadding + innerHeight / 2 - 20}
              fontSize={axisLabelFontSize}
              fill="#374151"
              fontWeight="500"
              textAnchor="middle"
              transform={`rotate(90 ${leftPadding + yAxisBarGap + innerWidth + Math.max(20, screenWidth * 0.04)} ${topPadding + innerHeight / 2})`}>
              Cumulative % of Sales
            </SvgText>
            <SvgText
              x={leftPadding + yAxisBarGap + innerWidth / 2}
              y={chartHeight - Math.max(8, chartHeight * 0.02) + 5}
              fontSize={axisLabelFontSize}
              fill="#374151"
              fontWeight="500"
              textAnchor="middle">
              SKUs (sorted by sales)
            </SvgText>
          </Svg>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: Math.max(16, screenHeight * 0.02),
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingRight: 8,
    minWidth: screenWidth - 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: Math.max(8, screenWidth * 0.02),
    minWidth: screenWidth - 16,
  },
});

export default GraphComponent;

