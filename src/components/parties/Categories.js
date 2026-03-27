import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const tags = [
  {label: 'Party', color: '#FF5A5F'},
  {label: 'Vendor', color: '#9B51E0'},
  {label: 'Supplier', color: '#2D9CDB'},
];

const TagSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Tag/ Categories <Text style={styles.required}>*</Text>
        <Text style={styles.optional}> optional</Text>
      </Text>

      <Text style={styles.subLabel}>Tag</Text>

      <View style={styles.tagRow}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagChip}>
            <View style={[styles.colorDot, {backgroundColor: tag.color}]} />
            <Text style={[styles.tagText, {color: tag.color}]}>
              {tag.label}
            </Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addTag}>
          <Icon name="add" size={18} color="#898E9A" />
          <Text style={styles.addText}>Add tag</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#494D58',
  },
  required: {
    color: 'red',
  },
  optional: {
    color: '#8F939E',
    fontWeight: '400',
    fontSize: 12,
  },
  subLabel: {
    fontSize: 12,
    color: '#8F939E',
    marginTop: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth:1,
    borderColor:Colors.border
  },
  colorDot: {
    width: 6,
    height: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addTag: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.border,
    // borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  addText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
});

export default TagSection;
