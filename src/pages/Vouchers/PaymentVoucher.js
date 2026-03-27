import React, {useRef} from 'react';
import {ScrollView, View, StyleSheet, Platform} from 'react-native';
import Header from '../../components/common/Header';
import VoucherInfo from '../../components/voucher/VoucherInfo';
import PaymentVoucherForm from '../../components/voucher/PaymentVoucherForm';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const PaymentVoucher = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Payment Voucher"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          commonScreenStyles.scrollContent,
          isKeyboardVisible && styles.keyboardPadding,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <VoucherInfo />
        <PaymentVoucherForm
          scrollViewRef={scrollViewRef}
          isKeyboardVisible={isKeyboardVisible}
        />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText="Submit Payment" showSecondButton={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 200,
  },
});

export default PaymentVoucher;
