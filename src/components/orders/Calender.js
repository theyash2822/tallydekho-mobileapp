import React, {useState, useMemo, useCallback} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import {months} from '../../utils/Constants';
import Colors from '../../utils/Colors';

const CustomCalendarnew = ({
  visible,
  initialDate,
  onSelectDate,
  onClose,
  allowFutureDates = false,
}) => {
  const initial = initialDate || new Date();
  const [selectedDate, setSelectedDate] = useState(initial);
  const [currentMonth, setCurrentMonth] = useState(initial.getMonth());
  const [currentYear, setCurrentYear] = useState(initial.getFullYear());
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  // Memoized years array
  const yearItems = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 100}, (_, i) => {
      const year = currentYear - 25 + i;
      return {label: year.toString(), value: year};
    });
  }, []);

  // Memoized month items
  const monthItems = useMemo(
    () => months.map((month, index) => ({label: month, value: index})),
    [],
  );

  // Memoized calendar date string
  const calendarDate = useMemo(
    () => `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`,
    [currentMonth, currentYear],
  );

  const handleMonthChange = useCallback(
    value => {
      setCurrentMonth(
        typeof value === 'function' ? value(currentMonth) : value,
      );
    },
    [currentMonth],
  );

  const handleYearChange = useCallback(
    value => {
      setCurrentYear(typeof value === 'function' ? value(currentYear) : value);
    },
    [currentYear],
  );

  const handleDayPress = useCallback(
    day => {
      const newDate = new Date(day.dateString);
      setSelectedDate(newDate);
    },
    [],
  );

  const handleOk = useCallback(() => {
    onSelectDate(selectedDate);
    onClose();
  }, [selectedDate, onSelectDate, onClose]);

  const handleModalPress = useCallback(() => {
    setOpenMonth(false);
    setOpenYear(false);
  }, []);

  // Calendar theme (matching CustomCalendar)
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: Colors.white,
      calendarBackground: Colors.white,
      textSectionTitleColor: '#9291A5',
      todayTextColor: '#16C47F',
    }),
    [],
  );

  const markedDates = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return {
      [dateStr]: {
        selected: true,
        selectedColor: '#16C47F',
        textColor: 'white',
      },
    };
  }, [selectedDate]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleModalPress}>
        <View style={styles.modalContainer}>
          <View style={styles.calendarWrapper}>
            <View style={styles.pickerContainer}>
              <View style={styles.monthPickerContainer}>
                <DropDownPicker
                  open={openMonth}
                  value={currentMonth}
                  items={monthItems}
                  setOpen={setOpenMonth}
                  setValue={handleMonthChange}
                  showTickIcon={false}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={[
                    styles.dropdownContainer,
                    styles.monthDropdown,
                  ]}
                />
              </View>

              <View style={styles.yearPickerContainer}>
                <DropDownPicker
                  open={openYear}
                  value={currentYear}
                  items={yearItems}
                  setOpen={setOpenYear}
                  setValue={handleYearChange}
                  showTickIcon={false}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={[
                    styles.dropdownContainer,
                    styles.yearDropdown,
                  ]}
                />
              </View>
            </View>

            <Calendar
              key={`${currentYear}-${currentMonth}`}
              current={calendarDate}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              enableSwipeMonths
              renderHeader={() => null}
              renderArrow={() => null}
              theme={calendarTheme}
              {...(allowFutureDates
                ? {}
                : {maxDate: new Date().toISOString().split('T')[0]})}
            />

            <View style={styles.calendarButtons}>
              <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarWrapper: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    elevation: 5,
    width: 320,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  monthPickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  yearPickerContainer: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondaryText,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monthDropdown: {
    maxHeight: 220,
  },
  yearDropdown: {
    maxHeight: 300,
  },
  calendarButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  okButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#16C47F',
    borderRadius: 5,
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CustomCalendarnew;
