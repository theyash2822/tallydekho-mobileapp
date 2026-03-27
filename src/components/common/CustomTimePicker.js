import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from './CustomAnimatedModal';

const CustomTimePicker = ({
  visible,
  onClose,
  onConfirm,
  initialTime = '12:00 AM',
  title = 'Select Time',
}) => {
  const parseTimeToDate = timeString => {
    const now = new Date();
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  /* ---------------- ANDROID ---------------- */
  if (Platform.OS === 'android') {
    return (
      <DatePicker
        modal
        open={visible}
        date={parseTimeToDate(initialTime)}
        mode="time"
        theme="light"
        onConfirm={date => {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;

          const timeString = `${displayHours
            .toString()
            .padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')} ${ampm}`;

          onConfirm(timeString);
        }}
        onCancel={onClose}
      />
    );
  }

  /* ---------------- iOS ---------------- */
  const [tempDate, setTempDate] = useState(parseTimeToDate(initialTime));

  useEffect(() => {
    if (visible) {
      setTempDate(parseTimeToDate(initialTime));
    }
  }, [visible, initialTime]);

  const handleIOSConfirm = () => {
    const hours = tempDate.getHours();
    const minutes = tempDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const timeString = `${displayHours
      .toString()
      .padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;

    onConfirm(timeString);
    onClose();
  };

  return (
    <CustomAnimatedModal visible={visible} onClose={onClose}>
      <View style={styles.modalContent}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Picker */}
        <DatePicker
          date={tempDate}
          mode="time"
          onDateChange={setTempDate}
          theme="light"
          textColor="#111827"
          dividerColor={Colors.border}
        />

        {/* Buttons Below */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleIOSConfirm}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#F4F5FA',
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#8f939e',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  doneButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default CustomTimePicker;
