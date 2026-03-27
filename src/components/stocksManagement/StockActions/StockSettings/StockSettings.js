import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from '../../../common/Header';
import GeneralSettings from './GeneralSettings';
import WarehouseSettings from './WarehouseSettings';
import ItemsSettings from './ItemsSettings';
import AlertSettings from './AlertSettings';
import AddWarehouseModal from './AddWarehouseModal';
import Colors from '../../../../utils/Colors';
import {CustomBottomButton} from '../../../common';

const StockSettings = ({navigation}) => {
  const [isWarehouseModalVisible, setIsWarehouseModalVisible] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState(null);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving stock settings...');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleWarehouseSave = warehouse => {
    setNewWarehouse(warehouse);
    setIsWarehouseModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          title="Stock Settings"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <GeneralSettings />
          <WarehouseSettings
            onAddWarehouse={() => setIsWarehouseModalVisible(true)}
            newWarehouse={newWarehouse}
          />
          <ItemsSettings />
          <AlertSettings />
        </ScrollView>

        {/* Add Warehouse Modal */}
        <AddWarehouseModal
          visible={isWarehouseModalVisible}
          onClose={() => setIsWarehouseModalVisible(false)}
          onSave={handleWarehouseSave}
        />
      </View>
      <CustomBottomButton
        buttonText="Save"
        onPress={handleSave}
        secondButtonText="Cancel"
        showSecondButton
        secondButtonColor="#F7F9FC"
        onSecondPress={handleCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
});

export default StockSettings;
