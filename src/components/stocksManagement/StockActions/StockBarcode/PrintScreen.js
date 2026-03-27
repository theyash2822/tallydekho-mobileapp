import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import {CommonDropdownStyles} from '../../../../utils/CommonStyles';
import {Checkbox} from '../../../Helper/HelperComponents';

const PrintScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {queueItems} = route.params || {queueItems: []};
  const [labelSize, setLabelSize] = useState('50x30 mm');
  const [copiesPerBarcode, setCopiesPerBarcode] = useState('1');
  const [showLabelSizeDropdown, setShowLabelSizeDropdown] = useState(false);
  const [layoutOptions, setLayoutOptions] = useState({
    showSKU: true,
    showPrice: true,
    showBatchExpiry: true,
  });

  const labelSizeOptions = ['50x30 mm', '40x20 mm', '60x40 mm', '30x15 mm'];

  const incrementCopies = () => {
    const currentValue = parseInt(copiesPerBarcode) || 1;
    setCopiesPerBarcode(String(currentValue + 1));
  };

  const decrementCopies = () => {
    const currentValue = parseInt(copiesPerBarcode) || 1;
    if (currentValue > 1) {
      setCopiesPerBarcode(String(currentValue - 1));
    }
  };

  const handleCopiesInputChange = text => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '' || parseInt(numericValue) > 0) {
      setCopiesPerBarcode(numericValue);
    }
  };

  const handleCopiesInputFocus = () => {
    // Select all text when focused for easy editing
    if (copiesPerBarcode && copiesPerBarcode !== '') {
      // This will be handled by the TextInput's selectTextOnFocus prop
    }
  };

  const handleCopiesInputBlur = () => {
    // Ensure we always have a valid number
    if (copiesPerBarcode === '' || parseInt(copiesPerBarcode) < 1) {
      setCopiesPerBarcode('1');
    }
  };

  const toggleLayoutOption = option => {
    setLayoutOptions(prev => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handlePreviewLabel = () => {
    if (queueItems.length === 0) {
      Alert.alert('No Items', 'Please add items to the print queue first.');
      return;
    }

    Alert.alert('Preview', 'Label preview generated successfully!');
  };

  const handlePrintExport = () => {
    if (queueItems.length === 0) {
      Alert.alert('No Items', 'Please add items to the print queue first.');
      return;
    }

    Alert.alert('Success', 'Labels sent to printer/exported successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header
        title="Print"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Print Configuration Card */}
        <View style={styles.configCard}>
          {/* Label Size */}
          <View style={styles.configSection}>
            <Text style={styles.configLabel}>Label Size</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowLabelSizeDropdown(!showLabelSizeDropdown)}
              activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{labelSize}</Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Label Size Dropdown */}
            {showLabelSizeDropdown && (
              <View style={styles.dropdownList}>
                {labelSizeOptions.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setLabelSize(size);
                      setShowLabelSizeDropdown(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Copies per barcode */}
          <View style={styles.configSection}>
            <Text style={styles.configLabel}>Copies per barcode</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decrementCopies}
                activeOpacity={0.7}>
                <Feather name="minus" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.counterValue}>
                <TextInput
                  style={styles.counterText}
                  keyboardType="numeric"
                  value={copiesPerBarcode}
                  onChangeText={handleCopiesInputChange}
                  onFocus={handleCopiesInputFocus}
                  onBlur={handleCopiesInputBlur}
                  selectTextOnFocus={true}
                  clearButtonMode="never"
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={styles.counterButton}
                onPress={incrementCopies}
                activeOpacity={0.7}>
                <Feather name="plus" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Layout per label */}
          <View style={styles.configSection}>
            <Text style={styles.configLabel}>Layout per label</Text>

            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={layoutOptions.showSKU}
                onPress={() => toggleLayoutOption('showSKU')}
                label="Show SKU"
                trailing
                style={{marginBottom: 0}}
                labelStyle={styles.checkboxLabel}
              />
              <Checkbox
                checked={layoutOptions.showPrice}
                onPress={() => toggleLayoutOption('showPrice')}
                label="Show Price"
                trailing
                style={{marginBottom: 0}}
                labelStyle={styles.checkboxLabel}
              />
              <Checkbox
                checked={layoutOptions.showBatchExpiry}
                onPress={() => toggleLayoutOption('showBatchExpiry')}
                label="Show Batch/Expiry"
                trailing
                style={{marginBottom: 0}}
                labelStyle={styles.checkboxLabel}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreviewLabel}
          activeOpacity={0.8}>
          <Text style={styles.previewButtonText}>Preview Label</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.printExportButton}
          onPress={handlePrintExport}
          activeOpacity={0.8}>
          <Text style={styles.printExportButtonText}>Print/Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  // Configuration Card
  configCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
  },
  configSection: {
    marginBottom: 10,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 12,
  },
  // Dropdown Input
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: {
    fontSize: 16,
    color: '#111111',
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111111',
  },
  // Counter Container
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  counterButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  counterValue: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
    padding: 0,
    minWidth: 60,
    height: '100%',
    width: '100%',
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#494D58',
    fontWeight: '400',
  },
  // Action Section
  actionSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  previewButton: {
    backgroundColor: '#07624C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  printExportButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  printExportButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrintScreen;
