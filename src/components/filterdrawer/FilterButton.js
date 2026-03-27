import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const FilterButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      style={[styles.filterButton, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Feather 
        name="filter" 
        size={18} 
        color="#6B7280" 
      />
      <Text style={styles.filterButtonText}>
        Filter
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default FilterButton;

