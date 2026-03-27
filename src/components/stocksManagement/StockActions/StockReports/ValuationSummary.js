import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PieChart} from 'react-native-svg-charts';
import {Circle, G, Text as SvgText} from 'react-native-svg';
import Header from '../../../common/Header';
import CustomBottomButton from '../../../common/BottomButton';
import {FilterDrawer} from '../../../filterdrawer';
import {useStockFilters} from '../../../../hooks/useStockFilters';

const warehouses = [
  {
    id: '1',
    name: 'Echo Depot',
    location: 'New Delhi, India',
    value: '₹66 L',
    skus: 1260,
    ratio: '58%',
    color: '#13A76D',
    percentage: 40,
  },
  {
    id: '2',
    name: 'Sierra Storage',
    location: 'New Delhi, India',
    value: '₹66 L',
    skus: 1260,
    ratio: '58%',
    color: '#3BC9DB',
    percentage: 30,
  },
  {
    id: '3',
    name: 'Delta Hub',
    location: 'New Delhi, India',
    value: '₹66 L',
    skus: 1260,
    ratio: '58%',
    color: '#5F3DC4',
    percentage: 20,
  },
  {
    id: '4',
    name: 'Zulu Center',
    location: 'New Delhi, India',
    value: '₹66 L',
    skus: 1260,
    ratio: '58%',
    color: '#FF6B6B',
    percentage: 10,
  },
];

const Labels = () => (
  <G>
    <SvgText
      x="90"
      y="90"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="12"
      fill="#6b7280"></SvgText>
  </G>
);

const ValuationSummary = () => {
  // Use custom hook for stock filters
  const {warehouseOptions} = useStockFilters();
  
  // Actual filter state (applied filters)
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectedCosting, setSelectedCosting] = useState('fifo');
  
  // Temporary filter state (for drawer - not applied until Apply is clicked)
  const [tempDateRange, setTempDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [tempWarehouses, setTempWarehouses] = useState([]);
  const [tempCosting, setTempCosting] = useState('fifo');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const handleFilterPress = useCallback(() => {
    // Initialize temporary states with current applied filters
    setTempDateRange(selectedDateRange);
    setTempWarehouses([...selectedWarehouses]);
    setTempCosting(selectedCosting);
    setShowFilterDrawer(true);
  }, [selectedDateRange, selectedWarehouses, selectedCosting]);

  // Warehouse handlers (work with temporary state)
  const handleWarehouseSelect = useCallback((value) => {
    setTempWarehouses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleWarehouseDeselect = useCallback((value) => {
    setTempWarehouses(prev => prev.filter(w => w !== value));
  }, []);

  const handleWarehouseDeselectAll = useCallback(() => {
    setTempWarehouses([]);
  }, []);

  // Costing handlers (work with temporary state)
  const handleCostingSelect = useCallback((value) => {
    setTempCosting(value);
  }, []);

  const handleCostingDeselect = useCallback(() => {
    setTempCosting('fifo'); // Reset to default
  }, []);

  // Apply filters when Apply button is clicked
  const handleApplyFilters = useCallback(() => {
    setSelectedDateRange({...tempDateRange});
    setSelectedWarehouses([...tempWarehouses]);
    setSelectedCosting(tempCosting);
  }, [tempDateRange, tempWarehouses, tempCosting]);

  return (
    <>
      <Header
        title={'Valuation Summary'}
        leftIcon="chevron-left"
        rightIconType="Ionicons"
        rightIcon="filter"
        onRightPress={handleFilterPress}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Placeholder for Pie Chart */}
        <View style={styles.chartContainer}>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <PieChart
              style={{height: 180, width: 180}}
              outerRadius={'95%'}
              innerRadius={'70%'}
              data={warehouses.map((item, index) => ({
                key: index,
                value: item.percentage,
                svg: {fill: item.color},
              }))}>
              {/* Center text */}
              <Labels />
            </PieChart>
          </View>

          {warehouses.map(item => (
            <View key={item.id} style={styles.legendRow}>
              <View style={[styles.colorDot, {backgroundColor: item.color}]} />
              <Text style={styles.legendText}>{item.name}</Text>
              <Text style={styles.legendValue}>₹670,000</Text>
            </View>
          ))}
        </View>

        {/* Cards List */}
        <FlatList
          data={warehouses}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 10}}
          scrollEnabled={false}
          removeClippedSubviews={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <View
                  style={[styles.iconContainer, {backgroundColor: item.color}]}>
                  <Icon name="warehouse" size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>{item.location}</Text>
                </View>
                <Text style={styles.value}>{item.value}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>SKUs</Text>
                <Text style={styles.metaText}>{item.skus}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Ratio</Text>
                <Text style={styles.metaText}>{item.ratio}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <CustomBottomButton buttonText="Share" />

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        slideDirection="left"
        customFilters={useMemo(() => {
          return {
            dateRange: {
              label: 'Date Range',
              type: 'dateRange',
              value: tempDateRange,
              onChange: setTempDateRange,
            },
            warehouse: {
              label: 'Warehouse',
              options: warehouseOptions.map(opt => ({key: opt.id, label: opt.name})),
              selected: tempWarehouses,
              onSelect: handleWarehouseSelect,
              onDeselect: handleWarehouseDeselect,
              onDeselectAll: handleWarehouseDeselectAll,
            },
            costing: {
              label: 'Costing',
              options: [
                {key: 'fifo', label: 'FIFO'},
                {key: 'arange', label: 'Arange'},
              ],
              selected: tempCosting ? [tempCosting] : [],
              onSelect: handleCostingSelect,
              onDeselect: handleCostingDeselect,
              onDeselectAll: handleCostingDeselect,
            },
          };
        }, [tempDateRange, tempWarehouses, tempCosting, warehouseOptions, handleWarehouseSelect, handleWarehouseDeselect, handleWarehouseDeselectAll, handleCostingSelect, handleCostingDeselect])}
        onApply={handleApplyFilters}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#F6F8FA',
    flex: 1,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6C757D',
  },
  value: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#495057',
  },
});

export default ValuationSummary;
