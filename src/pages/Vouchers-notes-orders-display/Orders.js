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

// Common Order Details Component
const CommonOrderDetails = ({ data, isSales }) => {
  return (
    <>
      {/* Customer/Supplier Details */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>
          {isSales ? 'Customer' : 'Supplier'}
        </Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>
          {data.customer}
        </Text>
      </View>

      {/* Date */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>Date</Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>{data.date}</Text>
      </View>

      {/* Delivery/Expected */}
      <View style={VoucherDisplayStyles.detailRow}>
        <Text style={VoucherDisplayStyles.detailLabel}>
          {isSales ? 'Delivery' : 'Expected'}
        </Text>
        <Text style={VoucherDisplayStyles.detailValueNoBg}>
          {data.deliveryDate}
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
        <CommonSummary data={data} isSales={isSales} />
      </View>

      {/* Narration Section */}
      <View style={VoucherDisplayStyles.narrationSectionPadding}>
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
    </>
  );
};

const Orders = ({ route, navigation }) => {
  const [orderType, setOrderType] = useState('sales');

  useEffect(() => {
    if (route.params?.type) {
      setOrderType(route.params.type);
    }
  }, [route.params]);

  // Mock order data for each type
  const orderData = {
    sales: {
      voucherNumber: 'SO-00637',
      gstin: '27AACD1234F1Z5',
      customer: 'PQR Exports',
      date: '05 Jul 2025',
      deliveryDate: '20 Jul 2025',
      items: [
        {
          srNo: '1',
          name: 'A101',
          quantity: '80/120 pcs x 700',
          price: '₹560,000',
        },
        {
          srNo: '2',
          name: 'B204',
          quantity: '10/10 pcs x 550',
          price: '₹550,000',
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
    },
    purchase: {
      voucherNumber: 'PO-00821',
      gstin: '27AACD1234F1Z5',
      customer: 'Axis Steel',
      date: '01 Jul 2025',
      deliveryDate: '15 Jul 2025',
      items: [
        {
          srNo: '1',
          name: 'HR-Sheet 2...',
          quantity: '150 kg x 650',
          price: '₹97,500',
        },
        {
          srNo: '2',
          name: 'Packing Lot',
          quantity: '1 lot x 8,000',
          price: '₹8,000',
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
    },
  };

  const getOrderTitle = () => {
    switch (orderType) {
      case 'sales':
        return 'Sales Order';
      case 'purchase':
        return 'Purchase Order';
      default:
        return 'Order';
    }
  };

  const getButtonText = () => {
    switch (orderType) {
      case 'sales':
        return 'Convert Invoice';
      case 'purchase':
        return 'Convert Invoice';
      default:
        return 'Convert Invoice';
    }
  };

  return (
    <>
      <View style={VoucherDisplayStyles.mainContainer}>
        <Header
          title={getOrderTitle()}
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
                    {orderData[orderType].voucherNumber}
                  </Text>
                </View>
              </View>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={[VoucherDisplayStyles.topValueContainer, { marginLeft: 10 }]}>
                  <Text style={VoucherDisplayStyles.topLabel}>GSTIN</Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {orderData[orderType].gstin}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Details */}
            <CommonOrderDetails
              data={orderData[orderType]}
              isSales={orderType === 'sales'}
            />
          </View>
        </ScrollView>

        {/* Spacer between card and button */}
        <View style={VoucherDisplayStyles.bottomSpacer20} />

        {/* Action Buttons */}
        <CustomBottomButton
          buttonText="Share"
          secondButtonText={getButtonText()}
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

export default Orders;
