import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Header from '../../common/Header';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import CustomTimePicker from '../../common/CustomTimePicker';
import CustomSwitch from '../../common/CustomSwitch';
import {Checkbox} from '../../Helper/HelperComponents';
import DatePicker from 'react-native-date-picker';
import BuyCreditModal from '../AccountAndOrganizations/Components/BuyCreditModal';

const ChannelsQuietHours = () => {
  const navigation = useNavigation();
  const [saveStatus, setSaveStatus] = useState('save');

  const [deliveryChannels, setDeliveryChannels] = useState({
    email: false,
    whatsapp: false,
    sms: true,
    pushNotification: false,
  });

  const [quietHours, setQuietHours] = useState({
    doNotDisturb: true,
    startTime: '06:00 AM',
    endTime: '10:00 PM',
    weekends: {
      saturday: true,
      sunday: true,
    },
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isBuyCreditModalVisible, setIsBuyCreditModalVisible] = useState(false);
  const [selectedCreditOption, setSelectedCreditOption] = useState('500');

  const toggleChannel = channel => {
    setDeliveryChannels(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const toggleQuietHours = () => {
    setQuietHours(prev => ({
      ...prev,
      doNotDisturb: !prev.doNotDisturb,
    }));
  };

  const toggleWeekend = day => {
    setQuietHours(prev => ({
      ...prev,
      weekends: {
        ...prev.weekends,
        [day]: !prev.weekends[day],
      },
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('save');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleStartTimeConfirm = timeString => {
    setQuietHours(prev => ({...prev, startTime: timeString}));
    setShowStartPicker(false);
  };

  const handleEndTimeConfirm = timeString => {
    setQuietHours(prev => ({...prev, endTime: timeString}));
    setShowEndPicker(false);
  };

  const handleBuyCredit = async () => {
    if (Platform.OS === 'ios') {
      // For iOS, open website
      const url = 'https://www.tallydekho.com/tally-pricing-plans.html';
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open the website');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open website');
      }
    } else {
      // For Android, show modal
      setIsBuyCreditModalVisible(true);
    }
  };

  const closeBuyCreditModal = () => {
    setIsBuyCreditModalVisible(false);
  };

  const handleCreditOptionSelect = option => {
    setSelectedCreditOption(option);
  };

  const handleBuyNow = () => {
    console.log(`Buying ${selectedCreditOption} credits`);
    // Handle purchase logic here
    closeBuyCreditModal();
  };

  return (
    <>
      <Header
        title="Channels & Quiet Hours"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Delivery Channels Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Channels</Text>

            <View style={styles.channelItem}>
              <Text style={styles.channelLabel}>Email</Text>
              <CustomSwitch
                value={deliveryChannels.email}
                onValueChange={() => toggleChannel('email')}
              />
            </View>

            <View style={styles.channelItem}>
              <Text style={styles.channelLabel}>WhatsApp</Text>
              <CustomSwitch
                value={deliveryChannels.whatsapp}
                onValueChange={() => toggleChannel('whatsapp')}
              />
            </View>

            <View style={styles.channelItem}>
              <Text style={styles.channelLabel}>SMS</Text>
              <CustomSwitch
                value={deliveryChannels.sms}
                onValueChange={() => toggleChannel('sms')}
              />
            </View>

            <View style={styles.channelItem}>
              <Text style={styles.channelLabel}>Push Notification</Text>
              <CustomSwitch
                value={deliveryChannels.pushNotification}
                onValueChange={() => toggleChannel('pushNotification')}
              />
            </View>

            <View style={styles.creditSection}>
              <Text style={styles.channelLabel}>Credit Balance</Text>
              <Text style={styles.creditValue}>128</Text>
            </View>

            <TouchableOpacity 
              style={styles.buyCreditButton}
              onPress={handleBuyCredit}>
              <Text style={styles.buyCreditText}>Buy Credit</Text>
            </TouchableOpacity>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Quiet Hours Section */}
            <Text style={styles.sectionTitle}>Quiet Hours</Text>

            <View style={styles.quietHoursItem}>
              <Text style={styles.quietHoursLabel}>Do-not-disturb</Text>
              <CustomSwitch
                value={quietHours.doNotDisturb}
                onValueChange={toggleQuietHours}
              />
            </View>

            <View style={styles.timeSection}>
              {/* Start Time */}
              <View style={styles.timePicker}>
                <Text style={styles.timeLabel}>Start</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.timeValue}>{quietHours.startTime}</Text>
                  {/* <Ionicons name="time-outline" size={16} color="#6B7280" /> */}
                </TouchableOpacity>
              </View>

              {/* End Time */}
              <View style={styles.timePicker}>
                <Text style={styles.timeLabel}>End</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.timeValue}>{quietHours.endTime}</Text>
                  {/* <Ionicons name="time-outline" size={16} color="#6B7280" /> */}
                </TouchableOpacity>
              </View>
            </View>

            {/* Weekends */}
            <View style={styles.weekendSection}>
              <Text style={styles.weekendLabel}>Weekends</Text>
              <View style={styles.muteRow}>
                <Text style={styles.muteLabel}>Mute :</Text>
                <View style={styles.weekendCheckboxes}>
                  <Checkbox
                    checked={quietHours.weekends.saturday}
                    onPress={() => toggleWeekend('saturday')}
                    label="Saturday"
                    style={{marginBottom: 0, marginRight: 8}}
                  />
                  <Checkbox
                    checked={quietHours.weekends.sunday}
                    onPress={() => toggleWeekend('sunday')}
                    label="Sunday"
                    style={{marginBottom: 0}}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <CustomBottomButtons
          onSave={handleSave}
          onCancel={handleCancel}
          saveState={saveStatus}
        />
      </View>

      {/* Custom Time Pickers */}
      <CustomTimePicker
        visible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        onConfirm={handleStartTimeConfirm}
        initialTime={quietHours.startTime}
        title="Start Time"
      />
      <CustomTimePicker
        visible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        onConfirm={handleEndTimeConfirm}
        initialTime={quietHours.endTime}
        title="End Time"
      />

      {/* Buy Credit Modal - Only show on Android */}
      {Platform.OS === 'android' && (
        <BuyCreditModal
          visible={isBuyCreditModalVisible}
          onClose={closeBuyCreditModal}
          selectedCreditOption={selectedCreditOption}
          onCreditOptionSelect={handleCreditOptionSelect}
          onBuyNow={handleBuyNow}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  scrollContent: {
    paddingBottom: 12,
  },

  // Section styles
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

  // Common text styles
  channelLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  creditValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  // Common item styles
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Button styles
  buyCreditButton: {
    backgroundColor: '#07624C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyCreditText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
    marginTop: 18,
  },

  // Quiet hours styles
  quietHoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quietHoursLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },

  // Time section styles
  timeSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timePicker: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 8,
  },
  timeInput: {
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
  timeValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  // Weekend section styles
  weekendSection: {
    marginBottom: 12,
  },
  weekendLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 8,
  },
  weekendCheckboxes: {
    flexDirection: 'row',
    gap: 12,
  },
  muteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muteLabel: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
});

export default ChannelsQuietHours;
