import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import Svg, {Circle, Path, Rect, Text as SvgText, Line} from 'react-native-svg';
import CustomBottomButton from '../../../common/BottomButton';
import {useAuth} from '../../../../hooks/useAuth';

const AIInsights = () => {
  const navigation = useNavigation();
  const {selectedFY} = useAuth(); // Get FY from global state
  
  // Define revenueData before using it in useState
  const revenueData = [
    {week: 'Week 1', value: 200},
    {week: 'Week 2', value: 700},
    {week: 'Week 3', value: 1800},
    {week: 'Week 4', value: 1300},
  ];

  const [tooltipVisible, setTooltipVisible] = useState(true); // Visible on first entry
  const [tooltipData, setTooltipData] = useState(() => {
    // Set initial tooltip data for first entry
    if (revenueData && revenueData.length > 0) {
      const initialIndex = Math.floor(revenueData.length / 2);
      const item = revenueData[initialIndex];
      return {week: item.week, value: `₹${item.value}`};
    }
    return {};
  });
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const hasInteractedRef = useRef(false); // Track if user has interacted before
  const initialTooltipSetRef = useRef(false); // Track if initial tooltip has been set
  
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showSensitivityDropdown, setShowSensitivityDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedSensitivity, setSelectedSensitivity] = useState('Sensitivity');

  // Dropdown options
  const periodOptions = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
  const sensitivityOptions = ['Low', 'Medium', 'High'];

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  const handleSensitivitySelect = (sensitivity) => {
    setSelectedSensitivity(sensitivity);
    setShowSensitivityDropdown(false);
  };

  // Set initial tooltip position on mount
  useEffect(() => {
    if (!initialTooltipSetRef.current && tooltipVisible && revenueData && revenueData.length > 0) {
      const chartHeight = 140;
      const chartWidth = 280;
      const padding = 20;
      const graphWidth = chartWidth - 3 * padding;
      const graphHeight = chartHeight - 1.8 * padding;

      const maxValue = Math.max(...revenueData.map(d => d.value));
      const minValue = 0;

      const getY = value =>
        chartHeight -
        padding -
        ((value - minValue) / (maxValue - minValue)) * graphHeight;

      const getX = index =>
        padding + (index / (revenueData.length - 1)) * graphWidth + 16;

      const initialIndex = Math.floor(revenueData.length / 2);
      const item = revenueData[initialIndex];
      const x = getX(initialIndex);
      const y = getY(item.value);

      const tooltipWidth = 80;
      const tooltipHeight = 30;

      let clampedX = x - tooltipWidth / 2;
      if (clampedX < 0) clampedX = 0;
      if (clampedX > chartWidth - tooltipWidth)
        clampedX = chartWidth - tooltipWidth;

      let clampedY = y - tooltipHeight - 5;
      if (clampedY < 0) clampedY = 0;

      setTooltipPosition({x: clampedX, y: clampedY});
      initialTooltipSetRef.current = true;
    }
  }, [tooltipVisible]);

  const expenseData = [
    {month: 'Jan', value: 1500},
    {month: 'Feb', value: 1200},
    {month: 'Mar', value: 1000},
    {month: 'Apr', value: 4500},
    {month: 'May', value: 2000},
  ];

  const receivablesData = {
    '0-30 Days': 11,
    '31-60 Days': 42,
    '61+ Days': 47,
  };

  const stockOutRisk = [
    {item: 'A101', days: 7},
    {item: 'B204', days: 9},
    {item: 'C104' , days : 11}
  ];

  const topSuppliers = [
    {name: 'Alliance Agency', percentage: 58},
    {name: 'Indian Grocery House', percentage: 22},
    {name: 'Netaji Industries', percentage: 9},
  ];

  const renderRevenueForecast = () => {
    const chartHeight = 140;
    const chartWidth = 280;
    const padding = 20;
    const graphWidth = chartWidth - 3 * padding;
    const graphHeight = chartHeight - 1.8 * padding;

    const maxValue = Math.max(...revenueData.map(d => d.value));
    const minValue = 0;
    const numGridLines = 4; // adjustable

    // Generate Y-axis grid positions and labels
    const yAxisValues = Array.from({length: numGridLines}, (_, i) =>
      Math.round(maxValue - (i * (maxValue - minValue)) / (numGridLines - 1)),
    );

    const getY = value =>
      chartHeight -
      padding -
      ((value - minValue) / (maxValue - minValue)) * graphHeight;

    const getX = index =>
      padding + (index / (revenueData.length - 1)) * graphWidth + 16; // +10 shifts right

    // Build smooth curve path
    const pathData = revenueData.reduce((acc, item, index, arr) => {
      const x = getX(index);
      const y = getY(item.value);
      if (index === 0) return `M${x},${y}`;
      const prevX = getX(index - 1);
      const prevY = getY(arr[index - 1].value);
      const midX = (prevX + x) / 2;
      return `${acc} C${midX},${prevY} ${midX},${y} ${x},${y}`;
    }, '');

    // Tooltip handler
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => {
        // Capture the gesture immediately to prevent ScrollView from taking over
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Capture horizontal movements to prevent ScrollView interference
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 3 || (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2);
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Capture horizontal movements in capture phase
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 3 || (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2);
      },
      onPanResponderTerminationRequest: () => {
        // Don't allow ScrollView to terminate our gesture when interacting
        return false;
      },
      onPanResponderGrant: handlePan,
      onPanResponderMove: handlePan,
      onPanResponderRelease: () => {
        // Hide tooltip after release if user has interacted before
        if (hasInteractedRef.current) {
          setTooltipVisible(false);
        }
      },
    });

    function handlePan(evt) {
      const {locationX} = evt.nativeEvent;
      const index = Math.round(
        ((locationX - padding) / graphWidth) * (revenueData.length - 1),
      );

      if (index >= 0 && index < revenueData.length) {
        const item = revenueData[index];
        const x = getX(index);
        const y = getY(item.value);

        const tooltipWidth = 80; // approximate tooltip width
        const tooltipHeight = 30; // approximate tooltip height

        // Clamp X so tooltip stays within bounds
        let clampedX = x - tooltipWidth / 2;
        if (clampedX < 0) clampedX = 0;
        if (clampedX > chartWidth - tooltipWidth)
          clampedX = chartWidth - tooltipWidth;

        // Clamp Y slightly to avoid going above chart
        let clampedY = y - tooltipHeight - 5;
        if (clampedY < 0) clampedY = 0;

        setTooltipData({week: item.week, value: `₹${item.value}`});
        setTooltipPosition({x: clampedX, y: clampedY});
        setTooltipVisible(true); // Show tooltip on interaction
        hasInteractedRef.current = true; // Mark that user has interacted
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Revenue Forecast</Text>
          <Text style={styles.forecastSummary}>₹7.8 M next 30 days (+12%)</Text>
        </View>

        <View 
          style={styles.chartContainer} 
          {...panResponder.panHandlers}
          collapsable={false}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grid lines and Y-axis labels */}
            {yAxisValues.map((val, i) => {
              const y = getY(val);
              return (
                <React.Fragment key={i}>
                  <Path
                    d={`M${padding + 10} ${y} L${
                      padding + graphWidth + 30
                    } ${y}`}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <SvgText x={0} y={y + 4} fontSize="10" fill="#6B7280">
                    ₹{val >= 1000 ? val / 1000 + 'k' : val}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {/* Revenue line */}
            <Path d={pathData} stroke="#10B981" strokeWidth="2" fill="none" />

            {/* Data points */}
            {revenueData.map((item, i) => {
              const x = getX(i);
              const y = getY(item.value);
              return <Circle key={i} cx={x} cy={y} r={3} fill="#10B981" />;
            })}

            {/* X-axis labels */}
            {revenueData.map((item, i) => (
              <SvgText
                key={i}
                x={getX(i)}
                y={chartHeight}
                fontSize="10"
                fill="#6B7280"
                textAnchor="middle">
                {item.week}
              </SvgText>
            ))}
          </Svg>

          {/* Tooltip */}
          {tooltipVisible && (
            <View
              style={[
                styles.tooltip,
                {
                  left: tooltipPosition.x,
                  top: tooltipPosition.y,
                },
              ]}>
              <Text style={styles.tooltipText}>
                {tooltipData.week}: {tooltipData.value}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderCashFlowProjection = () => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Cash-Flow Projection</Text>
        </View>
        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabel}>Inflows</Text>
          <Text style={styles.cashFlowValue}>+₹13,000</Text>
        </View>
        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabel}>Outflows</Text>
          <Text style={styles.cashFlowValue}>-₹9,000</Text>
        </View>
        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabel}>Net</Text>
          <Text style={styles.cashFlowValue}>+₹4,000</Text>
        </View>
      </View>
    );
  };

  const renderStockOutRisk = () => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{marginBottom:8}}>
          <Text style={styles.cardTitle}>Stock-out Risk</Text>
          </View>
        </View>
        {stockOutRisk.map((item, index) => (
          <View key={index} style={styles.riskItem}>
            <View style={styles.riskLeft}>
              <Text style={styles.riskItemCode}>{item.item}</Text>
            </View>
            <Text style={styles.riskItemText}>{item.days} days stock left</Text>
            <Ionicons name="warning" size={20} color="#EF4444" />
          </View>
        ))}
      </View>
    );
  };

  const renderExpenseSpikeAlert = () => {
    const chartHeight = 140;
    const chartWidth = 290;
    const padding = 20;
    const graphWidth = chartWidth - 2 * padding;
    const graphHeight = chartHeight - 2 * padding;

    // Use logarithmic scale for better visualization
    const maxValue = 100000; // ₹100k
    const minValue = 100; // ₹100

    const yAxisLabels = [100, 1000, 10000, 100000];

    const getLogY = value => {
      const logValue = Math.log10(value);
      const logMin = Math.log10(minValue);
      const logMax = Math.log10(maxValue);
      return (
        chartHeight -
        padding -
        ((logValue - logMin) / (logMax - logMin)) * graphHeight
      );
    };

    return (
      <View style={styles.card}>
        <View style={styles.alertHeader}>
          <Text style={styles.cardTitle}>Expense Spike Alert</Text>
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={16} color="#EF4444" />
            <Text style={styles.alertText}>Utilities up 42% vs avg</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Y-axis labels */}
            {yAxisLabels.map((label, index) => {
              const y = getLogY(label);
              const displayLabel =
                label >= 1000 ? `₹${label / 1000}k` : `₹${label}`;
              return (
                <SvgText
                  key={index}
                  x={0}
                  y={y + 3}
                  fontSize="10"
                  fill="#6B7280">
                  {displayLabel}
                </SvgText>
              );
            })}

            {/* Grid lines */}
            {yAxisLabels.map((label, index) => {
              const y = getLogY(label);
              return (
                <Path
                  key={index}
                  d={`M${padding + 10} ${y} L${padding + graphWidth + 10} ${y}`}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              );
            })}

            {/* Bars */}
            {expenseData.map((item, index) => {
              const barHeight = chartHeight - padding - getLogY(item.value);
              const x = padding + index * (graphWidth / expenseData.length) + 0;
              const y = getLogY(item.value);
              const isSpike = item.month === 'Apr';
              const barWidth = graphWidth / expenseData.length - 8;

              return (
                <Rect
                  key={index}
                  x={x + 8}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isSpike ? '#FCEFEE' : '#E5DFFC'}
                  rx={2}
                />
              );
            })}

            {/* Red line on top of spike bar */}
            {expenseData.map((item, index) => {
              const x = padding + index * (graphWidth / expenseData.length) + 8;
              const y = getLogY(item.value);
              const barWidth = graphWidth / expenseData.length - 8;
              const lineColor = item.month === 'Apr' ? '#F56359' : '#5627F1'; // red vs light gray

              return (
                <Path
                  key={`top-line-${index}`}
                  d={`M${x} ${y} L${x + barWidth} ${y}`}
                  stroke={lineColor}
                  strokeWidth="2"
                />
              );
            })}

            {/* X-axis labels */}
            {expenseData.map((item, index) => {
              const x =
                padding +
                index * (graphWidth / expenseData.length) +
                graphWidth / expenseData.length / 2;
              return (
                <SvgText
                  key={index}
                  x={x}
                  y={chartHeight - 5}
                  fontSize="10"
                  fill="#6B7280"
                  textAnchor="middle">
                  {item.month}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </View>
    );
  };

  const renderReceivablesRisk = () => {
    const size = 100;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const days30Angle = (receivablesData['0-30 Days'] / 100) * 360;
    const days60Angle = (receivablesData['31-60 Days'] / 100) * 360;
    const days90Angle = (receivablesData['61+ Days'] / 100) * 360;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{marginBottom:8}}>
          <Text style={styles.cardTitle}>Receivables Risk</Text>
          </View>
        </View>
        <View style={styles.receivablesContainer}>
          <View style={styles.donutContainer}>
            <Svg width={size} height={size}>
              {/* 0-30 Days (Green) */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#10B981"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${
                  (days30Angle / 360) * circumference
                } ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              {/* 31-60 Days (Blue) */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#0EA5E9"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${
                  (days60Angle / 360) * circumference
                } ${circumference}`}
                strokeDashoffset={-((days30Angle / 360) * circumference)}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              {/* 61+ Days (Orange) */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E76E50"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${
                  (days90Angle / 360) * circumference
                } ${circumference}`}
                strokeDashoffset={
                  -(((days30Angle + days60Angle) / 360) * circumference)
                }
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              {/* Center Text */}
              <SvgText
                x={size / 2}
                y={size / 2 + 5}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fill="#1F2937">
                Receivables
              </SvgText>
              <SvgText
                x={size / 2}
                y={size / 2 + 20}
                fontSize="10"
                textAnchor="middle"
                fill="#6B7280">
                Risk
              </SvgText>
            </Svg>
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#10B981'}]} />
              <View style={styles.legendRow}>
                <Text style={styles.legendText}>0–30 Days</Text>
                <Text style={[styles.legendValue]}>
                  {receivablesData['0-30 Days']}%
                </Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#0EA5E9'}]} />
              <View style={styles.legendRow}>
                <Text style={styles.legendText}>31–60 Days</Text>
                <Text style={[styles.legendValue]}>
                  {receivablesData['31-60 Days']}%
                </Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#E76E50'}]} />
              <View style={styles.legendRow}>
                <Text style={styles.legendText}>61+ Days</Text>
                <Text style={[styles.legendValue]}>
                  {receivablesData['61+ Days']}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTopSuppliers = () => {
    return (
      <View style={styles.card1}>
        <View style={styles.cardHeader}>
          <View style={{marginBottom:8}}>
          <Text style={styles.cardTitle}>Top 3 suppliers</Text>
          </View>
        </View>
        {topSuppliers.map((supplier, index) => (
          <View key={index} style={styles.supplierItem}>
            <Text style={styles.supplierName}>{supplier.name}</Text>
            <Text style={styles.supplierPercentage}>
              {supplier.percentage}% of spend
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <Header
        title={'AI Insights'}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.filterItemContainer}>
              <View style={[styles.filterItem, styles.lockedFilter]}>
                <Feather name="calendar" size={16} color="#9CA3AF" style={{marginRight: 1}} />
                <Text style={styles.filterLabel}>FY {selectedFY?.name || '2025-26'}</Text>
               
              </View>
            </View>
            <Text style={styles.updateTime}>Updated 10 Jul 25 10:41</Text>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <View style={styles.filterItemContainer}>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}>
                <Text style={styles.filterLabel}>{selectedPeriod}</Text>
                <Ionicons name={showPeriodDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
              </TouchableOpacity>

              {showPeriodDropdown && (
                <View style={styles.dropdownContainer}>
                  {periodOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        index === periodOptions.length - 1 && styles.lastDropdownItem,
                      ]}
                      onPress={() => handlePeriodSelect(option)}>
                      <Text style={[
                        styles.dropdownText,
                        selectedPeriod === option && styles.dropdownTextSelected,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.filterItemContainer}>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setShowSensitivityDropdown(!showSensitivityDropdown)}>
                <Text style={styles.filterLabel}>{selectedSensitivity}</Text>
                <Ionicons name={showSensitivityDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
              </TouchableOpacity>

              {showSensitivityDropdown && (
                <View style={styles.dropdownContainer}>
                  {sensitivityOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        index === sensitivityOptions.length - 1 && styles.lastDropdownItem,
                      ]}
                      onPress={() => handleSensitivitySelect(option)}>
                      <Text style={[
                        styles.dropdownText,
                        selectedSensitivity === option && styles.dropdownTextSelected,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {renderRevenueForecast()}
         
          {renderCashFlowProjection()}

          {renderStockOutRisk()}

          {renderExpenseSpikeAlert()}

          {renderReceivablesRisk()}

          {renderTopSuppliers()}

          <View style={{height: 20}} />
        </ScrollView>
      </View>
      <CustomBottomButton buttonText="Share PDF" buttonColor="#07624C" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
    zIndex: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    zIndex: 5,
  },
  filterItemContainer: {
    position: 'relative',
    zIndex: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  lockedFilter: {
    backgroundColor: '#fff',
  },
  filterLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 12,
    color: '#6F7C97',
    fontWeight: '400',
  },
  dropdownTextSelected: {
    color: '#6F7C97',
    fontWeight: '500',
    fontSize: 12,
  },
  updateTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  card1: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  forecastSummary: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tooltipText: {
    color: '#111',
    fontSize: 12,
    fontWeight: '500',
  },
  cashFlowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cashFlowLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  cashFlowValue: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  riskLeft: {
    flex: 1,
  },
  riskItemCode: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  riskItemText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
    marginRight: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  alertText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  receivablesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donutContainer: {
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  legendText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  legendValue: {
    fontWeight: '500',
    color: '#111',
  },
  supplierItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  supplierName: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '500',
  },
  supplierPercentage: {
    fontSize: 12,
    color: '#111',
    fontWeight: '500',
  },
});

export default AIInsights;
