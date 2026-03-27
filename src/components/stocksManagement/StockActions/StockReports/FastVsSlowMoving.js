
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../common/Header';
import {FilterDrawer} from '../../../filterdrawer';
import Colors from '../../../../utils/Colors';
import GraphComponent from './GraphComponent';
import {useStockFilters} from '../../../../hooks/useStockFilters';

const FastVsSlowMovingScreen = () => {
  const navigation = useNavigation();
  // Use custom hook for stock filters
  const {warehouseOptions} = useStockFilters();
  const [selectedTab, setSelectedTab] = useState('fast');
  // Actual filter state (applied filters)
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30D');
  const [customDay, setCustomDay] = useState('');
  
  // Temporary filter state (for drawer - not applied until Apply is clicked)
  const [tempWarehouses, setTempWarehouses] = useState([]);
  const [tempCategory, setTempCategory] = useState([]);
  const [tempPeriod, setTempPeriod] = useState('30D');
  const [tempCustomDay, setTempCustomDay] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Category options
  const categoryOptions = [
    {id: 'electronics', name: 'Electronics'},
    {id: 'clothing', name: 'Clothing'},
    {id: 'books', name: 'Books'},
    {id: 'home', name: 'Home & Garden'},
    {id: 'sports', name: 'Sports & Outdoors'},
  ];

  const handleFilterPress = useCallback(() => {
    // Initialize temporary states with current applied filters
    setTempWarehouses([...selectedWarehouses]);
    setTempCategory([...selectedCategory]);
    setTempPeriod(selectedPeriod);
    setTempCustomDay(customDay);
    setShowFilterDrawer(true);
  }, [selectedWarehouses, selectedCategory, selectedPeriod, customDay]);

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

  // Category handlers (work with temporary state)
  const handleCategorySelect = useCallback((value) => {
    setTempCategory(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleCategoryDeselect = useCallback((value) => {
    setTempCategory(prev => prev.filter(c => c !== value));
  }, []);

  const handleCategoryDeselectAll = useCallback(() => {
    setTempCategory([]);
  }, []);

  // Period handlers (work with temporary state)
  const handlePeriodSelect = useCallback((value) => {
    setTempPeriod(value);
    if (value !== 'custom') {
      setTempCustomDay(''); // Clear custom day if not custom period
    }
  }, []);

  const handlePeriodDeselect = useCallback(() => {
    setTempPeriod('30D'); // Reset to default
    setTempCustomDay('');
  }, []);

  // Apply filters when Apply button is clicked
  const handleApplyFilters = useCallback(() => {
    setSelectedWarehouses([...tempWarehouses]);
    setSelectedCategory([...tempCategory]);
    setSelectedPeriod(tempPeriod);
    setCustomDay(tempCustomDay);
  }, [tempWarehouses, tempCategory, tempPeriod, tempCustomDay]);

  // Mock data for products
  const fastMovingProducts = [
    {
      id: 'PRD-1002-ABC',
      name: 'Black JBL',
      unitsSold: 3643,
      avgDaysToSell: 36,
      sales: 5000,
      currentOnHand: 63,
      turnoverRatio: 3.2,
    },
    {
      id: 'PRD-1003-DEF',
      name: 'White Sony',
      unitsSold: 2891,
      avgDaysToSell: 42,
      sales: 4200,
      currentOnHand: 45,
      turnoverRatio: 2.8,
    },
    {
      id: 'PRD-1004-GHI',
      name: 'Red Samsung',
      unitsSold: 2156,
      avgDaysToSell: 51,
      sales: 3800,
      currentOnHand: 38,
      turnoverRatio: 2.4,
    },
  ];

  const slowMovingProducts = [
    {
      id: 'PRD-2001-XYZ',
      name: 'Old Model Phone',
      unitsSold: 156,
      avgDaysToSell: 180,
      sales: 800,
      currentOnHand: 120,
      turnoverRatio: 0.3,
    },
    {
      id: 'PRD-2002-ABC',
      name: 'Outdated Laptop',
      unitsSold: 89,
      avgDaysToSell: 210,
      sales: 1200,
      currentOnHand: 85,
      turnoverRatio: 0.2,
    },
  ];


  const renderChart = () => {
    return <GraphComponent />;
  };

  const renderProductCard = product => (
    <View key={product.id} style={styles.productCard}>
      {/* Left: icon + basic info */}
      <View style={styles.productLeft}>
        <View style={styles.productIcon}>
          <Feather name="box" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productId}>{product.id}</Text>
        </View>
      </View>

      {/* Right: metrics (3 on left, 2 on right) */}
      <View style={styles.productRight}>
        <View style={styles.metricsMainContainer}>
          {/* Left column (3 labels) */}
          <View style={styles.metricsLeftColumn}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Units Sold</Text>
              <Text style={styles.metricValue}>{product.unitsSold}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Sales</Text>
              <Text style={styles.metricValue}>{product.sales}rs</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Turnover Ratio</Text>
              <Text style={styles.metricValue}>{product.turnoverRatio}x</Text>
            </View>
          </View>

          {/* Right column (2 labels) */}
          <View style={styles.metricsRightColumn}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Average Days to Sell</Text>
              <Text style={styles.metricValue}>{product.avgDaysToSell}D</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Current On-Hand</Text>
              <Text style={styles.metricValue}>{product.currentOnHand}pcs</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Header
        title={'Fast Vs Slow Moving Analysis'}
        leftIcon="chevron-left"
        onLeftPress={navigation.goBack}
        rightIcon={'filter'}
        rightIconType="Ionicons"
        onRightPress={handleFilterPress}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderChart()}

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedTab === 'fast' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedTab('fast')}>
              <Text
                style={[
                  styles.toggleText,
                  selectedTab === 'fast' && styles.toggleTextActive,
                ]}>
                Fast
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedTab === 'slow' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedTab('slow')}>
              <Text
                style={[
                  styles.toggleText,
                  selectedTab === 'slow' && styles.toggleTextActive,
                ]}>
                Slow
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productList}>
            {(selectedTab === 'fast'
              ? fastMovingProducts
              : slowMovingProducts
            ).map(renderProductCard)}
          </View>
        </ScrollView>
      </View>

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        slideDirection="left"
        customFilters={useMemo(() => {
          const filters = {
            period: {
              label: 'Period',
              options: [
                {key: '30D', label: '30D'},
                {key: '90D', label: '90D'},
                {key: 'custom', label: 'Custom'},
              ],
              selected: tempPeriod ? [tempPeriod] : [],
              onSelect: handlePeriodSelect,
              onDeselect: handlePeriodDeselect,
              onDeselectAll: handlePeriodDeselect,
              // Add custom input field below period options when 'custom' is selected
              customInput: tempPeriod === 'custom' ? {
                type: 'textInput',
                value: tempCustomDay,
                onChange: setTempCustomDay,
                placeholder: 'Enter custom day',
              } : null,
            },
            warehouse: {
              label: 'Warehouse',
              options: warehouseOptions.map(opt => ({key: opt.id, label: opt.name})),
              selected: tempWarehouses,
              onSelect: handleWarehouseSelect,
              onDeselect: handleWarehouseDeselect,
              onDeselectAll: handleWarehouseDeselectAll,
            },
            category: {
              label: 'Category',
              options: categoryOptions.map(opt => ({key: opt.id, label: opt.name})),
              selected: tempCategory,
              onSelect: handleCategorySelect,
              onDeselect: handleCategoryDeselect,
              onDeselectAll: handleCategoryDeselectAll,
            },
          };
          
          return filters;
        }, [tempPeriod, tempWarehouses, tempCategory, tempCustomDay, warehouseOptions, categoryOptions, handlePeriodSelect, handlePeriodDeselect, handleWarehouseSelect, handleWarehouseDeselect, handleWarehouseDeselectAll, handleCategorySelect, handleCategoryDeselect, handleCategoryDeselectAll])}
        onApply={handleApplyFilters}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    padding: 12,
  },
  content: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#F4F5FA',
    borderRadius: 8,
    padding: 6,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  toggleTextActive: {
    color: '#333',
  },
  productList: {
    paddingBottom: 10,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  /* --- Added minor layout helpers for product header & metrics --- */
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productRight: {
    // keeps metrics below the header section
  },

  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productId: {
    fontSize: 12,
    color: '#999',
  },

  /* --- Two-column metrics layout --- */
  metricsMainContainer: {
    flexDirection: 'row',
  },
  metricsLeftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  metricsRightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  metricRow: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default FastVsSlowMovingScreen;
