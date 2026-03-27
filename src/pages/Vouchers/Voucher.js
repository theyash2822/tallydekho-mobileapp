import React from 'react';
import {ScrollView, View} from 'react-native';
import Header from '../../components/common/Header';
import VoucherInfo from '../../components/voucher/VoucherInfo';
import VoucherForm from '../../components/voucher/VoucherType';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';

const Voucher = ({navigation}) => {
  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Vouchers"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <VoucherInfo />
        <VoucherForm />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText="Submit Voucher" showSecondButton={true} />
    </View>
  );
};

export default Voucher;







//Perfect Dynamic Code maybe!! handles all of the data in the voucher
// import React, {useState} from 'react';
// import {StyleSheet, ScrollView} from 'react-native';
// import Header from '../../components/common/Header';
// import Colors from '../../utils/Colors';
// import VoucherInfo from '../../components/voucher/VoucherInfo';
// import VoucherForm from '../../components/voucher/VoucherType';
// import BottomArea from '../../components/common/BottomArea';

// const Voucher = ({navigation}) => {
//   const [voucherInfo, setVoucherInfo] = useState({
//     voucherNumber: '',
//     dueDate: new Date(),
//   });

//   const [voucherForm, setVoucherForm] = useState({
//     type: 'Payment',
//     partyName: '',
//     invoice: '',
//     amount: '',
//     paymentMethod: 'Bank',
//     bankName: '',
//     referenceNo: '',
//     narration: '',
//     fromLedger: '',
//     toLedger: '',
//     debitLedger: '',
//     creditLedger: '',
//   });

//   const handleVoucherInfoChange = (key, value) => {
//     setVoucherInfo(prev => ({...prev, [key]: value}));
//   };

//   const handleVoucherFormChange = (key, value) => {
//     setVoucherForm(prev => ({...prev, [key]: value}));
//   };

//   const handleSubmit = () => {
//     const combinedData = {...voucherInfo, ...voucherForm};
//     console.log('Submitting voucher:', combinedData);
//     // TODO: API call or validation
//   };

//   return (
//     <>
//       <Header
//         title="Create Vouchers"
//         leftIcon="chevron-left"
//         onLeftPress={() => navigation.goBack()}
//       />
//       <ScrollView style={styles.container}>
//         <VoucherInfo data={voucherInfo} onChange={handleVoucherInfoChange} />
//         <VoucherForm data={voucherForm} onChange={handleVoucherFormChange} />
//         <BottomArea buttonText="Submit Voucher" showSecondButton={true} onPress={handleSubmit} />
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 8,
//     backgroundColor: Colors.backgroundColorPrimary,
//     marginBottom: 8,
//   },
// });

// export default Voucher;