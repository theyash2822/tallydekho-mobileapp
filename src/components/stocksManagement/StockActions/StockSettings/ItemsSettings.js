import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomSwitch from '../../../common/CustomSwitch';
import StockSettingsStyles from './css/StockSettingsStyles';

const ItemsSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [batchTracking, setBatchTracking] = useState(true);
  const [expiryTracking, setExpiryTracking] = useState(false);
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [defaultReorderPoint, setDefaultReorderPoint] = useState('24');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={StockSettingsStyles.container}>
      <TouchableOpacity
        style={StockSettingsStyles.header}
        onPress={toggleExpanded}
         activeOpacity={1}>
        <View style={StockSettingsStyles.headerLeft}>
          <View style={StockSettingsStyles.iconContainer}>
            <Feather name="package" size={20} color="#6F7C97" />
          </View>
          <Text style={StockSettingsStyles.headerTitle}>Items</Text>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#8F939E"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={StockSettingsStyles.contentWithSmallPadding}>
          <View style={StockSettingsStyles.settingRow}>
            <View style={StockSettingsStyles.settingInfo}>
              <Text style={StockSettingsStyles.settingTitle}>
                Batch / Lot Tracking
              </Text>
            </View>
            <CustomSwitch
              value={batchTracking}
              onValueChange={setBatchTracking}
            />
          </View>

          <View style={StockSettingsStyles.settingRow}>
            <View style={StockSettingsStyles.settingInfo}>
              <Text style={StockSettingsStyles.settingTitle}>
                Expiry-Date Tracking
              </Text>
            </View>
            <CustomSwitch
              value={expiryTracking}
              onValueChange={setExpiryTracking}
            />
          </View>

          <View style={StockSettingsStyles.settingRow}>
            <View style={StockSettingsStyles.settingInfo}>
              <Text style={StockSettingsStyles.settingTitle}>
                Allow Negative Stock
              </Text>
            </View>
            <CustomSwitch
              value={allowNegativeStock}
              onValueChange={setAllowNegativeStock}
            />
          </View>

          <View style={StockSettingsStyles.inputSection}>
            <Text style={StockSettingsStyles.label}>Default Reorder Point</Text>
            <View style={StockSettingsStyles.combinedInput}>
              <TextInput
                style={StockSettingsStyles.numberInput}
                value={defaultReorderPoint}
                onChangeText={setDefaultReorderPoint}
                keyboardType="numeric"
                placeholder=""
              />
              <View style={StockSettingsStyles.separator} />
              <Text style={StockSettingsStyles.unitTextSimple}>
                Unit of Measure
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ItemsSettings;
