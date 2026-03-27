import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TimeFilters = ({
  selectedFilter,
  setSelectedFilter,
  filters = ['7D', '1M', '3M', '6M'],
}) => {
  return (
    <View style={styles.timeFiltersContainer}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.timeFilterButton,
            selectedFilter === filter && styles.activeTimeFilter,
          ]}
          onPress={() => setSelectedFilter(filter)}>
          <Text
            style={[
              styles.timeFilterText,
              selectedFilter === filter && styles.activeTimeFilterText,
            ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timeFiltersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 2,
    backgroundColor: '#F6F8FA',
    padding: 4,
    borderRadius: 10,
  },
  timeFilterButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTimeFilter: {
    backgroundColor: '#FFFFFF',
  },
  timeFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTimeFilterText: {
    color: '#111',
    fontWeight: '600',
  },
});

export default TimeFilters;
