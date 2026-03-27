import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import {useFilters} from '../../contexts/FilterContext';
import FilterSidebar from './FilterSidebar';
import FilterContent from './FilterContent';
import FilterFooter from './FilterFooter';
import {INITIAL_STOCK_FILTERS} from './FilterConstants';
import Colors from '../../utils/Colors';

const {width, height} = Dimensions.get('window');

const FilterDrawer = ({visible, onClose, slideDirection = 'bottom', customFilters = null, onApply = null}) => {
  // slideDirection can be 'bottom' (default), 'left', or 'right'
  const isLeftSlide = slideDirection === 'left';
  const isRightSlide = slideDirection === 'right';
  const isHorizontalSlide = isLeftSlide || isRightSlide;
  
  // For left: start at -width (off-screen left), slide to 0
  // For right: start at width (off-screen right), slide to 0
  // For bottom: start at height (off-screen bottom), slide to 0
  const getInitialSlideValue = () => {
    if (isLeftSlide) return -width;
    if (isRightSlide) return width;
    return height;
  };
  const slideAnim = useRef(new Animated.Value(getInitialSlideValue())).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {
    filters,
    updateFilter,
    updateFilterCategory,
    resetFilters,
  } = useFilters();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (customFilters) {
      return Object.keys(customFilters)[0] || 'transactionTypes';
    }
    return 'transactionTypes';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockScreen, setSelectedStockScreen] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [stockFilters, setStockFilters] = useState(INITIAL_STOCK_FILTERS);
  const prevVisibleRef = useRef(false);
  
  const filterCategories = useMemo(() => {
    if (customFilters) {
      // Use custom filters if provided
      return Object.keys(customFilters).map(key => {
        const filter = customFilters[key];
        let count = 0;
        
        // Count based on filter type
        if (filter.type === 'dateRange') {
          count = (filter.value?.startDate || filter.value?.endDate) ? 1 : 0;
        } else if (filter.type === 'textInput') {
          count = filter.value ? 1 : 0;
        } else if (filter.type === 'radio') {
          // For radio buttons, show 0 count (single selection)
          count = 0;
        } else if (filter.type === 'checkbox') {
          // For checkboxes, show count of selected items
          count = Array.isArray(filter.selected) ? filter.selected.length : 0;
        } else if (filter.selected) {
          // Default: if selected is an array, show its length
          count = Array.isArray(filter.selected) ? filter.selected.length : 0;
        }
        
        return {
          key,
          label: filter.label,
          count,
        };
      });
    }
    // Default filters
    return [
      {key: 'transactionTypes', label: 'Transaction Type', count: Object.values(filters.transactionTypes).filter(Boolean).length},
      {key: 'status', label: 'Status', count: Object.values(filters.status).filter(Boolean).length},
      {key: 'paymentMode', label: 'Payment Mode', count: Object.values(filters.paymentMode).filter(Boolean).length},
      {key: 'partyType', label: 'Party Type', count: Object.values(filters.partyType).filter(Boolean).length},
      {key: 'gstStatus', label: 'GST Status', count: Object.values(filters.gstStatus).filter(Boolean).length},
      {key: 'voucherStatus', label: 'Voucher Status', count: Object.values(filters.voucherStatus).filter(Boolean).length},
      {key: 'amountRange', label: 'Amount Range', count: (filters.amountRange.min || filters.amountRange.max) ? 1 : 0},
      {key: 'sort', label: 'Sort By', count: 0},
      {key: 'stockManagement', label: 'Stock Management', count: 0},
    ];
  }, [filters, customFilters]);

  // Reset search and stock screen when category changes
  useEffect(() => {
    setSearchQuery('');
    setSelectedStockScreen(null);
  }, [selectedCategory]);

  // Set first category only when drawer first opens (not when filters change)
  useEffect(() => {
    if (visible && !prevVisibleRef.current && customFilters) {
      const firstCategory = Object.keys(customFilters)[0];
      if (firstCategory) {
        setSelectedCategory(firstCategory);
      }
    }
    prevVisibleRef.current = visible;
  }, [visible, customFilters]);

  // Handle keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleClose = useCallback(() => {
    const getCloseValue = () => {
      if (isLeftSlide) return -width;
      if (isRightSlide) return width;
      return height;
    };
    const closeValue = getCloseValue();
    Animated.timing(slideAnim, {
      toValue: closeValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, slideAnim, height, width, isLeftSlide, isRightSlide]);

  const handleApply = useCallback(() => {
    // Call onApply callback if provided (for custom filters)
    if (onApply) {
      onApply();
    }
    handleClose();
  }, [handleClose, onApply]);

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Handle stock filter changes
  const handleStockFilterChange = useCallback((screenKey, filterKey, value) => {
    setStockFilters(prev => {
      const screenFilter = prev[screenKey] || {};
      if (filterKey === 'dateRange') {
        return {
          ...prev,
          [screenKey]: {...screenFilter, dateRange: value}
        };
      }
      return {
        ...prev,
        [screenKey]: {...screenFilter, [filterKey]: value}
      };
    });
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryKey) => {
    setSelectedCategory(categoryKey);
    setSelectedStockScreen(null);
  }, []);

  useEffect(() => {
    const getInitialValue = () => {
      if (isLeftSlide) return -width;
      if (isRightSlide) return width;
      return height;
    };
    const getCloseValue = () => {
      if (isLeftSlide) return -width;
      if (isRightSlide) return width;
      return height;
    };
    const initialValue = getInitialValue();
    const closeValue = getCloseValue();
    
    if (visible) {
      // Set modal visible immediately
      setIsModalVisible(true);
      // Reset animation values
      slideAnim.setValue(initialValue);
      fadeAnim.setValue(0);
      
      // Start animation after a brief delay to ensure Modal is mounted
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 65,
            friction: 11,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else if (isModalVisible && !visible) {
      // Close animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: closeValue,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
      });
    }
  }, [visible, slideAnim, fadeAnim, height, width, isModalVisible, isLeftSlide, isRightSlide]);

  return (
    <Modal
      visible={visible || isModalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <Animated.View
        style={[
          styles.overlay,
          isLeftSlide && styles.overlayLeft,
          isRightSlide && styles.overlayRight,
          {
            opacity: fadeAnim,
          },
        ]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            isLeftSlide ? styles.drawerLeft : isRightSlide ? styles.drawerRight : styles.drawerBottom,
            {
              transform: isHorizontalSlide 
                ? [{translateX: slideAnim}] 
                : [{translateY: slideAnim}],
            },
          ]}>
            
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter</Text>
          </View>

          {/* Two Column Layout */}
          <View style={styles.twoColumnLayout}>
            <FilterSidebar
              categories={filterCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            <FilterContent
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStockScreen={selectedStockScreen}
              setSelectedStockScreen={setSelectedStockScreen}
              filters={filters}
              updateFilter={updateFilter}
              updateFilterCategory={updateFilterCategory}
              stockFilters={stockFilters}
              onStockFilterChange={handleStockFilterChange}
              customFilters={customFilters}
            />
          </View>

          <FilterFooter
            onCancel={handleClose}
            onApply={handleApply}
            onReset={handleReset}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  overlayLeft: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  overlayRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#1E293B',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  drawerBottom: {
    width: width,
    height: height * 0.92,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  drawerLeft: {
    width: width * 1,
    height: height,
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  drawerRight: {
    width: width * 0.85,
    height: height,
    position: 'absolute',
    right: 0,
    top: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  twoColumnLayout: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default FilterDrawer;

