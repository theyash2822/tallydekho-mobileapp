import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import StockSettingsStyles from './css/StockSettingsStyles';

const WarehouseSettings = ({onAddWarehouse, newWarehouse}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: 'Evermore Distribution',
      location: 'New Delhi, India',
      code: 'JPR-MAIN',
      isExpanded: false,
      cycleCountFrequency: 'Weekly',
      autoArchiveLayer: '24',
    },
    {
      id: 2,
      name: 'Brightstar Logistics',
      location: 'New Delhi, India',
      code: 'BSL-001',
      isExpanded: false,
      cycleCountFrequency: 'Monthly',
      autoArchiveLayer: '12',
    },
    {
      id: 3,
      name: 'Clearview Supply',
      location: 'New Delhi, India',
      code: 'CVS-002',
      isExpanded: false,
      cycleCountFrequency: 'Weekly',
      autoArchiveLayer: '18',
    },
  ]);

  // Add new warehouse when it's provided
  React.useEffect(() => {
    if (newWarehouse) {
      setWarehouses(prev => [...prev, newWarehouse]);
    }
  }, [newWarehouse]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleWarehouseExpanded = warehouseId => {
    setWarehouses(
      warehouses.map(warehouse =>
        warehouse.id === warehouseId
          ? {...warehouse, isExpanded: !warehouse.isExpanded}
          : warehouse,
      ),
    );
  };

  const updateWarehouseField = (warehouseId, field, value) => {
    setWarehouses(
      warehouses.map(warehouse =>
        warehouse.id === warehouseId
          ? {...warehouse, [field]: value}
          : warehouse,
      ),
    );
  };

  const handleAddWarehouse = newWarehouse => {
    setWarehouses([...warehouses, newWarehouse]);
  };

  return (
    <View style={StockSettingsStyles.container}>
      <TouchableOpacity
        style={StockSettingsStyles.header}
        onPress={toggleExpanded}
         activeOpacity={1}>
        <View style={StockSettingsStyles.headerLeft}>
          <View style={StockSettingsStyles.iconContainer}>
            <Feather name="home" size={20} color="#6F7C97" />
          </View>
          <Text style={StockSettingsStyles.headerTitle}>Warehouse</Text>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#8F939E"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={StockSettingsStyles.contentWithMinimalPadding}>
          {warehouses.map(warehouse => (
            <View key={warehouse.id} style={StockSettingsStyles.warehouseItem}>
              <TouchableOpacity
                style={StockSettingsStyles.warehouseHeader}
                onPress={() => toggleWarehouseExpanded(warehouse.id)}>
                <View style={StockSettingsStyles.warehouseHeaderLeft}>
                  <View style={StockSettingsStyles.warehouseIconContainer}>
                    <Feather name="home" size={16} color="#fff" />
                  </View>
                  <View style={StockSettingsStyles.warehouseInfo}>
                    <Text style={StockSettingsStyles.warehouseName}>
                      {warehouse.name}
                    </Text>
                    <Text style={StockSettingsStyles.warehouseLocation}>
                      {warehouse.location}
                    </Text>
                  </View>
                </View>
                <Feather
                  name={warehouse.isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#8F939E"
                />
              </TouchableOpacity>

              {warehouse.isExpanded && (
                <View style={StockSettingsStyles.warehouseDetails}>
                  <View style={StockSettingsStyles.inputRow}>
                    <View style={StockSettingsStyles.inputGroup}>
                      <Text style={StockSettingsStyles.labelWithSmallMargin}>
                        Code
                      </Text>
                      <TextInput
                        style={StockSettingsStyles.input}
                        value={warehouse.code}
                        onChangeText={value =>
                          updateWarehouseField(warehouse.id, 'code', value)
                        }
                        placeholder="Warehouse Code"
                      />
                    </View>
                  </View>

                  <View style={StockSettingsStyles.inputRow}>
                    <View style={StockSettingsStyles.inputGroup}>
                      <Text style={StockSettingsStyles.labelWithSmallMargin}>
                        Cycle-count frequency
                      </Text>
                      <View style={StockSettingsStyles.combinedInput}>
                        <Text style={StockSettingsStyles.dropdownText}>
                          {warehouse.cycleCountFrequency}
                        </Text>
                        {/* <Feather
                          name="chevron-down"
                          size={16}
                          color="#8F939E"
                        /> */}
                      </View>
                    </View>
                    <View style={StockSettingsStyles.inputGroup}>
                      <Text style={StockSettingsStyles.labelWithSmallMargin}>
                        Auto-archive layer older than
                      </Text>
                      <View style={StockSettingsStyles.combinedInput}>
                        <TextInput
                          style={StockSettingsStyles.numberInput}
                          value={warehouse.autoArchiveLayer}
                          onChangeText={value =>
                            updateWarehouseField(
                              warehouse.id,
                              'autoArchiveLayer',
                              value,
                            )
                          }
                          keyboardType="numeric"
                          placeholder="12"
                        />
                        {/* <Feather
                          name="chevron-down"
                          size={16}
                          color="#8F939E"
                        /> */}
                        <View style={StockSettingsStyles.separator} />
                        <Text style={StockSettingsStyles.unitTextSimple}>
                          Months
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={StockSettingsStyles.addButton}
            onPress={onAddWarehouse}>
            <Text style={StockSettingsStyles.addButtonText}>Add Warehouse</Text>
            <Feather name="plus" size={18} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WarehouseSettings;
