import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {STOCK_MANAGEMENT_SCREENS} from './FilterConstants';

const StockManagementFilters = ({screenKey, screenFilters, onFilterChange}) => {
  const renderFilter = () => {
    switch(screenKey) {
      case 'stockLedger':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            <View style={styles.dateRangeRow}>
              <TextInput
                style={styles.dateInput}
                placeholder="From Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.startDate || ''}
                onChangeText={(text) => onFilterChange('stockLedger', 'dateRange', {startDate: text, endDate: screenFilters.dateRange?.endDate || ''})}
              />
              <Text style={styles.dateSeparator}>To</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="To Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.endDate || ''}
                onChangeText={(text) => onFilterChange('stockLedger', 'dateRange', {startDate: screenFilters.dateRange?.startDate || '', endDate: text})}
              />
            </View>
            
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouses"
              placeholderTextColor="#64748B"
            />
            
            <Text style={styles.filterSectionTitle}>Item/SKU</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Search Product"
              placeholderTextColor="#64748B"
              value={screenFilters.itemSku || ''}
              onChangeText={(text) => onFilterChange('stockLedger', 'itemSku', text)}
            />
            
            <Text style={styles.filterSectionTitle}>Batch/Serial</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Search Product"
              placeholderTextColor="#64748B"
              value={screenFilters.batchSerial || ''}
              onChangeText={(text) => onFilterChange('stockLedger', 'batchSerial', text)}
            />
            
            <Text style={styles.filterSectionTitle}>Txn Type</Text>
            {['Sales', 'Purchase', 'Transfer', 'Adjustment', 'Other'].map(txnType => {
              const isSelected = (screenFilters.txnTypes || []).includes(txnType);
              return (
                <TouchableOpacity
                  key={txnType}
                  style={styles.checkboxRow}
                  onPress={() => {
                    const current = screenFilters.txnTypes || [];
                    const updated = isSelected
                      ? current.filter(t => t !== txnType)
                      : [...current, txnType];
                    onFilterChange('stockLedger', 'txnTypes', updated);
                  }}>
                  <View style={[styles.smallCheckbox, isSelected && styles.smallCheckboxChecked]}>
                    {isSelected && <Feather name="check" size={12} color="#FFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{txnType}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
        
      case 'valuationSummary':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            <View style={styles.dateRangeRow}>
              <TextInput
                style={styles.dateInput}
                placeholder="From Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.startDate || ''}
                onChangeText={(text) => onFilterChange('valuationSummary', 'dateRange', {startDate: text, endDate: screenFilters.dateRange?.endDate || ''})}
              />
              <Text style={styles.dateSeparator}>To</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="To Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.endDate || ''}
                onChangeText={(text) => onFilterChange('valuationSummary', 'dateRange', {startDate: screenFilters.dateRange?.startDate || '', endDate: text})}
              />
            </View>
            
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouse"
              placeholderTextColor="#64748B"
            />
            
            <Text style={styles.filterSectionTitle}>Costing</Text>
            {['FIFO', 'Arange'].map(costing => {
              const isSelected = screenFilters.costing === costing.toLowerCase();
              return (
                <TouchableOpacity
                  key={costing}
                  style={styles.radioRow}
                  onPress={() => onFilterChange('valuationSummary', 'costing', costing.toLowerCase())}>
                  <View style={[styles.smallRadio, isSelected && styles.smallRadioSelected]}>
                    {isSelected && <View style={styles.smallRadioInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{costing}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
        
      case 'expirySchedule':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouses"
              placeholderTextColor="#64748B"
            />
            
            <Text style={styles.filterSectionTitle}>Item Group</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select Item Group"
              placeholderTextColor="#64748B"
              value={screenFilters.itemGroup || ''}
              onChangeText={(text) => onFilterChange('expirySchedule', 'itemGroup', text)}
            />
          </View>
        );
        
      case 'fastSlowMoving':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Period</Text>
            <View style={styles.periodSelector}>
              {['30D', '90D', 'Custom'].map(period => (
                <TouchableOpacity
                  key={period}
                  style={[styles.periodButton, screenFilters.period === period && styles.periodButtonSelected]}
                  onPress={() => onFilterChange('fastSlowMoving', 'period', period)}>
                  <Text style={[styles.periodButtonText, screenFilters.period === period && styles.periodButtonTextSelected]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {screenFilters.period === 'Custom' && (
              <TextInput
                style={styles.textInput}
                placeholder="Custom day"
                placeholderTextColor="#64748B"
                value={screenFilters.customDay || ''}
                onChangeText={(text) => onFilterChange('fastSlowMoving', 'customDay', text)}
              />
            )}
            
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouse"
              placeholderTextColor="#64748B"
            />
            
            <Text style={styles.filterSectionTitle}>Category</Text>
            {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports & Outdoors'].map(category => {
              const categoryKey = category.toLowerCase().replace(' & ', '').replace(' ', '');
              const isSelected = screenFilters.category === categoryKey;
              return (
                <TouchableOpacity
                  key={category}
                  style={styles.radioRow}
                  onPress={() => onFilterChange('fastSlowMoving', 'category', categoryKey)}>
                  <View style={[styles.smallRadio, isSelected && styles.smallRadioSelected]}>
                    {isSelected && <View style={styles.smallRadioInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{category}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
        
      case 'transferHistory':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            <View style={styles.dateRangeRow}>
              <TextInput
                style={styles.dateInput}
                placeholder="From Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.startDate || ''}
                onChangeText={(text) => onFilterChange('transferHistory', 'dateRange', {startDate: text, endDate: screenFilters.dateRange?.endDate || ''})}
              />
              <Text style={styles.dateSeparator}>To</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="To Date"
                placeholderTextColor="#64748B"
                value={screenFilters.dateRange?.endDate || ''}
                onChangeText={(text) => onFilterChange('transferHistory', 'dateRange', {startDate: screenFilters.dateRange?.startDate || '', endDate: text})}
              />
            </View>
            
            <Text style={styles.filterSectionTitle}>Source WH</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select Category"
              placeholderTextColor="#64748B"
              value={screenFilters.sourceWarehouse || ''}
              onChangeText={(text) => onFilterChange('transferHistory', 'sourceWarehouse', text)}
            />
            
            <Text style={styles.filterSectionTitle}>Destination WH</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select Category"
              placeholderTextColor="#64748B"
              value={screenFilters.destinationWarehouse || ''}
              onChangeText={(text) => onFilterChange('transferHistory', 'destinationWarehouse', text)}
            />
            
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.statusChipsRow}>
              {['Draft', 'In Transit', 'Received', 'Cancelled'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusChip, screenFilters.status === status && styles.statusChipSelected]}
                  onPress={() => onFilterChange('transferHistory', 'status', status)}>
                  <Text style={[styles.statusChipText, screenFilters.status === status && styles.statusChipTextSelected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'stockSnapshot':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>As-of Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select date"
              placeholderTextColor="#64748B"
              value={screenFilters.asOfDate || ''}
              onChangeText={(text) => onFilterChange('stockSnapshot', 'asOfDate', text)}
            />
            
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouses"
              placeholderTextColor="#64748B"
            />
          </View>
        );
        
      case 'negativeStock':
        return (
          <View>
            <Text style={styles.filterSectionTitle}>Warehouse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select warehouses"
              placeholderTextColor="#64748B"
            />
          </View>
        );
        
      default:
        return (
          <View>
            <Text style={styles.filterPlaceholder}>No filters available</Text>
          </View>
        );
    }
  };

  const screenLabel = STOCK_MANAGEMENT_SCREENS.find(s => s.key === screenKey)?.label || '';

  return (
    <View>
      <Text style={styles.screenTitle}>{screenLabel}</Text>
      {renderFilter()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 16,
    marginBottom: 8,
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#E2E8F0',
  },
  dateSeparator: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  smallCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallCheckboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#E2E8F0',
    flex: 1,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  smallRadio: {
    width: 20,
    height: 20,
    borderWidth: 2.5,
    borderColor: '#475569',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallRadioSelected: {
    borderColor: '#3B82F6',
  },
  smallRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  periodButtonSelected: {
    backgroundColor: '#1E293B',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
  },
  periodButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusChipSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  statusChipText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '400',
  },
  statusChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});

export default StockManagementFilters;

