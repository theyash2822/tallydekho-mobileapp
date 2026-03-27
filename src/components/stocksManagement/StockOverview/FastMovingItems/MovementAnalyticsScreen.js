import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, Rect } from 'react-native-svg';
import * as d3 from 'd3-shape';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import { Icons } from '../../../../utils/Icons';

const { width } = Dimensions.get('window');

const MovementAnalyticsScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, tr, dsi, price
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  const dataList = [
    {
      id: '1',
      name: 'Black JBL',
      code: 'PRD-1002-ABC',
      tr: 0.75,
      dsi: 23,
      price: 1300,
      date: '25 Jun',
      chartData: [25, 32, 28, 41, 38, 47, 43, 51, 48, 55, 52, 58],
      dates: [
        '23 Jun',
        '24 Jun',
        '25 Jun',
        '26 Jun',
        '27 Jun',
        '28 Jun',
        '29 Jun',
        '30 Jun',
        '1 Jul',
        '2 Jul',
        '3 Jul',
        '4 Jul',
      ],
    },
    {
      id: '2',
      name: 'White JBL',
      code: 'PRD-1003-XYZ',
      tr: 0.92,
      dsi: 18,
      price: 1300,
      date: '26 Jun',
      chartData: [80, 95, 88, 102, 98, 115, 108, 122, 118, 130, 125, 135],
      dates: [
        '23 Jun',
        '24 Jun',
        '25 Jun',
        '26 Jun',
        '27 Jun',
        '28 Jun',
        '29 Jun',
        '30 Jun',
        '1 Jul',
        '2 Jul',
        '3 Jul',
        '4 Jul',
      ],
    },
    {
      id: '3',
      name: 'Red JBL',
      code: 'PRD-1004-DEF',
      tr: 0.68,
      dsi: 31,
      price: 700,
      date: '24 Jun',
      chartData: [65, 72, 68, 75, 71, 78, 74, 81, 77, 84, 80, 87],
      dates: [
        '23 Jun',
        '24 Jun',
        '25 Jun',
        '26 Jun',
        '27 Jun',
        '28 Jun',
        '29 Jun',
        '30 Jun',
        '1 Jul',
        '2 Jul',
        '3 Jul',
        '4 Jul',
      ],
    },
  ];

  // Enhanced filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = dataList;

    // Filter by search
    if (search.trim()) {
      filtered = dataList.filter(
        item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.code.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sort data
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'tr':
          aValue = a.tr;
          bValue = b.tr;
          break;
        case 'dsi':
          aValue = a.dsi;
          bValue = b.dsi;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [search, sortBy, sortOrder]);

  // Enhanced Chart Component with better performance and features
  const Chart = React.memo(({ data, dates }) => {
    const chartHeight = 120;
    const chartWidth = width - 120;
    const maxY = Math.max(...data);
    const minY = Math.min(...data);

    // Better scaling - handle edge cases
    const padding = 10;
    const adjustedMax = maxY + (maxY - minY) * 0.1 || maxY + padding;
    const adjustedMin = Math.max(0, minY - (maxY - minY) * 0.1);
    const range = adjustedMax - adjustedMin || 1;

    const yScale = useCallback(
      value => chartHeight - ((value - adjustedMin) / range) * chartHeight,
      [adjustedMin, range],
    );

    const xScale = useCallback(
      index => (index / Math.max(data.length - 1, 1)) * chartWidth,
      [data.length],
    );

    const [selectedIndex, setSelectedIndex] = useState(data.length - 1);
    const [isInteracting, setIsInteracting] = useState(false);

    // Improved line path with better curve
    const path = useMemo(() => {
      if (data.length < 2) return '';

      return d3
        .line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5))(data);
    }, [data, xScale, yScale]);

    // Enhanced pan responder with better touch handling
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: evt => {
          setIsInteracting(true);
          const touchX = Math.max(
            0,
            Math.min(evt.nativeEvent.locationX - 40, chartWidth),
          );
          const index = Math.round((touchX / chartWidth) * (data.length - 1));
          setSelectedIndex(Math.max(0, Math.min(index, data.length - 1)));
        },
        onPanResponderMove: evt => {
          const touchX = Math.max(
            0,
            Math.min(evt.nativeEvent.locationX - 40, chartWidth),
          );
          const index = Math.round((touchX / chartWidth) * (data.length - 1));
          setSelectedIndex(Math.max(0, Math.min(index, data.length - 1)));
        },
        onPanResponderRelease: () => {
          setIsInteracting(false);
        },
      }),
    ).current;

    // Calculate price change
    const currentPrice = data[selectedIndex] || data[data.length - 1];
    const previousPrice = selectedIndex > 0 ? data[selectedIndex - 1] : data[0];
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent =
      previousPrice !== 0
        ? ((priceChange / previousPrice) * 100).toFixed(1)
        : 0;

    // Y-axis labels with better distribution
    const yAxisLabels = useMemo(() => {
      const steps = 5;
      return Array.from({ length: steps }, (_, i) => {
        const value =
          adjustedMax - (i / (steps - 1)) * (adjustedMax - adjustedMin);
        return Math.round(value);
      });
    }, [adjustedMax, adjustedMin]);

    // X-axis labels - show fewer for cleaner look
    const xAxisLabels = useMemo(() => {
      const maxLabels = 4;
      const step = Math.ceil(dates.length / maxLabels);
      return dates.filter(
        (_, index) => index % step === 0 || index === dates.length - 1,
      );
    }, [dates]);

    return (
      <View style={{ marginTop: 0 }} {...panResponder.panHandlers}>
        {/* Price info header */}
        <View style={styles.chartHeader}>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>₹{currentPrice}</Text>
            {/* <Text
              style={[
                styles.priceChange,
                {color: priceChange >= 0 ? '#16C47F' : '#FF4444'},
              ]}>
              {priceChange >= 0 ? '+' : ''}₹{Math.abs(priceChange).toFixed(0)} (
              {priceChangePercent}%)
            </Text> */}
          </View>
          <Text style={styles.selectedDate}>{dates[selectedIndex]}</Text>
        </View>

        <Svg height={chartHeight + 60} width={chartWidth + 100}>
          {/* Grid lines for better readability */}
          {yAxisLabels.map((value, idx) => (
            <Line
              key={`grid-${idx}`}
              x1={40}
              y1={(idx / (yAxisLabels.length - 1)) * chartHeight + 15}
              x2={chartWidth + 40}
              y2={(idx / (yAxisLabels.length - 1)) * chartHeight + 15}
              stroke="#F0F0F0"
              strokeWidth={0.5}
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((value, idx) => (
            <SvgText
              key={`y-${idx}`}
              x={35}
              y={(idx / (yAxisLabels.length - 1)) * chartHeight + 20}
              fontSize="11"
              fill="#8F939E"
              textAnchor="end">
              {value}
            </SvgText>
          ))}

          {/* Chart line */}
          <Path
            d={path}
            fill="none"
            stroke="#Edc240"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(40, 15)`}
          />

          {/* Data points */}
          {data.map((value, index) => (
            <Circle
              key={`point-${index}`}
              cx={xScale(index) + 40}
              cy={yScale(value) + 15}
              r={index === selectedIndex ? 4 : 2}
              fill={index === selectedIndex ? '#333' : '#f4c430'}
              opacity={index === selectedIndex ? 1 : 0.6}
            />
          ))}

          {/* Interactive elements */}
          {isInteracting && (
            <>
              {/* Vertical indicator line */}
              <Line
                x1={xScale(selectedIndex) + 40}
                y1={15}
                x2={xScale(selectedIndex) + 40}
                y2={chartHeight + 15}
                stroke="#ccc"
                strokeDasharray={[4, 4]}
              />

              {/* Highlighted point */}
              <Circle
                cx={xScale(selectedIndex) + 40}
                cy={yScale(data[selectedIndex]) + 15}
                r={2}
                stroke="#000"
              />

              {/* Tooltip */}
              <Rect
                x={xScale(selectedIndex) + 15}
                y={yScale(data[selectedIndex]) - 10}
                width={50}
                height={20}
                rx={8}
                fill="#333"
                opacity={0.9}
              />
              <SvgText
                x={xScale(selectedIndex) + 40}
                y={yScale(data[selectedIndex]) + 5}
                fontSize="12"
                fill="white"
                textAnchor="middle"
                fontWeight="600">
                {data[selectedIndex]}
              </SvgText>
            </>
          )}
        </Svg>

        {/* X-axis labels */}
        <View style={styles.xAxisContainer}>
          {xAxisLabels.map((label, idx) => (
            <Text key={idx} style={styles.xAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    );
  });

  // Sort handler
  // const handleSort = field => {
  //   if (sortBy === field) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortBy(field);
  //     setSortOrder('asc');
  //   }
  // };

  // Enhanced card render with better performance
  const renderCard = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.icon}>
            {/* <Feather name="box" size={20} color="#16C47F" /> */}
            <Icons.Box height={28} width={28}/>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>{item.code}</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() =>
              Alert.alert('Favorite', `Added ${item.name} to favorites`)
            }>
            <Feather name="heart" size={18} color="#8F939E" />
          </TouchableOpacity> */}
        </View>

        {/* Enhanced Metrics with better visualization */}
        <View style={styles.metrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>TR (Turnover Ratio)</Text>
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>{item.tr}</Text>
              {/* <View
                style={[
                  styles.metricIndicator,
                  {
                    backgroundColor:
                      item.tr >= 0.8
                        ? '#16C47F'
                        : item.tr >= 0.5
                        ? '#FFA500'
                        : '#FF4444',
                  },
                ]}
              /> */}
            </View>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>DSI (Days Sales of...)</Text>
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>{item.dsi}</Text>
              {/* <View
                style={[
                  styles.metricIndicator,
                  {
                    backgroundColor:
                      item.dsi <= 30
                        ? '#16C47F'
                        : item.dsi <= 45
                        ? '#FFA500'
                        : '#FF4444',
                  },
                ]}
              /> */}
            </View>
          </View>
        </View>

        {/* Chart */}
        <Chart data={item.chartData} dates={item.dates} />

        {/* Additional actions */}
        {/* <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert('Export', `Exporting data for ${item.name}`)
            }>
            <Feather name="download" size={16} color="#666" />
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert('Details', `Showing details for ${item.name}`)
            }>
            <Feather name="eye" size={16} color="#666" />
            <Text style={styles.actionButtonText}>Details</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Movement Analytics"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Enhanced Search with filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch('')}>
              <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort options */}
        {/* <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'name' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('name')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.sortButtonTextActive,
              ]}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'tr' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('tr')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'tr' && styles.sortButtonTextActive,
              ]}>
              TR {sortBy === 'tr' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'dsi' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('dsi')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'dsi' && styles.sortButtonTextActive,
              ]}>
              DSI {sortBy === 'dsi' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Results summary */}
      {/* <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Showing {filteredAndSortedData.length} of {dataList.length} products
        </Text>
      </View> */}

      {/* Enhanced List with better performance */}
      <FlatList
        data={filteredAndSortedData}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={false}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 400,
          offset: 400 * index,
          index,
        })}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search terms
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    minHeight: Platform.OS === 'ios' ? 50 : undefined,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 4,
  },
  sortButtonActive: {
    backgroundColor: '#16C47F',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#067240',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  code: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricItem: {
    flexDirection: 'row',
    gap: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F939E',
    letterSpacing: 0.3,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  metricIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceInfo: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  selectedDate: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default MovementAnalyticsScreen;
