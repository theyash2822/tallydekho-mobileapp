import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Icons} from '../../../../utils/Icons';
import Colors from '../../../../utils/Colors';

const reports = [
  {
    id: '1',
    label: 'Stock Ledger',
    icon: Icons.StockLedgerIcon,
    screen: 'stockLedger',
  },
  {
    id: '2',
    label: 'Valuation Summary',
    icon: Icons.ValuationSummaryIcon,
    screen: 'valuationSummary',
  },
  {
    id: '3',
    label: 'Expiry Schedule',
    icon: Icons.ExpiryScheduleIcon,
    screen: 'expirySchedule',
  },
  {
    id: '4',
    label: 'Fast- vs Slow-Moving Analysis',
    icon: Icons.FastvsSlowIcon,
    screen: 'fastandSlowMoving',
  },
  {
    id: '5',
    label: 'Transfer History',
    icon: Icons.TransferHistoryIcon,
    screen: 'TransferHistoryScreen',
  },
  {
    id: '6',
    label: 'Stock Snapshot (as-of date)',
    icon: Icons.StockSnapshotIcon,
    screen: 'stockSnapshot',
  },
  {
    id: '7',
    label: 'Negative Stock Exceptions',
    icon: Icons.NegativeStockExceptionIcon,
    screen: 'negativeStockExceptions',
  },
];

const ReportCard = ({label, icon: Icon, onPress}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
    <View style={styles.iconCircle}>
      <Icon width={20} height={20} />
    </View>
    <Text style={styles.label}>{label}</Text>
    <Feather name="chevron-right" size={22} color="#9ca3af" />
  </TouchableOpacity>
);

const ReportBody = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report manager</Text>
      <FlatList
        data={reports}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ReportCard
            label={item.label}
            icon={item.icon}
            onPress={() => navigation.navigate(item.screen)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  header: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 21,
    backgroundColor: '#ECEFF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  separator: {
    height: 8,
  },
});

export default ReportBody;
