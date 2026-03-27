import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../common/CustomSwitch';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../utils/CommonStyles';
import CustomCalendarnew from '../orders/Calender';
import ToolTip from '../Sales-purchaseInvoice/ToolTip';

const VoucherInfo = () => {
  const [voucherNumber, setVoucherNumber] = useState('');
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    dueDate: new Date(),
  });

  const handleDatePress = fieldKey => {
    setSelectedDateField(fieldKey);
    setShowCalendar(true);
  };

  const handleDateSelected = date => {
    setDateValues(prev => ({
      ...prev,
      [selectedDateField]: date,
    }));
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <ToolTip />
        {/* <Text style={styles.label}>Regular</Text> */}
        <CustomSwitch />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Voucher Number</Text>
          <TextInput
            value={voucherNumber}
            onChangeText={setVoucherNumber}
            placeholder="DN-0045"
            placeholderTextColor="#8F939E"
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('dueDate')}
            style={styles.iconInput}>
            <Icon name="calendar-outline" size={18} color="#8F939E" />
            <Text style={styles.dateText}>
              {dateValues.dueDate.toLocaleDateString('en-GB')}
            </Text>
            <Icon
              name="chevron-down-outline"
              size={20}
              color="#8F939E"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showCalendar && (
        <CustomCalendarnew
          visible={showCalendar}
          initialDate={dateValues[selectedDateField]}
          onSelectDate={handleDateSelected}
          onClose={() => setShowCalendar(false)}
          allowFutureDates={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  label: {
    ...CommonLabelStyles.label,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputBox: {
    width: '48%',
  },
  input: {
    ...CommonInputStyles.textInput,
    paddingHorizontal: 10,
    color: '#000',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
});

export default VoucherInfo;




//Perfect Dynamic Code maybe!! handles all of the data in the voucher also uncomment and replace before using the perfect code
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import CustomSwitch from '../common/CustomSwitch';
// import Colors from '../../utils/Colors';
// import CustomCalendarnew from '../orders/Calender';
// import ToolTip from '../Sales-purchaseInvoice/ToolTip';

// const VoucherInfo = ({data, onChange}) => {
//   const [selectedDateField, setSelectedDateField] = useState(null);
//   const [showCalendar, setShowCalendar] = useState(false);

//   const handleDatePress = fieldKey => {
//     setSelectedDateField(fieldKey);
//     setShowCalendar(true);
//   };

//   const handleDateSelected = date => {
//     onChange(selectedDateField, date);
//     setShowCalendar(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.switchRow}>
//         <ToolTip label="Regular" />
//         <CustomSwitch />
//       </View>

//       <View style={styles.inputRow}>
//         <View style={styles.inputBox}>
//           <Text style={styles.label}>Voucher Number</Text>
//           <TextInput
//             value={data.voucherNumber}
//             onChangeText={text => onChange('voucherNumber', text)}
//             placeholder="DN-0045"
//             placeholderTextColor="#8F939E"
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputBox}>
//           <Text style={styles.label}>Date</Text>
//           <TouchableOpacity
//             onPress={() => handleDatePress('dueDate')}
//             style={styles.iconInput}>
//             <Icon name="calendar-outline" size={18} color="#8F939E" />
//             <Text style={styles.dateText}>
//               {data.dueDate.toLocaleDateString('en-GB')}
//             </Text>
//             <Icon
//               name="chevron-down-outline"
//               size={20}
//               color="#8F939E"
//               style={styles.chevronIcon}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {showCalendar && (
//         <CustomCalendarnew
//           visible={showCalendar}
//           initialDate={data[selectedDateField]}
//           onSelectDate={handleDateSelected}
//           onClose={() => setShowCalendar(false)}
//         />
//       )}
//     </View>
//   );
// };