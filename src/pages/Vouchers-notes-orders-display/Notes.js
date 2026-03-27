import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import Header from '../../components/common/Header';
import Colors from '../../utils/Colors';
import CustomBottomButton from '../../components/common/BottomButton';
import VoucherDisplayStyles from './css/VoucherDisplayStyles';

// Common Note Component
const CommonNote = ({data, noteType}) => {
  const renderNoteFields = () => {
    switch (noteType) {
      case 'credit':
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

            {/* Customer - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Customer</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.customer}
              </Text>
            </View>

            {/* Against - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Against</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.against}
              </Text>
            </View>

            {/* Item Details Table */}
            <View style={VoucherDisplayStyles.tableContainer}>
              <View style={VoucherDisplayStyles.tableHeader}>
                <Text style={VoucherDisplayStyles.tableHeaderSerial}>#</Text>
                <Text style={VoucherDisplayStyles.tableHeaderItem}>ITEM</Text>
                <Text style={VoucherDisplayStyles.tableHeaderQty}>QTY</Text>
                <Text style={VoucherDisplayStyles.tableHeaderPrice}>PRICE</Text>
              </View>
              {data.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    VoucherDisplayStyles.tableRow,
                    index === data.items.length - 1 && { borderBottomWidth: 0 },
                  ]}>
                  <Text style={VoucherDisplayStyles.tableCellSerial}>
                    {item.srNo}
                  </Text>
                  <Text style={VoucherDisplayStyles.tableCellItem}>
                    {item.name}
                  </Text>
                  <Text style={VoucherDisplayStyles.tableCellQty}>
                    {item.quantity}
                  </Text>
                  <Text style={VoucherDisplayStyles.tableCellPrice}>
                    {item.price}
                  </Text>
                </View>
              ))}
            </View>

            {/* Amount - with background */}
            <View
              style={[
                VoucherDisplayStyles.amountRowWithBorder,
                {
                  borderTopWidth: 0,
                  flexDirection: 'row',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                },
              ]}>
              <View style={{ flex: 5.5 }}>
                <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={VoucherDisplayStyles.tableCellPrice}>
                  {data.amount}
                </Text>
              </View>
            </View>
          </>
        );

      case 'debit':
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

            {/* Supplier - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Supplier</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.supplier}</Text>
            </View>

            {/* Against - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Against</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.against}</Text>
            </View>

            {/* Item Details Table */}
            <View style={VoucherDisplayStyles.tableContainer}>
              <View style={VoucherDisplayStyles.tableHeader}>
                <Text style={VoucherDisplayStyles.tableHeaderSerial}>#</Text>
                <Text style={VoucherDisplayStyles.tableHeaderItem}>ITEM</Text>
                <Text style={VoucherDisplayStyles.tableHeaderPrice}>PRICE</Text>
              </View>
              {data.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    VoucherDisplayStyles.tableRow,
                    index === data.items.length - 1 && { borderBottomWidth: 0 },
                  ]}>
                  <Text style={VoucherDisplayStyles.tableCellSerial}>{item.srNo}</Text>
                  <Text style={VoucherDisplayStyles.tableCellItem}>{item.name}</Text>
                  <Text style={VoucherDisplayStyles.tableCellPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
            {/* Amount - with background */}
            <View
              style={[
                VoucherDisplayStyles.amountRowWithBorder,
                {
                  borderTopWidth: 0,
                  flexDirection: 'row',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                },
              ]}>
              <View style={{ flex: 3.5 }}>
                <Text style={VoucherDisplayStyles.fieldLabel}>Amount</Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={VoucherDisplayStyles.tableCellPrice}>
                  {data.amount}
                </Text>
              </View>
            </View>
          </>
        );

      case 'delivery':
        return (
          <>
            {/* Voucher Number - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Voucher Number</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.voucherNumber}</Text>
            </View>

            {/* Date - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Date</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.date}</Text>
            </View>

            {/* Customer - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Customer</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.customer}</Text>
            </View>

            {/* Dispatch From - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Dispatch From</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.dispatchFrom}</Text>
            </View>

            {/* Ship to - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Ship to</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.shipTo}</Text>
            </View>

            {/* Dispatch Mode - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Dispatch Mode</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.dispatchMode}</Text>
            </View>

            {/* Vehicle / LR - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Vehicle / LR</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>
                {data.vehicle}{' '}
                <Text style={VoucherDisplayStyles.dashSeparator}>-</Text>{' '}
                {data.lrNumber}
              </Text>
            </View>

            {/* Against SO - white background with border */}
            <View style={VoucherDisplayStyles.fieldContainerWhite}>
              <Text style={VoucherDisplayStyles.fieldLabel}>Against SO</Text>
              <Text style={VoucherDisplayStyles.fieldValue}>{data.againstSO}</Text>
            </View>

            {/* Item Details Table */}
            <View
              style={[
                VoucherDisplayStyles.tableContainer,
                {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}>
              <View style={VoucherDisplayStyles.tableHeader}>
                <Text style={VoucherDisplayStyles.tableHeaderSerial}>#</Text>
                <Text style={VoucherDisplayStyles.tableHeaderItem}>ITEM</Text>
                <Text
                  style={[
                    VoucherDisplayStyles.tableHeaderQty,
                    { textAlign: 'right', marginRight: 16 },
                  ]}>
                  QTY
                </Text>
              </View>
              {data.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    VoucherDisplayStyles.tableRow,
                    index === data.items.length - 1 && { borderBottomWidth: 0 },
                  ]}>
                  <Text style={VoucherDisplayStyles.tableCellSerial}>{item.srNo}</Text>
                  <Text style={VoucherDisplayStyles.tableCellItem}>{item.name}</Text>
                  <Text
                    style={[
                      VoucherDisplayStyles.tableCellQty,
                      { textAlign: 'right' },
                    ]}>
                    {item.quantity}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Totals - white background with border */}
            <View
              style={[
                VoucherDisplayStyles.fieldContainerWhite,
                { marginTop: 10, backgroundColor: '#F4F5FA' },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <Text style={VoucherDisplayStyles.fieldLabel}>Total Packages</Text>
                <Text style={VoucherDisplayStyles.fieldValue}>
                  {data.totalPackages}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={VoucherDisplayStyles.fieldLabel}>Total Quantity</Text>
                <Text style={VoucherDisplayStyles.fieldValue}>
                  {data.totalQuantity}
                </Text>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={VoucherDisplayStyles.noteContainer}>
      {renderNoteFields()}

      {/* Narration Section */}
      <View style={VoucherDisplayStyles.narrationSection}>
        <Text style={VoucherDisplayStyles.narrationLabel}>Narration</Text>
        <TextInput
          style={VoucherDisplayStyles.narrationInput40}
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

const Notes = ({route, navigation}) => {
  const [noteType, setNoteType] = useState('credit');

  useEffect(() => {
    if (route.params?.type) {
      setNoteType(route.params.type);
    }
  }, [route.params]);

  // Mock note data for each type
  const noteData = {
    credit: {
      voucherNumber: 'CN-00712',
      date: '09 Jul 2025',
      customer: 'XYZ Retail',
      against: 'INV-30922',
      items: [
        {
          srNo: '1',
          name: 'HR-Sheet 2..',
          quantity: '10 pcs x 550',
          price: '-₹550,500',
        },
        {srNo: '2', name: 'GST 18%', quantity: '', price: '-₹99,000'},
      ],
      amount: '₹649,000',
      narration: '',
    },
    debit: {
      voucherNumber: 'DN-00112',
      date: '07 Jul 2025',
      supplier: 'ABC Steel',
      against: 'PINV-20509',
      items: [
        {
          srNo: '1',
          name: 'Quality claim charge',
          quantity: '',
          price: '-₹100,000',
        },
        {srNo: '2', name: 'GST 18%', quantity: '', price: '-₹18,000'},
      ],
      amount: '₹118,000',
      narration: '',
    },
    delivery: {
      voucherNumber: 'DN-00418',
      date: '09 Jul 2025 - 14:15',
      customer: 'ABC Traders',
      dispatchFrom: 'Warehouse Sitapura-2',
      shipTo: '52, MIDC, Nashik - 422 010',
      dispatchMode: 'By Road',
      vehicle: 'RJ 14 AB 1122',
      lrNumber: 'LR # 894673',
      againstSO: 'SO-00637',
      items: [
        {srNo: '1', name: 'A101 2 mm Sheet', quantity: '80 pcs'},
        {srNo: '2', name: 'B2307 Packing Set', quantity: '10 pcs'},
      ],
      totalPackages: '4 cartons',
      totalQuantity: '90 Pcs',
      narration: '',
    },
  };

  const getNoteTitle = () => {
    switch (noteType) {
      case 'credit':
        return 'Credit Note';
      case 'debit':
        return 'Debit Note';
      case 'delivery':
        return 'Delivery Note';
      default:
        return 'Note';
    }
  };

  const getButtonText = () => {
    switch (noteType) {
      case 'credit':
        return 'Share';
      case 'debit':
        return 'Share';
      case 'delivery':
        return 'Share';
      default:
        return 'Share';
    }
  };

  return (
    <View style={VoucherDisplayStyles.mainContainer}>
      <Header
        title={getNoteTitle()}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={VoucherDisplayStyles.container}
        showsVerticalScrollIndicator={false}>
        <View style={VoucherDisplayStyles.card}>
          <CommonNote data={noteData[noteType]} noteType={noteType} />
        </View>
      </ScrollView>

      {/* Spacer between card and button */}
      <View style={VoucherDisplayStyles.bottomSpacer} />

      <CustomBottomButton buttonText={getButtonText()} />
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: '#FFFFFF',
  },
  // All other styles moved to VoucherDisplayStyles.js
});

export default Notes;
