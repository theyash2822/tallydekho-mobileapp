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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import Svg, {Circle, Path, Rect, Text as SvgText} from 'react-native-svg';
import CustomBottomButton from '../../../common/BottomButton';
import {SwipeableCards} from '../../../common';

const ComplianceEWayBill = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Mock data
  const summaryData = {
    pendingGen: 33,
    errors: 9,
    expiring: '<24h 12',
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

  const transportationData = [
    {mode: 'Road', count: 240},
    {mode: 'Rail', count: 20},
    {mode: 'Air', count: 38},
    {mode: 'Sea', count: 0},
  ];

  const recentActivity = [
    {action: '14 bills generated', time: '10 Jul 14:42'},
    {action: '9 bills extended', time: '10 Jul 14:42'},
    {action: '1 bill cancelled', time: '10 Jul 14:42'},
  ];

  const Cards = [
    {
      id: 'sales-today',
      title: 'Pending Gen',
      value: '33',
    },
    {
      id: 'sales-week',
      title: 'Errors',
      value: '9',
    },
    {
      id: 'sales-month',
      title: 'Expiring',
      value: '<24h 12',
    },
    {
      id: 'sales-pending',
      title: 'Generated',
      value: '265',
    },
  ];

  const handleCardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };

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
        <Text style={styles.chartTitle}>
          Bills generated per day (Aug 1-31)
        </Text>
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
        title={'E-Way Bill'}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.white} /> */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Filters */}
          {/* <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>FY 2025-26</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mode</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
          </View> */}

          {/* Summary Cards */}
          <View
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.border,
            }}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pending Gen</Text>
                <Text style={styles.summaryValue}>
                  {summaryData.pendingGen}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Errors</Text>
                <Text style={styles.summaryValue}>{summaryData.errors}</Text>
              </View>
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Expiring</Text>
                <Text style={styles.summaryValue}>{summaryData.expiring}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Generated</Text>
                <Text style={styles.summaryValue}>{summaryData.generated}</Text>
              </View>
            </View>
            {/* <View style={{marginBottom: 10}}>
              <SwipeableCards cards={Cards} onCardPress={handleCardPress} />
            </View> */}

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

            <View style={styles.transportationGrid}>
              {transportationData.map((item, index) => (
                <View key={index} style={styles.transportationItem}>
                  <Text style={styles.transportationMode}>{item.mode}</Text>
                  <Text style={styles.transportationCount}>{item.count}</Text>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <View style={[styles.card, {marginTop: 10}]}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityText}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
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
        onPress={() => navigation.navigate('EWayBillList')}
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
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
  filterLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
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
    marginBottom: 12,
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
    borderRadius: 4,
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
    marginTop: 2,
    alignItems: 'center',
    marginLeft: 20,
  },
  scrollTrack: {
    width: 250,
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
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 12,
  },
  transportationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  transportationItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transportationMode: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  transportationCount: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  activityTime: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
});

export default ComplianceEWayBill;
