import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const DispatchSummary = ({dispatchItems = []}) => {
  // Calculate totals from dispatch items
  const calculations = useMemo(() => {
    let totalItems = 0;
    let totalQuantity = 0;

    dispatchItems.forEach(item => {
      totalItems += 1;
      const qty = parseFloat(item.quantity?.replace(/[^\d.]/g, '') || 0);
      totalQuantity += qty;
    });

    return {
      totalItems,
      totalQuantity,
    };
  }, [dispatchItems]);

  const hasData = dispatchItems.length > 0;

  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Summary</Text>
      </View>

      {/* Summary Details */}
      <View style={styles.detailsContainer}>
        <View style={{ backgroundColor:'#f6f8fa' , paddingHorizontal:8 ,borderRadius:8}}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Items</Text>
            <Text style={styles.value}>{hasData ? calculations.totalItems : 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Quantity</Text>
            <Text style={styles.value}>{hasData ? calculations.totalQuantity : 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius:8,
    backgroundColor: Colors.white,
    marginTop: 10,
  },
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.black,
  },
  detailsContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    color: '#8A8A8E',
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    color: '#16C47F',
  },
});

export default DispatchSummary;
