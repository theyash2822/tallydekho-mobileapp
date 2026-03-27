import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import Svg, {Circle, Path, Rect, Text as SvgText} from 'react-native-svg';
import CustomBottomButton from '../../../common/BottomButton';
import {useAuth} from '../../../../hooks/useAuth';

const ComplianceEInvoicing = () => {
  const navigation = useNavigation();
  const {selectedFY} = useAuth(); // Get FY from global state
  const scrollViewRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Dropdown states - FY dropdown is now locked
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Period');

  // Dropdown options
  const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

  // Handler
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  // Mock data
  const summaryData = {
    pending: 33,
    error: 9,
    cancelled: 0,
    avgGenTime: '3.4s',
    generated: 265,
    total: 319,
  };

  const chartData = {
    generated: 74,
    pending: 11,
    errors: 3,
    expiring: 12,
  };

  const dailyData = [
    {day: '1 Aug', value: 70},
    {day: '2 Aug', value: 72},
    {day: '3 Aug', value: 15},
    {day: '4 Aug', value: 35},
    {day: '5 Aug', value: 22},
    {day: '6 Aug', value: 40},
    {day: '7 Aug', value: 20},
    {day: '8 Aug', value: 50},
    {day: '9 Aug', value: 50},
    {day: '10 Aug', value: 45},
    {day: '11 Aug', value: 38},
    {day: '12 Aug', value: 62},
    {day: '13 Aug', value: 28},
    {day: '14 Aug', value: 55},
    {day: '15 Aug', value: 33},
    {day: '16 Aug', value: 47},
    {day: '17 Aug', value: 41},
    {day: '18 Aug', value: 59},
    {day: '19 Aug', value: 36},
    {day: '20 Aug', value: 44},
    {day: '21 Aug', value: 51},
    {day: '22 Aug', value: 29},
    {day: '23 Aug', value: 63},
    {day: '24 Aug', value: 37},
    {day: '25 Aug', value: 48},
    {day: '26 Aug', value: 42},
    {day: '27 Aug', value: 56},
    {day: '28 Aug', value: 31},
    {day: '29 Aug', value: 53},
    {day: '30 Aug', value: 39},
    {day: '31 Aug', value: 46},
  ];

  const errorLeaderboard = [
    {rank: 1, error: 'Amount Mismatch', bills: 9},
    {rank: 2, error: 'GST Mismatch', bills: 5},
    {rank: 3, error: 'Name Mismatch', bills: 3},
  ];

  const recentActivity = [
    {action: '14 IRNs generated', time: '10 Jul 14:42'},
    {action: '9 IRNs retry (success 8)', time: '10 Jul 14:42'},
    {action: '9 IRNs Modified (success 3, Failed 6)', time: '10 Jul 14:42'},
  ];

  const renderDonutChart = () => {
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const generatedAngle = (chartData.generated / 100) * 360;
    const pendingAngle = (chartData.pending / 100) * 360;
    const errorsAngle = (chartData.errors / 100) * 360;
    const expiringAngle = (chartData.expiring / 100) * 360;

    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {/* Generated (Green) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10B981"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${
              (generatedAngle / 360) * circumference
            } ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Pending (Light Blue) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${
              (pendingAngle / 360) * circumference
            } ${circumference}`}
            strokeDashoffset={-((generatedAngle / 360) * circumference)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Errors (Orange) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${
              (errorsAngle / 360) * circumference
            } ${circumference}`}
            strokeDashoffset={
              -(((generatedAngle + pendingAngle) / 360) * circumference)
            }
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Expiring (Purple) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#8B5CF6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${
              (expiringAngle / 360) * circumference
            } ${circumference}`}
            strokeDashoffset={
              -(
                ((generatedAngle + pendingAngle + errorsAngle) / 360) *
                circumference
              )
            }
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Center Text */}
          <SvgText
            x={size / 2}
            y={size / 2 + 8}
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            fill="#1F2937">
            {summaryData.total}
          </SvgText>
        </Svg>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#10B981'}]} />
            <Text style={styles.legendText}>
              Generated {chartData.generated}%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#3B82F6'}]} />
            <Text style={styles.legendText}>Pending {chartData.pending}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#F59E0B'}]} />
            <Text style={styles.legendText}>Errors {chartData.errors}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#8B5CF6'}]} />
            <Text style={styles.legendText}>
              Expiring {chartData.expiring}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    const maxValue = 100; // Fixed max value to match the image
    const chartHeight = 120;
    const barWidth = 20;
    const spacing = 12; // Increased spacing between bars
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = dailyData.length * (barWidth + spacing) + 40; // Extra space for Y-axis labels
    const visibleWidth = screenWidth - 48; // Account for padding
    const maxScrollDistance = chartWidth - visibleWidth;

    const handleScroll = event => {
      const scrollX = event.nativeEvent.contentOffset.x;
      const progress = Math.max(0, Math.min(scrollX / maxScrollDistance, 1));
      setScrollProgress(progress);

      // Animate the width smoothly
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 50,
        useNativeDriver: false,
      }).start();
    };

    const barsOnlyWidth = dailyData.length * (barWidth + spacing) + spacing;

    return (
      <View style={styles.barChartContainer}>
        <Text style={styles.chartTitle}>Daily Trend Bars</Text>
        <View style={{flexDirection: 'row'}}>
          <Svg width={30} height={chartHeight + 40}>
            <SvgText x={10} y={15} fontSize="10" fill="#6B7280">100</SvgText>
            <SvgText x={10} y={45} fontSize="10" fill="#6B7280">75</SvgText>
            <SvgText x={10} y={75} fontSize="10" fill="#6B7280">50</SvgText>
            <SvgText x={10} y={105} fontSize="10" fill="#6B7280">25</SvgText>
            <SvgText x={10} y={135} fontSize="10" fill="#6B7280">0</SvgText>
          </Svg>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.chartScrollView, {flex: 1}]}
            contentContainerStyle={{width: barsOnlyWidth}}
            onScroll={handleScroll}
            scrollEventThrottle={8}
            decelerationRate="fast">
            <View style={styles.barChart}>
              <Svg width={barsOnlyWidth} height={chartHeight + 40}>
                {/* Grid lines */}
                <Path d={`M0 30 L${barsOnlyWidth} 30`} stroke="#E5E7EB" strokeWidth="1" />
                <Path d={`M0 60 L${barsOnlyWidth} 60`} stroke="#E5E7EB" strokeWidth="1" />
                <Path d={`M0 90 L${barsOnlyWidth} 90`} stroke="#E5E7EB" strokeWidth="1" />
                <Path d={`M0 120 L${barsOnlyWidth} 120`} stroke="#E5E7EB" strokeWidth="1" />

                {/* Bars */}
                {dailyData.map((item, index) => {
                  const barHeight = (item.value / maxValue) * chartHeight;
                  const x = index * (barWidth + spacing);
                  const y = chartHeight - barHeight;

                  return (
                    <React.Fragment key={index}>
                      <Rect x={x} y={y} width={barWidth} height={barHeight} fill="#E9D5FF" rx={2} />
                      <Path d={`M${x} ${y} L${x + barWidth} ${y}`} stroke="#8B5CF6" strokeWidth="2" />
                    </React.Fragment>
                  );
                })}

                {/* X-axis labels */}
                {dailyData.map((item, index) => (
                  <SvgText
                    key={index}
                    x={index * (barWidth + spacing) + barWidth / 2}
                    y={chartHeight + 25}
                    fontSize="9"
                    fill="#6B7280"
                    textAnchor="middle">
                    {item.day}
                  </SvgText>
                ))}
              </Svg>
            </View>
          </ScrollView>
        </View>

        {/* Scroll indicator */}
        <View style={styles.scrollIndicator}>
          <View style={styles.scrollTrack}>
            <Animated.View
              style={[
                styles.scrollThumb,
                {
                  width: animatedWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Header
        title={'E-Invoicing'}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.white} /> */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Filters */}
          <View style={styles.filterContainer}>
            <View style={styles.filterItemContainer}>
              {/* Read-only FY display - locked to Dashboard selection */}
              <View style={[styles.filterItem, styles.lockedFilter]}>
                <Feather name="calendar" size={16} color="#9CA3AF" style={{marginRight: 1}} />
                <Text style={styles.filterLabel}>FY {selectedFY?.name || '2025-26'}</Text>
              </View>
            </View>

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
          </View>

          {/* Summary Cards */}
          <View
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.border,
            }}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pending</Text>
                <Text style={styles.summaryValue}>{summaryData.pending}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Error</Text>
                <Text style={styles.summaryValue}>{summaryData.error}</Text>
              </View>
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Cancelled</Text>
                <Text style={styles.summaryValue}>{summaryData.cancelled}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Avg Gen-Time</Text>
                <Text style={styles.summaryValue}>
                  {summaryData.avgGenTime}
                </Text>
              </View>
            </View>
            <View style={{marginBottom: 16}}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Generated</Text>
                <Text style={styles.summaryValue}>{summaryData.generated}</Text>
              </View>
            </View>

            {/* Generated Button */}
            {/* <TouchableOpacity style={styles.generatedButton}>
              <Text style={styles.generatedButtonText}>
                Generated {summaryData.generated}
              </Text>
            </TouchableOpacity> */}

            {/* Donut Chart */}
            <View style={styles.card}>{renderDonutChart()}</View>

            {/* Bar Chart */}
            <View style={styles.card}>{renderBarChart()}</View>

            {/* Error Leaderboard */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Error leaderboard</Text>
              {errorLeaderboard.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.errorItem,
                    index === errorLeaderboard.length - 1 && {marginBottom: 0},
                  ]}>
                  <View style={styles.errorRank}>
                    <Text style={styles.errorText}>{item.rank}.</Text>
                    <Text style={styles.errorText}>{item.error}</Text>
                  </View>
                  <View style={styles.errorCount}>
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text style={styles.countText}>{item.bills} Bills</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {recentActivity.map((activity, index) => (
                <View
                  key={index}
                  style={[
                    styles.activityItem,
                    index === recentActivity.length - 1 && {marginBottom: 0},
                  ]}>
                  <Text style={styles.activityText}>{activity.action}</Text>
                  <Text style={styles.activityText}>{activity.time}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom spacing to prevent content from sticking to buttons */}
          <View style={{height: 20}} />
        </ScrollView>
      </View>
      <CustomBottomButton
        buttonText="View Details"
        // onPress={() => navigation.navigate('eInvoices')}
        onPress={() => navigation.navigate('EInvoicesList')}
        showSecondButton
        secondButtonText="Export"
        secondButtonColor="#F7F9FC"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    zIndex: 10,
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
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
  },
  generatedButton: {
    backgroundColor: '#07624C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  generatedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  barChartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  barChart: {
    alignItems: 'center',
  },
  chartScrollView: {
    maxHeight: 160,
  },
  scrollIndicator: {
    marginTop: 8,
    alignItems: 'center',
  },
  scrollTrack: {
    width: 150,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  scrollThumb: {
    height: 4,
    backgroundColor: '#10B981',
    borderRadius: 2,
    minWidth: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 12,
  },
  errorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorRank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '500',
  },
  errorCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityText: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '400',
  },
});

export default ComplianceEInvoicing;
