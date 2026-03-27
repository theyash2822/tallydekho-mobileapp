import React, {useRef} from 'react';
import {ScrollView, View, StyleSheet, Platform} from 'react-native';
import Header from '../../components/common/Header';
import VoucherInfo from '../../components/voucher/VoucherInfo';
import ReceiptVoucherForm from '../../components/voucher/ReceiptVoucherForm';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const ReceiptVoucher = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Receipt Voucher"
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
        <ReceiptVoucherForm
          scrollViewRef={scrollViewRef}
          isKeyboardVisible={isKeyboardVisible}
        />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText="Submit Receipt" showSecondButton={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
});

export default ReceiptVoucher;
