import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CategoryFilters = ({
  selectedFilter,
  setSelectedFilter,
  filters = ['All', 'Cash', 'Bank'],
}) => {
  return (
    <View style={styles.categoryFiltersContainer}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.categoryFilterButton,
            selectedFilter === filter && styles.activeCategoryFilter,
          ]}
          onPress={() => setSelectedFilter(filter)}>
          <Text
            style={[
              styles.categoryFilterText,
              selectedFilter === filter && styles.activeCategoryFilterText,
            ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryFiltersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  categoryFilterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
    borderWidth: 1,
    borderColor: '#F6F8FA',
  },
  activeCategoryFilter: {borderWidth: 1, borderColor: Colors.border},
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryFilterText: {
    color: '#111',
  },
});

export default CategoryFilters;
