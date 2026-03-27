import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

// Reusable Checkbox Component
export const Checkbox = ({checked, onPress, label, style, labelStyle, trailing = false}) => (
  <View style={[styles.checkboxItem, trailing && styles.checkboxItemTrailing, style]}>
    {trailing ? (
      <>
        <Text style={[styles.checkboxLabel, {marginLeft: 0}, labelStyle]}>{label}</Text>
        <TouchableOpacity
          style={[styles.checkbox, checked && styles.checkboxSelected]}
          onPress={onPress}>
          {checked && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </TouchableOpacity>
      </>
    ) : (
      <>
        <TouchableOpacity
          style={[styles.checkbox, checked && styles.checkboxSelected]}
          onPress={onPress}>
          {checked && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </TouchableOpacity>
        <Text style={[styles.checkboxLabel, labelStyle]}>{label}</Text>
      </>
    )}
  </View>
);

// Reusable RadioButton Component
export const RadioButton = ({selected, onPress, label}) => (
  <TouchableOpacity style={styles.radioItem} onPress={onPress}>
    <View
      style={[
        styles.radioCircle,
        {borderColor: selected ? '#10B981' : Colors.border},
      ]}>
      {selected && <View style={styles.radioSelected} />}
    </View>
    <Text style={styles.radioText}>{label}</Text>
  </TouchableOpacity>
);

// Reusable NumberInput Component
export const NumberInput = ({value, onIncrement, onDecrement, onChangeText}) => (
  <View style={styles.numberInput}>
    <TouchableOpacity style={styles.numberButton} onPress={onDecrement}>
      <Ionicons name="remove" size={20} color="#6B7280" />
    </TouchableOpacity>
    <TextInput
      style={styles.numberValue}
      value={value.toString()}
      onChangeText={text => {
        const numValue = parseInt(text) || 0;
        if (onChangeText) {
          onChangeText(numValue);
        }
      }}
      keyboardType="numeric"
      textAlign="center"
    />
    <TouchableOpacity style={styles.numberButton} onPress={onIncrement}>
      <Ionicons name="add" size={20} color="#6B7280" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  // Checkbox styles
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxItemTrailing: {
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
    marginLeft: 8,
  },

  // Radio button styles
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  radioText: {
    fontSize: 14,
    color: '#667085',
    fontWeight: '400',
  },

  // Number input styles
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 45,
    paddingHorizontal: 12,
    flex: 1,
  },
  numberButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
});
