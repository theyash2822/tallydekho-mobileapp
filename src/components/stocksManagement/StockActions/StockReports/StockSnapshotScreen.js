import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import {CustomBottomButton} from '../../../common';
import CustomCalendar from '../../../common/Calender';
import { Icons } from '../../../../utils/Icons';

const StockSnapshotScreen = ({navigation}) => {
  const [selectedView, setSelectedView] = useState('Average');
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [shouldCloseCalendar, setShouldCloseCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // This structure matches what you would receive from API
  const stockTables = [
    {
      id: 1,
      // title: 'Primary Warehouses',
      grandTotal: '65.80 L',
      data: [
        {
          id: 1,
          warehouse: 'Jaipur - Main Depot',
          value: '32.10 L',
          percentage: '48%',
        },
        {
          id: 2,
          warehouse: 'Delhi Depot',
          value: '22.30 L',
          percentage: '33%',
        },
        {
          id: 3,
          warehouse: 'Mumbai Satellite',
          value: '11.60 L',
          percentage: '19%',
        },
      ],
    },
    {
      id: 2,
      // title: 'Secondary Warehouses',
      grandTotal: '81.00 L',
      data: [
        {
          id: 1,
          warehouse: 'Chennai Warehouse',
          value: '28.50 L',
          percentage: '35%',
        },
        {
          id: 2,
          warehouse: 'Pune Distribution',
          value: '24.20 L',
          percentage: '30%',
        },
        {
          id: 3,
          warehouse: 'Hyderabad Center',
          value: '18.80 L',
          percentage: '23%',
        },
        {
          id: 4,
          warehouse: 'Kolkata Hub',
          value: '9.50 L',
          percentage: '12%',
        },
      ],
    },
  ];
  
  const viewOptions = ['Average', 'Opening', 'Closing', 'Peak'];

  const handleViewSelect = (view) => {
    setSelectedView(view);
    setShowViewDropdown(false);
  };

  const handleCalendarOpen = () => {
    // Close view dropdown when calendar opens
    setShowViewDropdown(false);
    setShouldCloseCalendar(false);
  };

  const handleViewDropdownToggle = () => {
    // Close calendar when view dropdown opens
    if (!showViewDropdown) {
      setShouldCloseCalendar(true);
    }
    setShowViewDropdown(!showViewDropdown);
  };

  // Reset shouldCloseCalendar after a brief delay to allow it to be used again
  useEffect(() => {
    if (shouldCloseCalendar) {
      const timer = setTimeout(() => {
        setShouldCloseCalendar(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldCloseCalendar]);

  const handleDateSelect = (startDate, endDate) => {
    // Handle date selection logic here
    // You can fetch new data from API based on date range
    setDateRange({startDate, endDate});
    // Fetch data with new date range
  };

  // When fetching from API, you can use:
  // const [stockTables, setStockTables] = useState([]);
  // useEffect(() => {
  //   fetchStockData().then(data => setStockTables(data));
  // }, [dateRange, selectedView]);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={[styles.headerCell, styles.serialCell]}>
        <Text style={styles.headerText}>#</Text>
      </View>
      <View style={[styles.headerCell, styles.warehouseCell]}>
        <Text style={styles.headerText}>Warehouse</Text>
      </View>
      <View style={[styles.headerCell, styles.valueCell]}>
        <Text style={styles.headerText}>Value (₹)</Text>
      </View>
      <View style={[styles.headerCell, styles.percentageCell]}>
        <Text style={styles.headerText}>% Portfolio</Text>
      </View>
    </View>
  );

  const renderTableRow = (item, index) => (
    <View key={item.id} style={styles.tableRow}>
      <View style={[styles.cell, styles.serialCell]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>
      <View style={[styles.cell, styles.warehouseCell]}>
        <Text style={styles.cellText}>{item.warehouse}</Text>
      </View>
      <View style={[styles.cell, styles.valueCell]}>
        <Text style={[styles.cellText, styles.valueText]}>{item.value}</Text>
      </View>
      <View style={[styles.cell, styles.percentageCell]}>
        <Text style={[styles.cellText, styles.percentageText]}>
          {item.percentage}
        </Text>
      </View>
    </View>
  );

  const renderGrandTotal = (totalValue) => (
    <View style={styles.grandTotalRow}>
      <View style={[styles.cell, styles.grandTotalCell, styles.serialCell]}>
        <Text style={styles.grandTotalText}>-</Text>
      </View>
      <View style={[styles.cell, styles.grandTotalCell, styles.warehouseCell]}>
        <Text style={styles.grandTotalText}>Grand Total</Text>
      </View>
      <View style={[styles.cell, styles.grandTotalCell, styles.valueCell]}>
        <Text style={[styles.grandTotalText, styles.valueText]}>
          {totalValue}
        </Text>
      </View>
      <View style={[styles.cell, styles.grandTotalCell, styles.percentageCell]}>
        <Text style={[styles.grandTotalText, styles.percentageText]}>100%</Text>
      </View>
    </View>
  );

  const renderTable = (data, total, tableTitle) => (
    <View style={styles.tableWrapper}>
      {tableTitle && <Text style={styles.tableTitle}>{tableTitle}</Text>}
      <View style={styles.tableContainer}>
        {renderTableHeader()}
        <ScrollView
          style={styles.tableScrollView}
          showsVerticalScrollIndicator={false}>
          {data.map((item, index) => renderTableRow(item, index))}
        </ScrollView>
        {renderGrandTotal(total)}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Custom Header */}
        <Header
          title="Stock Snapshot"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        {/* Filter Dropdowns */}
        <View style={styles.filterContainer}>
          <View style={styles.filterButton}>
            <CustomCalendar
              label="Today"
              onApply={handleDateSelect}
              onOpen={handleCalendarOpen}
              shouldClose={shouldCloseCalendar}
              style={{paddingHorizontal: 0, paddingVertical: 0}}
              containerStyle={{backgroundColor: 'transparent', borderRadius: 0, paddingHorizontal: 0}}
            />
          </View>

          <View style={styles.viewDropdownWrapper}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={handleViewDropdownToggle}>
              {/* <Feather name="refresh -cw" size={16} color="#8F939E" /> */}
              <Icons.Average height={20} width={20}/>
              <Text style={styles.filterText}>{selectedView}</Text>
              <Feather name={showViewDropdown ? "chevron-up" : "chevron-down"} size={20} color="#898E9A" />
            </TouchableOpacity>

            {showViewDropdown && (
              <View style={styles.viewDropdownOptions}>
                {viewOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.viewDropdownOption,
                      selectedView === option && styles.selectedViewOption,
                      index === viewOptions.length - 1 && styles.lastViewOption,
                    ]}
                    onPress={() => handleViewSelect(option)}>
                    <Text
                      style={[
                        styles.viewDropdownOptionText,
                        selectedView === option && styles.selectedViewOptionText,
                      ]}>
                      {option}
                    </Text>
                    {selectedView === option && (
                      <Ionicons name="checkmark" size={16} color="#10B981" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Stock Tables */}
        <ScrollView
          style={styles.tablesScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tablesContentContainer}>
          {stockTables.map((table) => (
            <View key={table.id}>
              {renderTable(table.data, table.grandTotal, table.title)}
            </View>
          ))}
        </ScrollView>
      </View>
      <CustomBottomButton buttonText="Share" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
    justifyContent: 'space-between',
    height: 41,
    marginLeft: 12,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  viewDropdownWrapper: {
    position: 'relative',
  },
  viewDropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    minWidth: 140,
    overflow: 'hidden',
    zIndex: 20,
  },
  viewDropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastViewOption: {
    borderBottomWidth: 0,
  },
  selectedViewOption: {
    backgroundColor: '#F9FAFB',
  },
  viewDropdownOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  selectedViewOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
  tablesScrollView: {
    flex: 1,
  },
  tablesContentContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  tableWrapper: {
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tableScrollView: {
    maxHeight: 300,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F9',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  serialCell: {
    flex: 0.5,
    alignItems: 'flex-start',
  },
  warehouseCell: {
    flex: 5,
    alignItems: 'flex-start',
  },
  valueCell: {
    flex: 2,
    alignItems: 'flex-end',
  },
  percentageCell: {
    flex: 2.5,
    alignItems: 'center',
    borderRightWidth: 0,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cellText: {
    fontSize: 12,
    color: '#494D58',
  },
  valueText: {
    fontWeight: '400',
  },
  percentageText: {
    fontWeight: '400',
  },
  grandTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#F7F9FC',
  },
  grandTotalCell: {
    borderBottomWidth: 0,
  },
  grandTotalText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
});

export default StockSnapshotScreen;
