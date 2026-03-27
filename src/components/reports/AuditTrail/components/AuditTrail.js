import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { Icons } from '../../../../utils/Icons';
import {useAuth} from '../../../../hooks/useAuth';

const AuditTrail = () => {
  const navigation = useNavigation();
  const {selectedFY} = useAuth(); // Get FY from global state
  const scrollViewRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Dropdown states - FY dropdown is now locked
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Period');

  // Dropdown options
  const periodOptions = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];

  // Handler
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  // Mock data
  const summaryData = {
    edited: 117,
    deleted: 8,
    netDr: '₹42 K',
    netCr: '₹72.4 M',
    vouchersCreated: 265,
  };

  const dailyData = [
    {day: '7 Apr', value: 45},
    {day: '8 Apr', value: 67},
    {day: '9 Apr', value: 23},
    {day: '10 Apr', value: 89},
    {day: '11 Apr', value: 34},
    {day: '12 Apr', value: 56},
    {day: '13 Apr', value: 78},
    {day: '14 Apr', value: 12},
    {day: '15 Apr', value: 90},
    {day: '16 Apr', value: 45},
    {day: '17 Apr', value: 67},
    {day: '18 Apr', value: 23},
    {day: '19 Apr', value: 89},
    {day: '20 Apr', value: 34},
    {day: '21 Apr', value: 56},
    {day: '22 Apr', value: 78},
    {day: '23 Apr', value: 12},
    {day: '24 Apr', value: 90},
    {day: '25 Apr', value: 45},
    {day: '26 Apr', value: 67},
    {day: '27 Apr', value: 23},
    {day: '28 Apr', value: 89},
    {day: '29 Apr', value: 34},
    {day: '30 Apr', value: 56},
    {day: '1 May', value: 78},
    {day: '2 May', value: 12},
    {day: '3 May', value: 90},
    {day: '4 May', value: 45},
    {day: '5 May', value: 67},
    {day: '6 May', value: 23},
  ];

  const latestEntries = [
    {
      reference: 'PV-2098',
      description: 'Payment - HDFC → Rent',
      date: '07 May',
      amount: 'Cr ₹75,000',
      type: 'payment',
    },
    {
      reference: 'RV-2099',
      description: 'Receipt - ICICI → Sales',
      date: '07 May',
      amount: 'Dr ₹45,000',
      type: 'receipt',
    },
    {
      reference: 'JV-2100',
      description: 'Journal - Office Expenses',
      date: '07 May',
      amount: 'Dr ₹12,500',
      type: 'journal',
    },
  ];

  const renderBarChart = () => {
    const maxValue = 100; // Fixed max value
    const chartHeight = 120;
    const barWidth = 20;
    const spacing = 12;
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = dailyData.length * (barWidth + spacing) + 40;
    const visibleWidth = screenWidth - 48;
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
        <Text style={styles.chartTitle}>Entries Chart (30 days)</Text>
        <View style={{flexDirection: 'row'}}>
          <Svg width={30} height={chartHeight + 40}>
            <SvgText x={10} y={15} fontSize="10" fill="#6B7280">1k</SvgText>
            <SvgText x={10} y={45} fontSize="10" fill="#6B7280">500</SvgText>
            <SvgText x={10} y={75} fontSize="10" fill="#6B7280">100</SvgText>
            <SvgText x={10} y={105} fontSize="10" fill="#6B7280">50</SvgText>
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
        title={'Audit Trail'}
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
                <Text style={styles.summaryLabel}>Edited</Text>
                <Text style={styles.summaryValue}>{summaryData.edited}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Deleted</Text>
                <Text style={styles.summaryValue}>{summaryData.deleted}</Text>
              </View>
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Net Dr</Text>
                <Text style={styles.summaryValue}>{summaryData.netDr}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Net Cr</Text>
                <Text style={styles.summaryValue}>{summaryData.netCr}</Text>
              </View>
            </View>

            {/* Vouchers Created Button */}
            <TouchableOpacity style={styles.generatedButton}>
              <Text style={styles.generatedButtonText}>
                Vouchers Created {summaryData.vouchersCreated}
              </Text>
            </TouchableOpacity>

            {/* Bar Chart */}
            <View style={[styles.card, {marginBottom: 0}]}>
              {renderBarChart()}
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text style={styles.sectionTitle}>Latest Entries</Text>
          </View>
          {latestEntries.map((entry, index) => (
            <View key={index} style={styles.entryItem}>
              {/* Reference number at top left */}
              <Text style={styles.entryReference}>{entry.reference}</Text>

              {/* Main content area */}
              <View style={styles.entryMainContent}>
                <View style={styles.entryLeft}>
                  <View style={styles.entryIconContainer}>
                  <Icons.DollarCard height={22} width={22}/>
                    {/* <Ionicons name={'document'} size={20} color={'#6F7C97'} /> */}
                  </View>
                  <View style={styles.entryDetails}>
                    <Text style={styles.entryDescription}>
                      {entry.description}
                    </Text>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                </View>
                <View style={styles.entryRight}>
                  <Text style={styles.entryAmount}>{entry.amount}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Bottom spacing to prevent content from sticking to buttons */}
          <View style={{height: 10}} />
        </ScrollView>
      </View>
      <CustomBottomButton
        buttonText="View Day Book"
        onPress={() => navigation.navigate('daybook')}
        showSecondButton
        secondButtonText="Export .csv"
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
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
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 12,
  },
  entryItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  entryMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryDetails: {
    flex: 1,
    gap: 2,
  },
  entryReference: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  entryRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  entryDate: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  entryAmount: {
    fontSize: 14,
    color: '#494D58',
    fontWeight: '500',
  },
});

export default AuditTrail;
