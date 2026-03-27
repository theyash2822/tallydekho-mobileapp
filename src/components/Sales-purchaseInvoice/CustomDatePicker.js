import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {formatDateDMY} from '../../utils/dateUtils';

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(
    formatDateDMY(new Date().toISOString().split('T')[0]),
  ); // DD/MM/YYYY
  const [calendarVisible, setCalendarVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Touchable to Open Calendar */}
      <TouchableOpacity
        onPress={() => setCalendarVisible(true)}
        style={styles.inputContainer}>
        <Icon name="calendar-outline" size={18} color="#6F7C97" />
        <Text style={styles.dateText}>{selectedDate}</Text>
        <Feather name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal visible={calendarVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={day => {
                setSelectedDate(formatDateDMY(day.dateString));
                setCalendarVisible(false);
              }}
              markedDates={{
                [selectedDate]: {selected: true, selectedColor: '#009688'},
              }}
            />
            <TouchableOpacity
              onPress={() => setCalendarVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateText: {
    color: '#8A8A8E',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#009688',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default CustomDatePicker;
