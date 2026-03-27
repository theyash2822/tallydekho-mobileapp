import React, {useRef} from 'react';
import {ScrollView, View, StyleSheet, Platform} from 'react-native';
import Header from '../../components/common/Header';
import VoucherInfo from '../../components/voucher/VoucherInfo';
import JournalVoucherForm from '../../components/voucher/JournalVoucherForm';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const JournalVoucher = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Journal Voucher"
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
        <JournalVoucherForm
          scrollViewRef={scrollViewRef}
          isKeyboardVisible={isKeyboardVisible}
        />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText="Submit Journal"
        showSecondButton={true}
        secondButtonText="Share PDF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
});

export default JournalVoucher;
