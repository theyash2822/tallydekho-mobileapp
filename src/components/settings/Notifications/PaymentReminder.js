import React, {useState, useRef, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextSemibold} from '../../../utils/CustomText';
import Colors from '../../../utils/Colors';
import {CommonInputStyles} from '../../../utils/CommonStyles';
import Header from '../../common/Header';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import CustomSlider from '../../common/CustomSlider';
import CustomSwitch from '../../common/CustomSwitch';
import {Checkbox} from '../../Helper/HelperComponents';

// Import DatePicker for time selection
import DatePicker from 'react-native-date-picker';

const STORAGE_KEY_REMINDERS = 'payment_reminders';
const STORAGE_KEY_AVOID_REMINDER = 'payment_avoid_reminder';

const PaymentReminder = () => {
  const navigation = useNavigation();
  const [avoidReminder, setAvoidReminder] = useState(500);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState(null);
  const [activeTimePicker, setActiveTimePicker] = useState(null);
  const defaultReminders = [
    {
      id: 1,
      name: 'BUY',
      days: 3,
      time: '09:00 AM',
      onDueDate: true,
      enabled: true,
      channels: {
        push: true,
        email: false,
        whatsapp: false,
        sms: false,
      },
      exceptions: ['Traders', 'Royal Furnish'],
    },
    {
      id: 2,
      name: '',
      days: 0,
      time: '',
      onDueDate: false,
      enabled: false,
      channels: {
        push: false,
        email: false,
        whatsapp: false,
        sms: false,
      },
      exceptions: [],
    },
  ];

  const [reminders, setReminders] = useState(defaultReminders);

  // Load saved reminders on mount
  useEffect(() => {
    const loadSavedReminders = async () => {
      try {
        const savedReminders = await AsyncStorage.getItem(STORAGE_KEY_REMINDERS);
        const savedAvoidReminder = await AsyncStorage.getItem(STORAGE_KEY_AVOID_REMINDER);
        
        if (savedReminders) {
          const parsedReminders = JSON.parse(savedReminders);
          if (Array.isArray(parsedReminders) && parsedReminders.length > 0) {
            setReminders(parsedReminders);
          }
        }
        
        if (savedAvoidReminder) {
          const parsedValue = parseInt(savedAvoidReminder, 10);
          if (!isNaN(parsedValue)) {
            setAvoidReminder(parsedValue);
          }
        }
      } catch (error) {
        console.error('Error loading saved reminders:', error);
      }
    };

    loadSavedReminders();
  }, []);

  const toggleReminder = id => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? {...reminder, enabled: !reminder.enabled}
          : reminder,
      ),
    );
  };

  const toggleReminderSection = id => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? {...reminder, expanded: !reminder.expanded}
          : reminder,
      ),
    );
  };

  const updateReminderField = (id, field, value) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? {...reminder, [field]: value} : reminder,
      ),
    );
  };

  const updateReminderDays = (id, increment) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? {...reminder, days: Math.max(0, reminder.days + increment)}
          : reminder,
      ),
    );
  };

  const toggleChannel = (reminderId, channel) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? {
              ...reminder,
              channels: {
                ...reminder.channels,
                [channel]: !reminder.channels[channel],
              },
            }
          : reminder,
      ),
    );
  };

  const handleTimeSelect = reminderId => {
    setSelectedReminderId(reminderId);
    setActiveTimePicker(reminderId);
    setShowTimePicker(true);
  };

  const onTimeConfirm = date => {
    if (selectedReminderId && date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;
      updateReminderField(selectedReminderId, 'time', timeString);
    }
    setShowTimePicker(false);
    setSelectedReminderId(null);
    setActiveTimePicker(null);
  };

  const onTimeCancel = () => {
    setShowTimePicker(false);
    setSelectedReminderId(null);
    setActiveTimePicker(null);
  };

  const removeException = (reminderId, exceptionIndex) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? {
              ...reminder,
              exceptions: reminder.exceptions.filter(
                (_, index) => index !== exceptionIndex,
              ),
            }
          : reminder,
      ),
    );
  };

  const addReminder = () => {
    const newReminder = {
      id: Date.now(),
      name: '',
      days: 0,
      time: '',
      onDueDate: false,
      enabled: false,
      channels: {
        push: false,
        email: false,
        whatsapp: false,
        sms: false,
      },
      exceptions: [],
    };
    setReminders(prev => [...prev, newReminder]);
  };

  // const deleteReminder = (id) => {
  //   setReminders(prev => prev.filter(reminder => reminder.id !== id));
  // };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Save reminders and avoidReminder to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
      await AsyncStorage.setItem(STORAGE_KEY_AVOID_REMINDER, avoidReminder.toString());

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSaveStatus('saved');

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving reminders:', error);
      setSaveStatus('idle');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };


  const renderChannelToggles = reminder => {
    const channelOptions = ['push', 'email', 'whatsapp', 'sms'];

    return (
      <View style={styles.channelsSection}>
        <Text style={styles.channelsLabel}>Channel</Text>
        <View style={styles.channelToggles}>
          {channelOptions.map(channel => (
            <Checkbox
              key={channel}
              checked={reminder.channels[channel]}
              onPress={() => toggleChannel(reminder.id, channel)}
              label={channel.charAt(0).toUpperCase() + channel.slice(1)}
              style={{marginBottom: 0}}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderReminder = reminder => {
    const isExpanded = reminder.expanded !== false; // Default to expanded for first reminder

    return (
      <View key={reminder.id} style={styles.reminderItem}>
        <TouchableOpacity
          style={[
            styles.reminderHeader,
            isExpanded && styles.reminderHeaderExpanded,
          ]}
          onPress={() => toggleReminderSection(reminder.id)}>
          <Text style={styles.reminderTitle}>
            {reminder.name || 'First Reminder -7 Days'}
          </Text>
          <View style={styles.reminderHeaderRight}>
            <CustomSwitch
              value={reminder.enabled}
              onValueChange={() => toggleReminder(reminder.id)}
            />
            {/* <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                deleteReminder(reminder.id);
              }}
              style={styles.deleteButton}
              activeOpacity={0.7}>
              <Ionicons
                name="trash-outline"
                size={20}
                color="#EF4444"
              />
            </TouchableOpacity> */}
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.reminderContent}>
            <View style={styles.inputRow}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={reminder.name}
                  onChangeText={text =>
                    updateReminderField(reminder.id, 'name', text)
                  }
                  placeholder="Enter name reminders"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Day</Text>
                <View style={styles.numberInput}>
                  <TouchableOpacity
                    style={styles.numberButton}
                    onPress={() => updateReminderDays(reminder.id, -1)}>
                    <Ionicons name="remove" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.numberValue}
                    value={reminder.days.toString()}
                    onChangeText={text => {
                      const numValue = parseInt(text) || 0;
                      updateReminderField(reminder.id, 'days', numValue);
                    }}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                  <TouchableOpacity
                    style={styles.numberButton}
                    onPress={() => updateReminderDays(reminder.id, 1)}>
                    <Ionicons name="add" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Time</Text>
                <TouchableOpacity
                  style={styles.timePicker}
                  onPress={() => handleTimeSelect(reminder.id)}>
                  <Ionicons name="time" size={20} color="#6B7280" />
                  <Text style={styles.timeValue}>
                    {reminder.time || '00:00'}
                  </Text>
                  {/* <Ionicons name="chevron-down" size={16} color="#6B7280" /> */}
                </TouchableOpacity>
              </View>
            </View>

            <Checkbox
              checked={reminder.onDueDate}
              onPress={() =>
                updateReminderField(
                  reminder.id,
                  'onDueDate',
                  !reminder.onDueDate,
                )
              }
              label="On Due Date"
            />

            {renderChannelToggles(reminder)}

            <View style={styles.exceptionsSection}>
              <Text style={styles.exceptionsLabel}>Exceptions List (5)</Text>
              {reminder.exceptions.length > 0 ? (
                <View style={styles.exceptionContainer}>
                  {reminder.exceptions.map((exception, index) => (
                    <View key={index} style={styles.exceptionTag}>
                      <Text style={styles.exceptionTagText}>{exception}</Text>
                      <TouchableOpacity
                        style={styles.removeException}
                        onPress={() => removeException(reminder.id, index)}>
                        <Ionicons name="close" size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.searchInput}>
                  <Ionicons name="search" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.searchText}
                    placeholder="Search"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Header
        title="Payment Reminder"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.white} /> */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {/* Avoid Reminder Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avoid Reminder</Text>

            <Text style={styles.avoidReminderText}>
              Stop if customer balance
            </Text>

            <CustomSlider
              value={avoidReminder}
              onValueChange={setAvoidReminder}
              min={0}
              max={500}
              step={100}
              // All other props are already default values, so you can omit them
            />

            {/* List of Reminders Section */}

            <Text style={styles.sectionTitle}>List of Reminders</Text>

            {reminders.map(renderReminder)}

            {reminders.length < 4 && (
              <TouchableOpacity
                style={styles.addReminderButton}
                onPress={addReminder}>
                <Text style={styles.addReminderText}>+ Add Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <CustomBottomButtons
          onSave={handleSave}
          onCancel={handleCancel}
          saveState={saveStatus}
        />
      </View>

      {showTimePicker && selectedReminderId && (
        <DatePicker
          modal
          open={showTimePicker}
          date={new Date()} // Initial date for time picker
          mode="time"
          onConfirm={onTimeConfirm}
          onCancel={onTimeCancel}
          style={styles.datePicker}
          theme="light"
          textColor="#111827"
          backgroundColor={Colors.white}
          dividerColor={Colors.border}
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
  scrollViewContent: {
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
    fontWeight: '400',
    color: '#111111',
    marginBottom: 10,
  },
  avoidReminderText: {
    fontSize: 12,
    color: '#8F939E',
    marginBottom: 12,
    fontWeight: '400',
  },

  // Reminder item styles
  reminderItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  reminderHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reminderTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  reminderHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderContent: {
    padding: 12,
    backgroundColor: Colors.white,
  },

  // Input styles
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputSection: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 8,
  },

  // Text input and similar input fields
  textInput: {
    ...CommonInputStyles.textInputLg,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 45,
    paddingHorizontal: 12,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    height: 45,
    backgroundColor: Colors.white,
    activeOpacity: 0.7,
  },

  // Number input elements
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
  timeValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },

  // Channel styles
  channelsSection: {
    marginBottom: 12,
  },
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

  // Exception styles
  exceptionsSection: {
    marginTop: 8,
  },
  exceptionsLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
    marginBottom: 12,
  },
  exceptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: Colors.white,
  },
  exceptionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  exceptionTagText: {
    fontSize: 14,
    color: '#111827',
  },
  removeException: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search and add button styles
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: Platform.OS === 'ios' ? 16 : 16,
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  addReminderButton: {
    backgroundColor: '#ECEFF7',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addReminderText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Loading and spinner styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    borderTopColor: 'transparent',
    borderRadius: 8,
    animation: 'spin 1s linear infinite',
  },
  datePicker: {
    backgroundColor: Colors.white,
  },
  deleteButton: {
    padding: 4,
    marginRight: 4,
  },
});

export default PaymentReminder;
