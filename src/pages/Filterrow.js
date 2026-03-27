import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../utils/Colors';

const FilterRow = ({
  selectedFY,
  selectedFilter,
  onFilterChange,
  onFYChange,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showFYDropdown, setShowFYDropdown] = useState(false);

  const filterOptions = ['All', 'Paid', 'Pending', 'Cancelled'];
  const fyOptions = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24', 'FY 2022-23'];

  const closeAllDropdowns = () => {
    setShowFilterDropdown(false);
    setShowFYDropdown(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <View style={styles.filterRow}>
        {/* FY Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setShowFYDropdown(!showFYDropdown);
              setShowFilterDropdown(false);
            }}>
            <Text style={styles.filterText}>{selectedFY}</Text>
            <Feather
              name={showFYDropdown ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#6B7280"
            />
          </TouchableOpacity>

          {/* FY Dropdown */}
          {showFYDropdown && (
            <View style={styles.dropdownContainer}>
              {fyOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    index === fyOptions.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    onFYChange(option);
                    setShowFYDropdown(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedFY === option && styles.dropdownTextActive,
                    ]}>
                    {option}
                  </Text>
                  {selectedFY === option && (
                    <Feather name="check" size={16} color="#16C47F" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setShowFilterDropdown(!showFilterDropdown);
              setShowFYDropdown(false);
            }}>
            <Text style={styles.filterText}>{selectedFilter}</Text>
            <Feather
              name={showFilterDropdown ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#6B7280"
            />
          </TouchableOpacity>

          {/* Status Dropdown */}
          {showFilterDropdown && (
            <View style={styles.dropdownContainer}>
              {filterOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    index === filterOptions.length - 1 &&
                      styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    onFilterChange(option);
                    setShowFilterDropdown(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedFilter === option && styles.dropdownTextActive,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    zIndex: 1000,
  },
  filterContainer: {
    position: 'relative',
    zIndex: 1000,
    
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
    justifyContent: 'space-between',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
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
    minWidth: 120,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default FilterRow;
