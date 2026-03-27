import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import {CommonDropdownStyles} from '../../../utils/CommonStyles';
import Header from '../../common/Header';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import CustomTimePicker from '../../common/CustomTimePicker';
import {
  Checkbox,
  RadioButton,
  NumberInput,
} from '../../Helper/HelperComponents';
import DatePicker from 'react-native-date-picker';

const LowStockExpiryAlerts = () => {
  const navigation = useNavigation();
  const [saveStatus, setSaveStatus] = useState('save');
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [lowStock, setLowStock] = useState({
    category: 'groupWise',
    reorderPoint: 3,
    includeNegativeStock: true,
  });
  const [expiry, setExpiry] = useState({
    alertBefore: '30 Days',
    onlyTrackedBatches: true,
    groupByWarehouse: true,
  });
  const [delivery, setDelivery] = useState({
    channels: {push: true, email: true, whatsapp: false, sms: false},
    frequency: 'immediate',
    time: '05:00 PM',
    dailySendTime: true,
  });

  const alertOptions = ['7 Days', '15 Days', '30 Days', '60 Days'];
  const frequencyOptions = ['immediate', 'daily', 'weekly'];
  const channelOptions = ['push', 'email', 'whatsapp', 'sms'];

  const handleAlertSelect = option => {
    setExpiry(prev => ({...prev, alertBefore: option}));
    setShowAlertDropdown(false);
  };

  const handleTimeConfirm = timeString => {
    setDelivery(prev => ({...prev, time: timeString}));
    setShowTimePicker(false);
  };

  const toggleChannel = channel => {
    setDelivery(prev => ({
      ...prev,
      channels: {...prev.channels, [channel]: !prev.channels[channel]},
    }));
  };

  const updateReorderPoint = increment => {
    const newValue = lowStock.reorderPoint + increment;
    if (newValue >= 0) {
      setLowStock(prev => ({...prev, reorderPoint: newValue}));
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('save'), 2000);
    }, 1500);
  };

  return (
    <>
      <Header
        title="Low Stock & Expiry Alerts"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showAlertDropdown}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Low Stock</Text>

            <View style={styles.radioSection}>
              <Text style={styles.radioLabel}>Category</Text>
              <View style={styles.radioButtons}>
                <RadioButton
                  selected={lowStock.category === 'groupWise'}
                  onPress={() =>
                    setLowStock(prev => ({...prev, category: 'groupWise'}))
                  }
                  label="Group wise"
                />
                <RadioButton
                  selected={lowStock.category === 'itemWise'}
                  onPress={() =>
                    setLowStock(prev => ({...prev, category: 'itemWise'}))
                  }
                  label="Item wise"
                />
              </View>
            </View>

            <View style={styles.searchSection}>
              <View style={styles.searchInput}>
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchText}
                  placeholder="Select Item"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.reorderSection}>
              <Text style={styles.reorderLabel}>Reorder point</Text>
              <View style={styles.reorderRow}>
                <NumberInput
                  value={lowStock.reorderPoint}
                  onIncrement={() => updateReorderPoint(1)}
                  onDecrement={() => updateReorderPoint(-1)}
                  onChangeText={value => setLowStock(prev => ({...prev, reorderPoint: value}))}
                />
                <Checkbox
                  checked={lowStock.includeNegativeStock}
                  onPress={() =>
                    setLowStock(prev => ({
                      ...prev,
                      includeNegativeStock: !prev.includeNegativeStock,
                    }))
                  }
                  label="Include Negative Stock"
                  style={{marginBottom: 0}}
                />
              </View>
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Expiry</Text>

            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownLabel}>Alert before</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowAlertDropdown(!showAlertDropdown)}>
                <Text style={styles.dropdownValue}>{expiry.alertBefore}</Text>
                <Ionicons
                  name={showAlertDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {showAlertDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}>
                    {alertOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          expiry.alertBefore === option &&
                            styles.selectedOption,
                          index === alertOptions.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleAlertSelect(option)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            expiry.alertBefore === option &&
                              styles.selectedOptionText,
                          ]}>
                          {option}
                        </Text>
                        {expiry.alertBefore === option && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#10B981"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row', gap: 10}}>
              <Checkbox
                checked={expiry.onlyTrackedBatches}
                onPress={() =>
                  setExpiry(prev => ({
                    ...prev,
                    onlyTrackedBatches: !prev.onlyTrackedBatches,
                  }))
                }
                label="Only for tracked batches"
              />
              <Checkbox
                checked={expiry.groupByWarehouse}
                onPress={() =>
                  setExpiry(prev => ({
                    ...prev,
                    groupByWarehouse: !prev.groupByWarehouse,
                  }))
                }
                label="Group by warehouse"
              />
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Delivery & Schedule</Text>

            <View style={styles.channelsSection}>
              <Text style={styles.channelsLabel}>Channel</Text>
              <View style={styles.channelToggles}>
                {channelOptions.map(channel => (
                  <Checkbox
                    key={channel}
                    checked={delivery.channels[channel]}
                    onPress={() => toggleChannel(channel)}
                    label={channel.charAt(0).toUpperCase() + channel.slice(1)}
                    style={{marginBottom: 0}}
                  />
                ))}
              </View>
            </View>

            <View style={styles.frequencySection}>
              <Text style={styles.frequencyLabel}>Frequency</Text>
              <View style={styles.radioButtons}>
                {frequencyOptions.map(freq => (
                  <RadioButton
                    key={freq}
                    selected={delivery.frequency === freq}
                    onPress={() =>
                      setDelivery(prev => ({...prev, frequency: freq}))
                    }
                    label={freq.charAt(0).toUpperCase() + freq.slice(1)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Time</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.timeValue}>{delivery.time}</Text>
                </TouchableOpacity>
                <Checkbox
                  checked={delivery.dailySendTime}
                  onPress={() =>
                    setDelivery(prev => ({
                      ...prev,
                      dailySendTime: !prev.dailySendTime,
                    }))
                  }
                  label="Daily send-time"
                  style={{marginTop: 10}}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <CustomBottomButtons
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
          saveState={saveStatus}
        />
      </View>

      <CustomTimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        initialTime={delivery.time}
        title="Select Time"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F4F5FA'},
  scrollView: {flex: 1, padding: 12},
  scrollContent: {paddingBottom: 12},
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 12,
  },
  radioSection: {marginBottom: 12},
  radioLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  radioButtons: {flexDirection: 'row', gap: 20},
  searchSection: {marginBottom: 12},
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: Platform.OS === 'ios' ? 48 : undefined,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
  },
  reorderSection: {marginBottom: 12},
  reorderLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  reorderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dropdownSection: {marginBottom: 12},
  dropdownLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  dropdown: CommonDropdownStyles.dropdownInput,
  dropdownValue: {fontSize: 14, color: '#111827', fontWeight: '500'},
  dropdownOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {fontSize: 14, color: '#374151'},
  selectedOption: {backgroundColor: '#fff'},
  selectedOptionText: {color: '#10B981', fontWeight: '500'},
  channelsSection: {marginBottom: 12},
  channelsLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  channelToggles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  frequencySection: {marginBottom: 12},
  frequencyLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  timeSection: {marginBottom: 16},
  timeLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  timeInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timeValue: {fontSize: 14, color: '#111827', fontWeight: '500'},
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
    borderRadius: 1,
  },
});

export default LowStockExpiryAlerts;
