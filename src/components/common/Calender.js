import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import {months} from '../../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {formatDateShort} from '../../utils/dateUtils';

const CustomCalendar = ({
  label = 'Filter by date range',
  style,
  width = '',
  onDateRangeChange,
  containerStyle,
  onOpen,
  shouldClose,
}) => {
  // Memoized years array - only recalculated when component mounts
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

  //Format for better readibility
  // const formatDate = dateStr =>
  //   new Date(dateStr).toLocaleDateString('en-GB', {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric',
  //   });

  // Date state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedOption, setSelectedOption] = useState('thisMonth');
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal and navigation state
  const [showCalendar, setShowCalendar] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear(),
  );

  // Dropdown state
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  // Predefined date range options
  const dateRangeOptions = useMemo(() => [
    {label: 'This Month', value: 'thisMonth'},
    {label: 'Last 3 Months', value: 'last3Months'},
    {label: 'Last 6 Months', value: 'last6Months'},
    {label: 'Custom', value: 'custom'},
  ], []);

  // Memoized calendar date string
  const calendarDate = useMemo(
    () => `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`,
    [currentMonth, currentYear],
  );

  // Optimized date range generator
  const getDateRange = useCallback((start, end) => {
    const range = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const current = new Date(startDate);

    while (current <= endDate) {
      range.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return range;
  }, []);


  // Optimized day press handler
  const onDayPress = useCallback(
    day => {
      const selected = day.dateString;
      const today = new Date().toISOString().split('T')[0];
      
      // Prevent selection of future dates
      if (selected > today) {
        return;
      }

      if (!startDate || (startDate && endDate)) {
        // Starting a new range
        setStartDate(selected);
        setEndDate(null);
        setMarkedDates({
          [selected]: {
            startingDay: true,
            endingDay: true,
            color: '#16C47F',
            textColor: 'white',
          },
        });

        // Call callback for single date selection
        if (onDateRangeChange) {
          onDateRangeChange({startDate: selected, endDate: null});
        }
      } else {
        // Selecting end date
        const selectedDate = new Date(selected);
        const currentStartDate = new Date(startDate);

        if (selectedDate < currentStartDate) {
          // If selected date is before start date, make it the new start
          setStartDate(selected);
          setEndDate(null);
          setMarkedDates({
            [selected]: {
              startingDay: true,
              endingDay: true,
              color: '#16C47F',
              textColor: 'white',
            },
          });

          // Call callback for single date selection
          if (onDateRangeChange) {
            onDateRangeChange({startDate: selected, endDate: null});
          }
        } else {
          // Set as end date and mark range
          setEndDate(selected);
          const range = getDateRange(startDate, selected);
          const marks = {};

          range.forEach((date, index) => {
            marks[date] = {
              color: '#16C47F',
              textColor: 'white',
              ...(index === 0 && {startingDay: true}),
              ...(index === range.length - 1 && {endingDay: true}),
            };
          });

          setMarkedDates(marks);

          // Call callback if provided
          if (onDateRangeChange) {
            onDateRangeChange({startDate, endDate: selected});
          }
        }
      }
    },
    [startDate, endDate, getDateRange, onDateRangeChange],
  );

  // Optimized handlers for dropdowns
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

  // Modal handlers
  const handleModalPress = useCallback(() => {
    setOpenMonth(false);
    setOpenYear(false);
    // Don't close calendar modal when clicking outside dropdowns
  }, []);

  const handleCancel = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
    setSelectedOption('thisMonth');
    setShowCalendar(false);
    setShowOptions(false);
    setIsInitialized(false);
    if (onDateRangeChange) {
      onDateRangeChange({startDate: null, endDate: null});
    }
  }, [onDateRangeChange]);

  const handleOk = useCallback(() => {
    // If custom was selected but no dates chosen, revert to "This Month"
    if (selectedOption === 'custom' && !startDate && !endDate) {
      setSelectedOption('thisMonth');
      setIsInitialized(false);
    }
    setShowCalendar(false);
    setShowOptions(false);
  }, [selectedOption, startDate, endDate]);

  // Calculate date range for predefined options
  const getDateRangeForOption = useCallback((option) => {
    const today = new Date();
    let start, end;

    switch (option) {
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        // Use today as the end date instead of last day of month
        end = today;
        break;
      case 'last3Months':
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        // Use today as the end date
        end = today;
        break;
      case 'last6Months':
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        // Use today as the end date
        end = today;
        break;
      default:
        return null;
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return {startDate: startStr, endDate: endStr};
  }, []);

  // Handle option selection
  const handleOptionSelect = useCallback((option) => {
    setSelectedOption(option);
    
    if (option === 'custom') {
      // Clear dates and show calendar for custom selection
      setStartDate(null);
      setEndDate(null);
      setMarkedDates({});
      setShowOptions(false);
      setShowCalendar(true);
    } else {
      // Apply predefined date range
      const dateRange = getDateRangeForOption(option);
      if (dateRange) {
        setStartDate(dateRange.startDate);
        setEndDate(dateRange.endDate);
        
        // Update marked dates
        const range = getDateRange(dateRange.startDate, dateRange.endDate);
        const marked = {};
        range.forEach((date, index) => {
          if (index === 0) {
            marked[date] = {
              startingDay: true,
              color: '#16C47F',
              textColor: 'white',
            };
          } else if (index === range.length - 1) {
            marked[date] = {
              endingDay: true,
              color: '#16C47F',
              textColor: 'white',
            };
          } else {
            marked[date] = {
              color: '#C8F5E5',
              textColor: '#000',
            };
          }
        });
        setMarkedDates(marked);

        // Notify parent
        if (onDateRangeChange) {
          onDateRangeChange(dateRange);
        }
        
        setShowOptions(false);
      }
    }
  }, [getDateRangeForOption, getDateRange, onDateRangeChange]);

  const openCalendar = useCallback(() => {
    setShowOptions(true);
    if (onOpen) {
      onOpen();
    }
  }, [onOpen]);

  // Set default to "This Month" on mount
  useEffect(() => {
    if (!isInitialized && selectedOption === 'thisMonth') {
      const dateRange = getDateRangeForOption('thisMonth');
      if (dateRange) {
        setStartDate(dateRange.startDate);
        setEndDate(dateRange.endDate);
        
        // Update marked dates
        const range = getDateRange(dateRange.startDate, dateRange.endDate);
        const marked = {};
        range.forEach((date, index) => {
          if (index === 0) {
            marked[date] = {
              startingDay: true,
              color: '#16C47F',
              textColor: 'white',
            };
          } else if (index === range.length - 1) {
            marked[date] = {
              endingDay: true,
              color: '#16C47F',
              textColor: 'white',
            };
          } else {
            marked[date] = {
              color: '#C8F5E5',
              textColor: '#000',
            };
          }
        });
        setMarkedDates(marked);

        // Notify parent
        if (onDateRangeChange) {
          onDateRangeChange(dateRange);
        }
        
        setIsInitialized(true);
      }
    }
  }, [isInitialized, selectedOption, getDateRangeForOption, getDateRange, onDateRangeChange]);

  // Close dropdown when shouldClose prop changes
  useEffect(() => {
    if (shouldClose) {
      setShowOptions(false);
      setShowCalendar(false);
    }
  }, [shouldClose]);

  // Calendar theme (memoized to prevent recreation)
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: Colors.white,
      calendarBackground: Colors.white,
      textSectionTitleColor: '#9291A5',
      todayTextColor: '#16C47F',
    }),
    [],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.button} onPress={openCalendar}>
        <View style={[styles.infoContainer, {width}, style]}>
          <View style={styles.labelContainer}>
            <Icon name="calendar" size={20} color="#898E9A" />
            {/* Only show text if not in custom mode without dates */}
            {!(selectedOption === 'custom' && !startDate && !endDate) && (
              <Text
                style={[
                  styles.buttonText,
                  (startDate || endDate) && styles.buttonTextSelected,
                ]}>
                {startDate && endDate
                  ? `${formatDateShort(startDate, false)}-${formatDateShort(endDate, false)}`
                  : startDate
                  ? formatDateShort(startDate, false)
                  : label}
              </Text>
            )}
          </View>
          <Icon name="chevron-down" size={20} color="#898E9A" />
        </View>
      </TouchableOpacity>

      {/* Options Dropdown - positioned below button */}
      {showOptions && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.dropdownOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.optionsDropdown}>
            {dateRangeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  index === dateRangeOptions.length - 1 && styles.optionItemLast,
                  selectedOption === option.value && styles.optionItemSelected,
                ]}
                onPress={() => handleOptionSelect(option.value)}>
                <Text style={[
                  styles.optionText,
                  selectedOption === option.value && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {/* {selectedOption === option.value && (
                  <Icon name="check" size={18} color="#16C47F" />
                )} */}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Calendar Modal */}
      <Modal transparent visible={showCalendar} animationType="fade">
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
                onDayPress={onDayPress}
                markedDates={markedDates}
                markingType="period"
                enableSwipeMonths
                renderHeader={() => null}
                renderArrow={() => null}
                theme={calendarTheme}
                maxDate={new Date().toISOString().split('T')[0]}
              />

              <View style={styles.calendarButtons}>
                {/* <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius:16,
    paddingHorizontal:8,
    paddingVertical:2,
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
    // color: Colors.secondaryText,
  },
  buttonTextSelected: {
    color: '#111111',
    fontWeight: '600',
  },
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
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  optionsDropdown: {
    position: 'absolute',
    top: '100%',
    left: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    minWidth: 160,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionItemSelected: {
    // backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 14,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  optionTextSelected: {
    // color: '#16C47F',
    fontWeight: '600',
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
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

export default CustomCalendar;






// use this with ledger details it has date range filter applied for vouchers and shimmer effect also 


// import React, {useState, useEffect, useMemo, useCallback} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   Modal,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {Calendar} from 'react-native-calendars';
// import DropDownPicker from 'react-native-dropdown-picker';
// import {months} from '../../utils/Constants';
// import Icon from 'react-native-vector-icons/Feather';
// import Colors from '../../utils/Colors';

// const CustomCalendar = ({
//   label = 'Filter by date range',
//   style,
//   width = '',
//   onDateRangeChange,
//   onOk,
//   containerStyle,
//   selectedStartDate = null, // Prop to control displayed start date
//   selectedEndDate = null, // Prop to control displayed end date
// }) => {
//   // Memoized years array - only recalculated when component mounts
//   const yearItems = useMemo(() => {
//     const currentYear = new Date().getFullYear();
//     return Array.from({length: 100}, (_, i) => {
//       const year = currentYear - 25 + i;
//       return {label: year.toString(), value: year};
//     });
//   }, []);

//   // Memoized month items
//   const monthItems = useMemo(
//     () => months.map((month, index) => ({label: month, value: index})),
//     [],
//   );

//   //Format for better readibility
//   // const formatDate = dateStr =>
//   //   new Date(dateStr).toLocaleDateString('en-GB', {
//   //     day: '2-digit',
//   //     month: 'short',
//   //     year: 'numeric',
//   //   });

//   // Date state - use props if provided, otherwise use internal state
//   const [startDate, setStartDate] = useState(selectedStartDate);
//   const [endDate, setEndDate] = useState(selectedEndDate);
//   const [markedDates, setMarkedDates] = useState({});

//   // Update internal state when props change
//   useEffect(() => {
//     if (selectedStartDate !== null) {
//       setStartDate(selectedStartDate);
//     }
//     if (selectedEndDate !== null) {
//       setEndDate(selectedEndDate);
//     }
//   }, [selectedStartDate, selectedEndDate]);

//   // Modal and navigation state
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(() =>
//     new Date().getFullYear(),
//   );

//   // Dropdown state
//   const [openMonth, setOpenMonth] = useState(false);
//   const [openYear, setOpenYear] = useState(false);

//   // Memoized calendar date string
//   const calendarDate = useMemo(
//     () => `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`,
//     [currentMonth, currentYear],
//   );

//   // Optimized date range generator
//   const getDateRange = useCallback((start, end) => {
//     const range = [];
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const current = new Date(startDate);

//     while (current <= endDate) {
//       range.push(current.toISOString().split('T')[0]);
//       current.setDate(current.getDate() + 1);
//     }

//     return range;
//   }, []);


//   const formatDate = dateStr => {
//     if (!dateStr) return '';
//     const [year, month, day] = dateStr.split('-');
//     const months = [
//       'Jan',
//       'Feb',
//       'Mar',
//       'Apr',
//       'May',
//       'Jun',
//       'Jul',
//       'Aug',
//       'Sep',
//       'Oct',
//       'Nov',
//       'Dec',
//     ];
//     return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year.slice(-2)}`;
//   };


//   // Optimized day press handler
//   const onDayPress = useCallback(
//     day => {
//       const selected = day.dateString;

//       if (!startDate || (startDate && endDate)) {
//         // Starting a new range
//         setStartDate(selected);
//         setEndDate(null);
//         setMarkedDates({
//           [selected]: {
//             startingDay: true,
//             endingDay: true,
//             color: '#16C47F',
//             textColor: 'white',
//           },
//         });

//         // Call callback for single date selection
//         if (onDateRangeChange) {
//           onDateRangeChange({startDate: selected, endDate: null});
//         }
//       } else {
//         // Selecting end date
//         const selectedDate = new Date(selected);
//         const currentStartDate = new Date(startDate);

//         if (selectedDate < currentStartDate) {
//           // If selected date is before start date, make it the new start
//           setStartDate(selected);
//           setEndDate(null);
//           setMarkedDates({
//             [selected]: {
//               startingDay: true,
//               endingDay: true,
//               color: '#16C47F',
//               textColor: 'white',
//             },
//           });

//           // Call callback for single date selection
//           if (onDateRangeChange) {
//             onDateRangeChange({startDate: selected, endDate: null});
//           }
//         } else {
//           // Set as end date and mark range
//           setEndDate(selected);
//           const range = getDateRange(startDate, selected);
//           const marks = {};

//           range.forEach((date, index) => {
//             marks[date] = {
//               color: '#16C47F',
//               textColor: 'white',
//               ...(index === 0 && {startingDay: true}),
//               ...(index === range.length - 1 && {endingDay: true}),
//             };
//           });

//           setMarkedDates(marks);

//           // Call callback if provided
//           if (onDateRangeChange) {
//             onDateRangeChange({startDate, endDate: selected});
//           }
//         }
//       }
//     },
//     [startDate, endDate, getDateRange, onDateRangeChange],
//   );

//   // Optimized handlers for dropdowns
//   const handleMonthChange = useCallback(
//     value => {
//       setCurrentMonth(
//         typeof value === 'function' ? value(currentMonth) : value,
//       );
//     },
//     [currentMonth],
//   );

//   const handleYearChange = useCallback(
//     value => {
//       setCurrentYear(typeof value === 'function' ? value(currentYear) : value);
//     },
//     [currentYear],
//   );

//   // Modal handlers
//   const handleModalPress = useCallback(() => {
//     setOpenMonth(false);
//     setOpenYear(false);
//     // Don't close calendar modal when clicking outside dropdowns
//   }, []);

//   const handleCancel = useCallback(() => {
//     setStartDate(null);
//     setEndDate(null);
//     setMarkedDates({});
//     setShowCalendar(false);
//     if (onDateRangeChange) {
//       onDateRangeChange({startDate: null, endDate: null});
//     }
//   }, [onDateRangeChange]);

//   const handleOk = useCallback(() => {
//     // Call onOk callback if provided (for API calls, etc.)
//     if (onOk) {
//       onOk({startDate, endDate});
//     }
//     setShowCalendar(false);
//   }, [onOk, startDate, endDate]);

//   const openCalendar = useCallback(() => {
//     setShowCalendar(true);
//   }, []);

//   // Calendar theme (memoized to prevent recreation)
//   const calendarTheme = useMemo(
//     () => ({
//       backgroundColor: Colors.white,
//       calendarBackground: Colors.white,
//       textSectionTitleColor: '#9291A5',
//       todayTextColor: '#16C47F',
//     }),
//     [],
//   );

//   return (
//     <View style={[styles.container, containerStyle]}>
//       <TouchableOpacity style={styles.button} onPress={openCalendar}>
//         <View style={[styles.infoContainer, {width}, style]}>
//           <View style={styles.labelContainer}>
//             <Icon name="calendar" size={20} color="#898E9A" />
//             <Text
//               style={[
//                 styles.buttonText,
//                 ((selectedStartDate || startDate) || (selectedEndDate || endDate)) && styles.buttonTextSelected,
//               ]}>
//               {(selectedStartDate || startDate) && (selectedEndDate || endDate)
//                 ? `${formatDate(selectedStartDate || startDate)} - ${formatDate(selectedEndDate || endDate)}`
//                 : (selectedStartDate || startDate)
//                 ? formatDate(selectedStartDate || startDate)
//                 : label}
//             </Text>

//             {/* <Text style={styles.buttonText}>
//               {startDate && endDate
//                 ? `${formatDate(startDate)} to ${formatDate(endDate)}`
//                 : startDate
//                 ? formatDate(startDate)
//                 : label}
//             </Text> */}
//           </View>
//           <Icon name="chevron-down" size={20} color="#898E9A" />
//         </View>
//       </TouchableOpacity>

//       <Modal transparent visible={showCalendar} animationType="fade">
//         <TouchableWithoutFeedback onPress={handleModalPress}>
//           <View style={styles.modalContainer}>
//             <View style={styles.calendarWrapper}>
//               <View style={styles.pickerContainer}>
//                 <View style={styles.monthPickerContainer}>
//                   <DropDownPicker
//                     open={openMonth}
//                     value={currentMonth}
//                     items={monthItems}
//                     setOpen={setOpenMonth}
//                     setValue={handleMonthChange}
//                     showTickIcon={false}
//                     style={styles.dropdown}
//                     textStyle={styles.dropdownText}
//                     dropDownContainerStyle={[
//                       styles.dropdownContainer,
//                       styles.monthDropdown,
//                     ]}
//                   />
//                 </View>

//                 <View style={styles.yearPickerContainer}>
//                   <DropDownPicker
//                     open={openYear}
//                     value={currentYear}
//                     items={yearItems}
//                     setOpen={setOpenYear}
//                     setValue={handleYearChange}
//                     showTickIcon={false}
//                     style={styles.dropdown}
//                     textStyle={styles.dropdownText}
//                     dropDownContainerStyle={[
//                       styles.dropdownContainer,
//                       styles.yearDropdown,
//                     ]}
//                   />
//                 </View>
//               </View>

//               <Calendar
//                 key={`${currentYear}-${currentMonth}`}
//                 current={calendarDate}
//                 onDayPress={onDayPress}
//                 markedDates={markedDates}
//                 markingType="period"
//                 enableSwipeMonths
//                 renderHeader={() => null}
//                 renderArrow={() => null}
//                 theme={calendarTheme}
//               />

//               <View style={styles.calendarButtons}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={handleCancel}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.okButton} onPress={handleOk}>
//                   <Text style={styles.okButtonText}>OK</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.white,
//     borderRadius:16,
//     paddingHorizontal:8,
//     paddingVertical:2
//   },
//   button: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   buttonText: {
//     marginHorizontal: 8,
//     fontSize: 14,
//     fontWeight: '500',
//     // color: Colors.secondaryText,
//   },
//   buttonTextSelected: {
//     color: '#111111',
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   calendarWrapper: {
//     backgroundColor: Colors.white,
//     padding: 12,
//     borderRadius: 10,
//     elevation: 5,
//     width: 320,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   monthPickerContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   yearPickerContainer: {
//     flex: 1,
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 5,
//     paddingVertical: 5,
//     justifyContent: 'space-between',
//   },
//   labelContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dropdown: {
//     backgroundColor: Colors.white,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   dropdownText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.secondaryText,
//   },
//   dropdownContainer: {
//     backgroundColor: Colors.white,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   monthDropdown: {
//     maxHeight: 220,
//   },
//   yearDropdown: {
//     maxHeight: 300,
//   },
//   calendarButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//   },
//   cancelButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: '#ddd',
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   cancelButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.secondaryText,
//   },
//   okButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: '#16C47F',
//     borderRadius: 5,
//   },
//   okButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });

// export default CustomCalendar;

