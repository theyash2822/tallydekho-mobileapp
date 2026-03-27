import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const DropdownSelector = ({label, options, selectedValue, onValueChange}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(prev => !prev)}>
        <View style={styles.row}>
          <Text style={styles.placeholder}>{selectedValue}</Text>
          <Ionicons name="chevron-down" size={16} color="#6e7191" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}>
                <Text style={styles.dropdownItem}>{option}</Text>
              </TouchableOpacity>
              {index !== options.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 6,
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '400',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
});

export default DropdownSelector;
