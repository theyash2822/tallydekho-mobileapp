import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BalanceIndicator from './CircularProgress';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';
import {ensureCurrencyPrefix} from '../../utils/formatUtils';

/**
 * NetCashCard - Displays net cash information with circular progress and metrics
 * @param {Object} data - JSON data object from API (optional, will use defaults if not provided)
 * @param {Object} data.netCash - Net cash information for circular indicator
 * @param {number} data.netCash.progress - Progress percentage (0-100)
 * @param {string} data.netCash.amount - Amount to display
 * @param {string} data.netCash.updatedTime - Time since last update
 * @param {Array} data.metrics - Array of metric objects
 * @param {string} data.metrics[].label - Metric label
 * @param {string} data.metrics[].value - Metric value
 */
const NetCashCard = ({data = null}) => {
  const navigation = useNavigation();

  // Default data structure (fallback when API data is not available)
  // Example JSON structure for testing - you can modify these values to test
  const defaultData = {
    netCash: {
      x: 20830,        // Current value (part of y) - modify this to test
      y: 27000,        // Total value (larger value) - modify this to test
      amount: '20,830', // Formatted display amount
      updatedTime: '5 minutes',
      // progress: 77,  // Optional: Direct progress percentage (0-100). If provided, will override x/y calculation
    },
    metrics: [
      {
        label: 'Gross Cash',
        value: '606.21',
      },
      {
        label: 'Net Realisable Balance',
        value: '20.021',
      },
      {
        label: 'Gross Profit',
        value: '470.999',
      },
      {
        label: 'Net Profit',
        value: '130.999',
      },
    ],
  };

  // Always show component with defaults if data is not available
  const cashflowData = data || defaultData;

  // Extract metrics from data with fallback to empty array
  const metrics = cashflowData?.metrics ?? [];

  // Render metrics in grid (2x2 layout)
  // Always render - show empty state if no metrics
  const renderMetrics = () => {
    if (!metrics || metrics.length === 0) {
      return (
        <View style={styles.balanceGrid}>
          <View style={styles.gridRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>No data available</Text>
              <Text style={styles.metricValue}>--</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>No data available</Text>
              <Text style={styles.metricValue}>--</Text>
            </View>
          </View>
        </View>
      );
    }

    // Split metrics into rows of 2
    const rows = [];
    for (let i = 0; i < metrics.length; i += 2) {
      rows.push(metrics.slice(i, i + 2));
    }

    return (
      <View style={styles.balanceGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label || ''}</Text>
                <Text style={styles.metricValue}>
                  {ensureCurrencyPrefix(metric.value)}
                </Text>
              </View>
            ))}
            {/* Fill empty space if odd number of metrics */}
            {row.length === 1 && <View style={styles.metricCard} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icons.CashFlow height={28} width={28} />
        </View>
        <Text style={styles.headerText}>Cashflow</Text>
      </View>

      <View style={styles.balanceContainer}>
        <BalanceIndicator data={cashflowData} />
      </View>

      {/* Balance Indicator Grid */}
      {renderMetrics()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  // New styles for balance indicator grid
  balanceGrid: {
    marginTop: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
});

export default NetCashCard;
