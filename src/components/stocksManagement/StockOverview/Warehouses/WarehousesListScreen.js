import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Svg, { Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import { useAuth } from '../../../../hooks/useAuth';
import apiService from '../../../../services/api/apiService';
import { Logger } from '../../../../services/utils/logger';
import { Icons } from '../../../../utils/Icons';

const WarehousesListScreen = () => {
  const navigation = useNavigation();
  const { selectedGuid } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const Shimmer = useMemo(() => createShimmerPlaceholder(LinearGradient), []);
  const route = useRoute();
  const expectedWarehouses = route?.params?.totalWarehouses;

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!selectedGuid) {
        setWarehouses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await apiService.fetchStockFilters(selectedGuid);
        const payload = res?.data || res;
        const list =
          payload?.warehouses ||
          payload?.data?.warehouses ||
          payload?.warehousesList ||
          [];
        if (Array.isArray(list)) {
          setWarehouses(list);
        } else {
          setWarehouses([]);
        }
      } catch (error) {
        Logger.error('Failed to fetch warehouses', error);
        setWarehouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, [selectedGuid]);

  // Filter warehouses based on search query
  const filteredWarehouses = warehouses.filter(warehouse => {
    const name = warehouse.name || warehouse.displayName || '';
    const location =
      warehouse.location || warehouse.address || warehouse.city || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Circular progress component
  const CircularProgress = ({ percentage, size = 100, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F4F4F4"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E76E50"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

  const renderWarehouseItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.warehouseCard}
      onPress={() => {
        navigation.navigate('warehouseDetails', { warehouse: item });
      }}
      activeOpacity={0.7}>
      {/* Top Row - Icon, Name, and Racks */}
      <View style={styles.topRow}>
        <View style={styles.warehouseIcon}>
          <Icons.Home2 height={26} width={26} />
          {/* <Feather name="home" size={20} color="#FFF" /> */}
        </View>
        <View style={styles.warehouseInfo}>
          <Text style={styles.warehouseName}>
            {item.name || item.displayName || 'Unnamed Warehouse'}
          </Text>
          <Text style={styles.warehouseLocation}>
            {item.location ||
              item.address ||
              item.city ||
              item.state ||
              'Location unavailable'}
          </Text>
        </View>
        <Text style={styles.racksText}>
          #Racks - {item.racks || item.rackCount || '--'}
        </Text>
      </View>

      {/* Center Circular Graph */}
      <View style={styles.centerGraph}>
        <View style={styles.progressCircleContainer}>
          <CircularProgress percentage={item.utilization ?? 0} />
          <Text style={styles.utilizationPercentage}>
            {item.utilization ?? 0}%
          </Text>
          <Text style={styles.utilizationLabel}>Utilisation</Text>
        </View>
      </View>
    </TouchableOpacity>
  ));

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No warehouses available.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Warehouses List"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.shimmerList}>
          {Array.from({
            length:
              typeof expectedWarehouses === 'number'
                ? Math.max(Math.min(expectedWarehouses, 3), 0)
                : 3,
          }).map((_, idx) => (
            <View key={`shimmer-warehouse-${idx}`} style={styles.warehouseCard}>
              <View style={styles.topRow}>
                <View style={styles.warehouseIcon}>
                  <Icons.Home2 height={26} width={26} />
                </View>

                <View style={styles.warehouseInfo}>
                  <Shimmer style={{ width: '70%', height: 16, borderRadius: 7 }} />
                  <Shimmer style={{ width: '40%', height: 14, borderRadius: 6 }} />
                </View>

                <Shimmer style={{ width: 60, height: 14, borderRadius: 6 }} />
              </View>

              <View style={styles.centerGraph}>
                <Shimmer style={{ width: 100, height: 100, borderRadius: 50 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header
        title="Warehouses List"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Search Bar */}
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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Warehouses List */}
      <FlatList
        data={filteredWarehouses}
        renderItem={renderWarehouseItem}
        keyExtractor={(item, index) =>
          item.id?.toString() ||
          item.guid?.toString() ||
          item.name ||
          `warehouse-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#333',
    ...(Platform.OS === 'ios' && {
      paddingVertical: 8,
    }),
  },
  clearButton: {
    padding: 4,
  },
  shimmerList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  warehouseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  warehouseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warehouseInfo: {
    flex: 1,
    justifyContent: 'space-between',
    height: 40,
  },
  warehouseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 0,
  },
  warehouseLocation: {
    fontSize: 12,
    color: '#666',
  },
  racksText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  centerGraph: {
    alignItems: 'center',
    marginTop: 12,
  },
  progressCircleContainer: {
    width: 100,
    height: 100,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  utilizationPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    top: '33%',
    zIndex: 1,
  },
  utilizationLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    position: 'absolute',
    bottom: '33%',
    zIndex: 1,
  },
});

export default WarehousesListScreen;
