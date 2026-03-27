import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import Header from '../../components/common/Header';
import Colors from '../../utils/Colors';
import CustomBottomButton from '../../components/common/BottomButton';
import VoucherDisplayStyles from './css/VoucherDisplayStyles';

// Common Voucher Component
const CommonVoucher = ({data, voucherType}) => {
  const renderVoucherFields = () => {
    switch (voucherType) {
      case 'payment':
        return (
          <>
            {/* Voucher Number - with background */}
            <View style={VoucherDisplayStyles.fieldContainerWithBg}>
              <Text style={VoucherDisplayStyles.fieldLabel}>
                Voucher Number
              </Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.voucherNumber}
              </Text>
            </View>

            {/* Date - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Date</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.date}</Text>
            </View>

            {/* Mode - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Mode</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.modeBank}{' '}
                <Text style={VoucherDisplayStyles.dotSeparator}>•</Text>{' '}
                {data.modeRefNo}
              </Text>
            </View>

            {/* Paid to - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Paid to</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.paidTo}</Text>
            </View>

            {/* Payment Reference - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>
                Payment Reference
              </Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.paymentReference}
              </Text>
            </View>

            {/* Amount - with background */}
            <View style={VoucherDisplayStyles.amountRow}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.amount}</Text>
            </View>
          </>
        );

      case 'receipt':
        return (
          <>
            {/* Voucher Number - with background */}
            <View style={VoucherDisplayStyles.fieldContainerWithBg}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Voucher Number</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.voucherNumber}</Text>
            </View>

            {/* Date - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Date</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.date}</Text>
            </View>

            {/* Mode - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Mode</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.modeBank}{' '}
                <Text style={VoucherDisplayStyles.dotSeparator}>•</Text>{' '}
                {data.modeRefNo}
              </Text>
            </View>

            {/* Received From - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Received From</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.receivedFrom}</Text>
            </View>

            {/* Payment Reference - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Payment Reference</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.paymentReference}</Text>
            </View>

            {/* Amount - with background */}
            <View style={VoucherDisplayStyles.amountRow}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.amount}</Text>
            </View>
          </>
        );

      case 'contra':
        return (
          <>
            {/* Voucher Number - with background */}
            <View style={VoucherDisplayStyles.fieldContainerWithBg}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Voucher Number</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.voucherNumber}</Text>
            </View>

            {/* Date - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Date</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.date}</Text>
            </View>

            {/* Type - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Type</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.type}</Text>
            </View>

            {/* From - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>From</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.from}</Text>
            </View>

            {/* To - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>To</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.to}</Text>
            </View>

            {/* Amount - with background */}
            <View style={VoucherDisplayStyles.amountRow}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.amount}</Text>
            </View>
          </>
        );

      case 'journal':
        return (
          <>
            {/* Voucher Number - with background */}
            <View style={VoucherDisplayStyles.fieldContainerWithBg}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Voucher Number</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.voucherNumber}</Text>
            </View>

            {/* Date - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Date</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.date}</Text>
            </View>

            {/* From - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>From</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.from}</Text>
            </View>

            {/* To - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>To</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.to}</Text>
            </View>

            {/* Amount - with background */}
            <View style={VoucherDisplayStyles.amountRow}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.amount}</Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={VoucherDisplayStyles.voucherContainer}>
      {renderVoucherFields()}

      {/* Narration Section */}
      <View style={VoucherDisplayStyles.narrationSection}>
        <Text style={VoucherDisplayStyles.narrationLabel}>Narration</Text>
        <TextInput
          style={VoucherDisplayStyles.narrationInput}
          placeholder="-"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
          defaultValue={data.narration}
        />
      </View>
    </View>
  );
};

const Vouchers = ({route, navigation}) => {
  const [voucherType, setVoucherType] = useState('payment');

  useEffect(() => {
    if (route.params?.type) {
      setVoucherType(route.params.type);
    }
  }, [route.params]);

  // Mock voucher data for each type
  const voucherData = {
    payment: {
      voucherNumber: 'SO-00637',
      date: '10 Jul 2025',
      modeBank: 'Bank - HDFC CA-1234',
      modeRefNo: 'Ref No - UTR 214589763',
      paidTo: 'Axis Steel',
      paymentReference: 'IV-87087',
      amount: '₹4,123.00',
      narration: '',
    },
    receipt: {
      voucherNumber: 'SO-00637',
      date: '10 Jul 2025',
      modeBank: 'Bank - HDFC CA-1234',
      modeRefNo: 'Ref No - UTR 214589763',
      receivedFrom: 'Axis Steel',
      paymentReference: 'IV-87087',
      amount: '₹4,123.00',
      narration: '',
    },
    contra: {
      voucherNumber: 'CON-0044',
      date: '09 Jul 2025',
      type: 'Cash to bank',
      from: 'Cash In Hand',
      to: 'HDFC Bank CA-1234',
      amount: '₹4,123.00',
      narration: '',
    },
    journal: {
      voucherNumber: 'JV-0312',
      date: '10 Jul 2025',
      from: 'ICICI Bank CA-0123',
      to: 'HDFC Bank CA-1234',
      amount: '₹4,123.00',
      narration: '',
    },
  };

  const getVoucherTitle = () => {
    switch (voucherType) {
      case 'payment':
        return 'Payment';
      case 'receipt':
        return 'Receipt';
      case 'contra':
        return 'Contra';
      case 'journal':
        return 'Journal';
      default:
        return 'Voucher';
    }
  };

  const getButtonText = () => {
    switch (voucherType) {
      case 'payment':
        return 'Share';
      case 'receipt':
        return 'Share';
      case 'contra':
        return 'Share';
      case 'journal':
        return 'Share';
      default:
        return 'Share';
    }
  };

  return (
    <View style={VoucherDisplayStyles.mainContainer}>
      <Header
        title={getVoucherTitle()}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={VoucherDisplayStyles.container}
        showsVerticalScrollIndicator={false}>
        <View style={VoucherDisplayStyles.card}>
          <CommonVoucher
            data={voucherData[voucherType]}
            voucherType={voucherType}
          />
        </View>
      </ScrollView>

      {/* Spacer between card and button */}
      <View style={VoucherDisplayStyles.bottomSpacer} />

      <CustomBottomButton buttonText={getButtonText()} />
    </View>
  );
};

const styles = StyleSheet.create({
  voucherContainer: {
    backgroundColor: '#FFFFFF',
  },
  // All other styles moved to VoucherDisplayStyles.js
});

export default Vouchers;
