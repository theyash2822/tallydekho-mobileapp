import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Colors from '../../utils/Colors';

const { width } = Dimensions.get('window');

const FilterSidebar = ({ categories, selectedCategory, onCategorySelect }) => {
  const renderCategoryItem = useCallback((category) => {
    const isSelected = selectedCategory === category.key;

    return (
      <TouchableOpacity
        key={category.key}
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => onCategorySelect(category.key)}
        activeOpacity={0.7}>
        <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
          {category.label}
        </Text>
        {category.count > 0 && (
          <View style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected]}>
            <Text style={styles.categoryBadgeText}>{category.count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [selectedCategory, onCategorySelect]);

  return (
    <View style={styles.sidebar}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sidebarContent}>
        {categories.map(category => renderCategoryItem(category))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: width * 0.4,
    backgroundColor: '#F4F5FA',
    borderRightColor: Colors.border,
  },
  sidebarContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryItemSelected: {
    backgroundColor: '#fff',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8F939E',
  },
  categoryLabelSelected: {
    color: '#111',
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  categoryBadgeSelected: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  categoryBadgeText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
   
  },
});

export default FilterSidebar;

