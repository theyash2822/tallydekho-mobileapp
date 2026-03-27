import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';
import apiService from '../../services/api/apiService';
import {Logger} from '../../services/utils/logger';
import {useAuth} from '../../hooks/useAuth';

const StockMetricCard = ({
  IconComponent,
  featherIcon,
  title,
  data,
  onPress,
  iconWidth = 28,
  iconHeight = 28,
  isLoading = false,
  shimmerData = null,
  ShimmerComponent = null,
}) => {
  const renderData = () => {
    if (isLoading && ShimmerComponent) {
      // Show shimmer only for data values
      if (Array.isArray(shimmerData)) {
        return (
          <View style={styles.dataRow}>
            {shimmerData.map((line, idx) => (
              <ShimmerComponent
                key={idx}
                style={{
                  width: idx === 0 ? 80 : 100,
                  height: 12,
                  borderRadius: 6,
                  marginBottom: 2,
                }}
                shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
              />
            ))}
          </View>
        );
      } else {
        return (
          <ShimmerComponent
            style={{
              width: 50,
              height: 12,
              borderRadius: 6,
            }}
            shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
          />
        );
      }
    }

    // Show actual data when not loading
    return Array.isArray(data) ? (
      <View style={styles.dataRow}>
        {data.map((line, idx) => (
          <Text key={idx} style={styles.metricData}>
            {line}
          </Text>
        ))}
      </View>
    ) : (
      <Text style={styles.metricData}>{data}</Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.metricCard}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}>
      <View style={styles.iconContainer}>
        {IconComponent ? (
          <IconComponent width={iconWidth} height={iconHeight} />
        ) : featherIcon ? (
          <Feather name={featherIcon} size={iconWidth} color="#07624C" />
        ) : null}
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricTitle}>{title}</Text>
        {renderData()}
      </View>
    </TouchableOpacity>
  );
};

const StockOverview = () => {
  const navigation = useNavigation();
  const {selectedGuid} = useAuth();

  const [summary, setSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const Shimmer = React.useMemo(
    () => createShimmerPlaceholder(LinearGradient),
    [],
  );

  React.useEffect(() => {
    if (!selectedGuid) {
      setSummary(null);
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setSummary(null);
        const res = await apiService.fetchStockSummary(selectedGuid);
        setSummary(res?.data?.summary || null);
      } catch (error) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedGuid]);

  const metrics = [
    {
      Icon: Icons.Box,
      title: 'Total Stock',
      data: [
        `QTY: ${summary?.actualQty ?? '--'}`,
        `Value: ₹${summary?.amount ?? '--'}`,
      ],
      route: 'totalStock',
      isLoading: loading,
      shimmerData: ['QTY: --', 'Value: ₹--'],
    },
    {
      Icon: Icons.Home2,
      title: 'Warehouses',
      data: [
        `Total: ${summary?.warehouses?.length ?? '--'}`,
        `Utilization: --%`,
      ],
      onPress: () =>
        navigation.navigate('warehousesList', {
          totalWarehouses: summary?.warehouses?.length ?? undefined,
        }),
      iconWidth: 26,
      iconHeight: 26,
      isLoading: loading,
      shimmerData: ['Total: --', 'Utilization: --%'],
    },
    {
      Icon: Icons.LowStock,
      title: 'Low-Stock Items',
      data: summary?.lowStockCount ?? '--',
      route: 'reorderQueue',
      isLoading: loading,
      shimmerData: '--',
    },
    {
      Icon: Icons.Inventory,
      title: 'Aged Inventory',
      data: ['--', '-- days'],
      route: 'agingItems',
      isLoading: loading,
      shimmerData: ['--', '-- days'],
    },
    {
      Icon: Icons.FastMoving,
      title: 'Fast-Moving Items',
      data: summary?.fastMovingCount ?? '--',
      route: 'movementAnalytics',
      isLoading: loading,
      shimmerData: '--',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <StockMetricCard
            key={idx}
            IconComponent={m.Icon}
            title={m.title}
            data={m.data}
            iconWidth={m.iconWidth}
            iconHeight={m.iconHeight}
            isLoading={m.isLoading}
            shimmerData={m.shimmerData}
            ShimmerComponent={Shimmer}
            onPress={
              m.onPress
                ? m.onPress
                : m.route
                ? () => navigation.navigate(m.route)
                : null
            }
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  metricsGrid: {gap: 8},
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricContent: {flex: 1},
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  metricData: {fontSize: 12, color: '#666', lineHeight: 16, marginBottom: 2},
  dataRow: {flexDirection: 'row', justifyContent: 'space-between'},
});

export default StockOverview;
