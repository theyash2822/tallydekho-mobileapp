import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import StockSettingsStyles from './css/StockSettingsStyles';

const GeneralSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [globalReorderBuffer, setGlobalReorderBuffer] = useState('7');
  const [autoArchiveDays, setAutoArchiveDays] = useState('24');
  const [autoArchiveMonths, setAutoArchiveMonths] = useState('24');
  const [defaultUoM, setDefaultUoM] = useState(['Black JBL', 'Kilogram']);
  const [isUoMDropdownOpen, setIsUoMDropdownOpen] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleUoMDropdown = () => {
    setIsUoMDropdownOpen(!isUoMDropdownOpen);
  };

  const addUoM = uom => {
    if (!defaultUoM.includes(uom)) {
      setDefaultUoM([...defaultUoM, uom]);
    }
    setIsUoMDropdownOpen(false);
  };

  const removeUoM = uomToRemove => {
    setDefaultUoM(defaultUoM.filter(uom => uom !== uomToRemove));
  };

  const availableUoM = [
    'Pieces',
    'Meters',
    'Liters',
    'Grams',
    'Boxes',
    'Units',
  ];

  return (
    <View style={StockSettingsStyles.container}>
      <TouchableOpacity
        style={StockSettingsStyles.header}
        onPress={toggleExpanded}
        activeOpacity={1}>
        <View style={StockSettingsStyles.headerLeft}>
          <View style={StockSettingsStyles.iconContainer}>
            <Feather name="settings" size={20} color="#6F7C97" />
          </View>
          <Text style={StockSettingsStyles.headerTitle}>General</Text>
        </View>
        <Feather
          name="chevron-down"
          size={20}
          color="#8F939E"
          style={isExpanded && {transform: [{rotate: '180deg'}]}}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={StockSettingsStyles.content}>
          <View style={StockSettingsStyles.row}>
            <View style={StockSettingsStyles.inputGroup}>
              <Text style={StockSettingsStyles.label}>
                Global Reorder Buffer
              </Text>
              <View style={StockSettingsStyles.combinedInput}>
                <TextInput
                  style={StockSettingsStyles.numberInput}
                  value={globalReorderBuffer}
                  onChangeText={setGlobalReorderBuffer}
                  keyboardType="numeric"
                  placeholder="7"
                />
                <Text style={StockSettingsStyles.unitText}>Days</Text>
              </View>
            </View>

            <View style={StockSettingsStyles.inputGroup}>
              <Text style={StockSettingsStyles.label}>
                Auto-archive ledger after
              </Text>
              <View style={StockSettingsStyles.combinedInput}>
                <TextInput
                  style={StockSettingsStyles.numberInput}
                  value={autoArchiveDays}
                  onChangeText={setAutoArchiveDays}
                  keyboardType="numeric"
                  placeholder="24"
                />
                <Text style={StockSettingsStyles.unitText}>Months</Text>
              </View>
            </View>
          </View>

          <View style={StockSettingsStyles.uomSection}>
            <Text style={StockSettingsStyles.label}>Default UoM</Text>
            <View style={StockSettingsStyles.chipBox}>
              <View style={StockSettingsStyles.chipBoxHeader}>
                <View style={StockSettingsStyles.chipContainer}>
                  {defaultUoM.map((uom, index) => (
                    <View key={index} style={StockSettingsStyles.chip}>
                      <Text style={StockSettingsStyles.chipText}>{uom}</Text>
                      <TouchableOpacity
                        style={StockSettingsStyles.chipRemove}
                        onPress={() => removeUoM(uom)}>
                        <Feather name="x" size={12} color="#1A1A1A" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={StockSettingsStyles.chevronButton}
                  onPress={toggleUoMDropdown}>
                  <Feather
                    name={isUoMDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#8F939E"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isUoMDropdownOpen && (
              <View style={StockSettingsStyles.dropdownOptions}>
                {availableUoM
                  .filter(uom => !defaultUoM.includes(uom))
                  .map((uom, index, arr) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        StockSettingsStyles.dropdownOption,
                        index === arr.length - 1 && {borderBottomWidth: 0},
                      ]}
                      onPress={() => addUoM(uom)}>
                      <Text style={StockSettingsStyles.dropdownOptionText}>
                        {uom}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default GeneralSettings;
