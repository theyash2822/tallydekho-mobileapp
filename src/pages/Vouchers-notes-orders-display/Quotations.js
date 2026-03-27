import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import Header from '../../components/common/Header';
import Colors from '../../utils/Colors';
import CustomBottomButton from '../../components/common/BottomButton';
import VoucherDisplayStyles from './css/VoucherDisplayStyles';

// Common Summary Component (same as Invoices)
const CommonSummary = ({ data, isSales }) => {
  return (
    <View
      style={[
        VoucherDisplayStyles.summarySection,
        {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      ]}>
      {/* Discount */}
      <View style={VoucherDisplayStyles.summaryRow}>
        <Text style={VoucherDisplayStyles.summaryLabel}>Discount</Text>
        <Text style={VoucherDisplayStyles.summaryValue}>
          {data.discount} <Text style={VoucherDisplayStyles.divider}>|</Text>{' '}
          {data.discountAmount}
        </Text>
      </View>

      {/* Shipping */}
      <View style={VoucherDisplayStyles.summaryRow}>
        <Text style={VoucherDisplayStyles.summaryLabel}>
          Logistic - Shipping Charges
        </Text>
        <Text style={VoucherDisplayStyles.summaryValue}>{data.shipping}</Text>
      </View>

      {/* Taxes */}
      <View style={VoucherDisplayStyles.summaryRow}>
        <Text style={VoucherDisplayStyles.summaryLabel}>Taxes</Text>
        <Text style={VoucherDisplayStyles.summaryValue}>
          CGST 9% <Text style={VoucherDisplayStyles.divider}>|</Text>{' '}
          {data.cgst}
        </Text>
      </View>
      <View style={VoucherDisplayStyles.summaryRow}>
        <Text style={VoucherDisplayStyles.summaryLabel}></Text>
        <Text style={VoucherDisplayStyles.summaryValue}>
          SGST 9% <Text style={VoucherDisplayStyles.divider}>|</Text>{' '}
          {data.sgst}
        </Text>
      </View>

      <View
        style={{
          padding: 10,
          backgroundColor: '#fff',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}>
        <View style={VoucherDisplayStyles.summaryRow}>
          <Text style={VoucherDisplayStyles.summaryLabel}>Sub-Total</Text>
          <Text style={VoucherDisplayStyles.summaryValue}>{data.subTotal}</Text>
        </View>
        <View style={VoucherDisplayStyles.summaryRow}>
          <Text style={VoucherDisplayStyles.summaryLabel}>GST</Text>
          <Text style={VoucherDisplayStyles.summaryValue}>{data.gst}</Text>
        </View>
        <View
          style={[
            VoucherDisplayStyles.summaryRow,
            VoucherDisplayStyles.grandTotalRow,
          ]}>
          <Text style={VoucherDisplayStyles.grandTotalLabel}>Grand Total</Text>
          <Text style={VoucherDisplayStyles.summaryValue}>
            {data.grandTotal}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Common Quotation Details Component
const CommonQuotationDetails = ({ data }) => {
  return (
    <>
      {/* Customer Details */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>Customer</Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>
          {data.customer}
        </Text>
      </View>

      {/* Date */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>Date</Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>{data.date}</Text>
      </View>

      {/* Valid Till */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>Valid Till</Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>
          {data.validTill}
        </Text>
      </View>

      {/* Table Section */}
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          marginTop: 10,
          overflow: 'hidden',
        }}>
        <View style={VoucherDisplayStyles.tableHeader}>
          <Text style={VoucherDisplayStyles.headerCellId}>#</Text>
          <Text style={VoucherDisplayStyles.headerCellItem}>ITEM</Text>
          <Text style={VoucherDisplayStyles.headerCellQty}>QTY</Text>
          <Text style={VoucherDisplayStyles.headerCellPrice}>PRICE</Text>
        </View>

        {/* Table Rows */}
        {data.items.map((item, index) => (
          <View key={index} style={VoucherDisplayStyles.tableRow}>
            <Text style={VoucherDisplayStyles.cellId}>{item.srNo}</Text>
            <Text style={VoucherDisplayStyles.cellItem}>{item.name}</Text>
            <Text style={VoucherDisplayStyles.cellQty}>{item.quantity}</Text>
            <Text style={VoucherDisplayStyles.cellPrice}>{item.price}</Text>
          </View>
        ))}

        {/* Common Summary Component */}
        <CommonSummary data={data} />
      </View>

      {/* Narration Section */}
      <View style={VoucherDisplayStyles.narrationSectionPadding}>
        <Text style={VoucherDisplayStyles.narrationLabel14}>Narration</Text>
        <TextInput
          style={VoucherDisplayStyles.narrationInput40}
          placeholder="-"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
          defaultValue={data.narration}
        />
      </View>
    </>
  );
};

const Quotations = ({ route, navigation }) => {
  // Mock quotation data
  const quotationData = {
    voucherNumber: 'QT-00218',
    gstin: '27AACD1234F1Z5',
    customer: 'PQR Exports',
    date: '11 Jul 2025',
    validTill: '22 Jul 2025',
    items: [
      {
        srNo: '1',
        name: 'A101',
        quantity: '50 pcs X 700',
        price: '₹35,000',
      },
      {
        srNo: '2',
        name: 'B204',
        quantity: '10 pcs X 550',
        price: '₹35,000',
      },
    ],
    discount: '5%',
    discountAmount: '₹218,900',
    shipping: '₹123,900',
    cgst: '₹228,900',
    sgst: '₹228,900',
    subTotal: '₹457,600',
    gst: '₹456,700',
    grandTotal: '₹5,456,700',
    narration: '',
  };

  return (
    <>
      <View style={VoucherDisplayStyles.mainContainer}>
        <Header
          title="Quotation"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        <ScrollView
          style={VoucherDisplayStyles.container}
          showsVerticalScrollIndicator={false}>
          <View style={VoucherDisplayStyles.card}>
            {/* Voucher Number and GSTIN in same row */}
            <View style={VoucherDisplayStyles.topRow}>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={VoucherDisplayStyles.topValueContainer}>
                  <Text style={VoucherDisplayStyles.topLabel}>
                    Voucher Number
                  </Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {quotationData.voucherNumber}
                  </Text>
                </View>
              </View>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={[VoucherDisplayStyles.topValueContainer, { marginLeft: 10 }]}>
                  <Text style={VoucherDisplayStyles.topLabel}>GSTIN</Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {quotationData.gstin}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quotation Details */}
            <CommonQuotationDetails data={quotationData} />
          </View>
        </ScrollView>

        {/* Spacer between card and button */}
        <View style={VoucherDisplayStyles.bottomSpacer20} />

        {/* Action Buttons */}
        <CustomBottomButton
          buttonText="Share"
          secondButtonText="Convert Order"
          showSecondButton
          secondButtonColor="#F7F9FC"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // All styles moved to VoucherDisplayStyles.js
});

export default Quotations;
