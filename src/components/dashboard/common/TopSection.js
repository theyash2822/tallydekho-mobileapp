import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { FinancialMetricsSection } from '../../financial';
import Colors from '../../../utils/Colors';
import CustomCalendar from '../../common/Calender';

const TopSection = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedStatus,
  setSelectedStatus,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [shouldCloseCalendar, setShouldCloseCalendar] = useState(false);

  const handleStatusDropdownToggle = () => {
    if (!showStatusDropdown) {
      // Opening status dropdown, close calendar
      setShouldCloseCalendar(true);
      setTimeout(() => setShouldCloseCalendar(false), 100);
    }
    setShowStatusDropdown(!showStatusDropdown);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowStatusDropdown(false)}>
      <View style={styles.topSection}>
        <View style={styles.filterSection}>
          <View style={styles.filterButton}>
            <CustomCalendar
              label="Period"
              style={{ paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent' }}
              containerStyle={{ backgroundColor: 'transparent', borderRadius: 0, paddingHorizontal: 0 }}
              width="auto"
              onOpen={() => setShowStatusDropdown(false)}
              shouldClose={shouldCloseCalendar}
              onDateRangeChange={({ startDate, endDate }) => {

                if (startDate && endDate) {
                  // Date range selection
                  setSelectedPeriod(`${startDate} to ${endDate}`);
                } else if (startDate && !endDate) {
                  // Single date selection
                  setSelectedPeriod(startDate);
                } else if (!startDate && !endDate) {
                  // Reset to empty when both dates are null (cancel pressed) - shows all data
                  setSelectedPeriod('');
                }
              }}
            />
          </View>

          <View style={styles.statusFilterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleStatusDropdownToggle}>
              <Text style={styles.filterText}>{selectedStatus}</Text>
              <Feather
                name={showStatusDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>

            {/* Status Dropdown */}
            {showStatusDropdown && (
              <View style={styles.dropdownContainer}>
                {['All', 'Paid', 'Unpaid'].map((option, idx) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      idx === 2 && styles.lastDropdownItem,
                    ]}
                    onPress={() => {
                      setSelectedStatus(option);
                      setShowStatusDropdown(false);
                    }}>
                    <Text style={styles.dropdownText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  filterSection: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
    justifyContent: 'space-between',
    height: 42,
    marginLeft: 12
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusFilterContainer: {
    position: 'relative',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 10,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 90,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default TopSection;
