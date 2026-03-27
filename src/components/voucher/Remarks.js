import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const Remarks = ({showReference = true, showRemarks = true}) => {
  const [selectedRef, setSelectedRef] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [remarks, setRemarks] = useState('');

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Conditionally Render Reference Box */}
      {showReference && (
        <View style={styles.box}>
          <Text style={styles.title}>Reference</Text>
          <Text style={styles.label}>Credit Reference</Text>
          <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
            <Text style={{color: selectedRef ? Colors.black : '#999'}}>
              {selectedRef || 'Return, Discount, Damaged Goods, etc.'}
            </Text>
            <Ionicons
              name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              {['Return', 'Discount', 'Damaged Goods'].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedRef(item);
                    setDropdownVisible(false);
                  }}
                  style={styles.dropdownItem}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Conditionally Render Remarks Box */}
      {showRemarks && (
        <View style={styles.box}>
          <Text style={styles.title}>Remarks</Text>
          <Text style={styles.label}>Narration</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Describe the item or service, including quantity, rate, and any special notes."
            placeholderTextColor={Colors.secondaryText}
            value={remarks}
            onChangeText={setRemarks}
            maxLength={2000}
          />
          <Text style={styles.charCount}>{`${remarks.length}/1000`}</Text>
        </View>
      )}

      {/* Next Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 20,
    backgroundColor: '#f2f2f2',
  },
  box: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: Colors.primaryTitle,
  },
  label: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 130,
    textAlignVertical: 'top',
    marginTop: 4,
    color: Colors.secondaryText,
  },
  charCount: {
    textAlign: 'right',
    color: Colors.secondaryText,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#07624C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Remarks;
