import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomCalendar from '../common/Calender';
import Colors from '../../utils/Colors';

const FilterBar = ({
  selectedFilter,
  setSelectedFilter,
  selectedPeriod,
  setSelectedPeriod,
  filters = ['Period', 'Overdue', 'Receipts'],
}) => {
  return (
    <View style={styles.filterBar}>
      <View style={styles.filterItemContainer}>
        <View style={styles.filterButton}>
          <CustomCalendar
            label={selectedPeriod}
            style={{paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent'}}
            containerStyle={{backgroundColor: 'transparent', borderRadius: 0, paddingHorizontal: 0}}
            width="auto"
            onDateRangeChange={({startDate, endDate}) => {
              console.log(
                'Calendar callback - startDate:',
                startDate,
                'endDate:',
                endDate,
              );

              if (startDate && endDate) {
                // Date range selection - convert to "YYYY-MM-DD to YYYY-MM-DD" format
                setSelectedPeriod(`${startDate} to ${endDate}`);
              } else if (startDate && !endDate) {
                // Single date selection - keep "YYYY-MM-DD" format (DateFilterHelper expects this)
                setSelectedPeriod(startDate);
              } else if (!startDate && !endDate) {
                // Reset to default when both dates are null (cancel pressed)
                setSelectedPeriod('Period');
              }
            }}
          />
        </View>
      </View>

      {filters.includes('Overdue') && (
        <View style={styles.filterItemContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'Overdue' && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter('Overdue')}>
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'Overdue' && styles.activeFilterButtonText,
              ]}>
              Overdue
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {filters.includes('Receipts') && (
        <View style={styles.filterItemContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'Receipts' && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter('Receipts')}>
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'Receipts' && styles.activeFilterButtonText,
              ]}>
              Receipts
            </Text>
            {/* <Feather name="chevron-down" size={16} color={Colors.secondaryText} /> */}
          </TouchableOpacity>
        </View>
      )}

      {filters.includes('Payments') && (
        <View style={styles.filterItemContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'Payments' && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter('Payments')}>
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'Payments' && styles.activeFilterButtonText,
              ]}>
              Payments
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  filterItemContainer: {
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    justifyContent: 'space-between',
    height: 41,
  },
  activeFilterButton: {
    borderColor: Colors.border,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  activeFilterButtonText: {
    color: '#111',
  },
});

export default FilterBar;
