import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import Header from '../../components/common/Header';
import Colors from '../../utils/Colors';
import CustomBottomButton from '../../components/common/BottomButton';
import VoucherDisplayStyles from './css/VoucherDisplayStyles';

const Invoices = ({ route, navigation }) => {
  const [invoiceType, setInvoiceType] = useState('sales');

  useEffect(() => {
    if (route.params?.type) {
      setInvoiceType(route.params.type);
    }
  }, [route.params]);

  // Mock voucher data - in real app this would come from route params or API
  const salesVoucherData = {
    invoiceNumber: 'SI-30975',
    gstin: '27AACD1234F1Z5',
    customer: 'ABC Traders',
    shipTo: '52, MIDC, Nashik 422010',
    date: '10 Jul 2025',
    dueDate: '26 Jul 2025',
    items: [
      { id: 1, item: 'A101', qty: '50 pcs X 700', price: '₹35,000' },
      { id: 2, item: 'B204', qty: '10 pcs X 550', price: '₹35,000' },
    ],
    discount: '15%',
    discountAmount: '₹218,900',
    shippingCharges: '₹123,900',
    cgst: '₹228,900',
    sgst: '₹228,900',
    subTotal: '₹457,600',
    gst: '₹456,700',
    grandTotal: '₹5,456,700',
    narration: '',
  };

  const purchaseVoucherData = {
    invoiceNumber: 'PINV-20512',
    gstin: '27AACD1234F1Z5',
    supplier: 'Axis Steel',
    poNumber: 'PO-00821',
    date: '10 Jul 2025',
    items: [
      { id: 1, item: 'HR-Sheet 2 mm', qty: '150 kg x 650', price: '₹97,000' },
      { id: 2, item: 'Packing Lot', qty: '1 lot x 8 000', price: '₹8,000' },
    ],
    discount: '15%',
    discountAmount: '₹218,900',
    shippingCharges: '₹123,900',
    cgst: '₹228,900',
    sgst: '₹228,900',
    subTotal: '₹457,600',
    gst: '₹456,700',
    grandTotal: '₹5,456,700',
    narration: '',
  };

  // Common Summary Component
  const CommonSummary = ({ data }) => {
    return (
      <View
        style={[
          VoucherDisplayStyles.summarySection,
          {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        ]}>
        <View style={VoucherDisplayStyles.summaryRow}>
          <Text style={VoucherDisplayStyles.summaryLabel}>Discount</Text>
          <Text style={VoucherDisplayStyles.summaryValue}>
            {data.discount} <Text style={VoucherDisplayStyles.divider}>|</Text>{' '}
            {data.discountAmount}
          </Text>
        </View>
        <View style={VoucherDisplayStyles.summaryRow}>
          <Text style={VoucherDisplayStyles.summaryLabel}>
            Logistic - Shipping Charges
          </Text>
          <Text style={VoucherDisplayStyles.summaryValue}>
            {data.shippingCharges}
          </Text>
        </View>
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
            <Text style={VoucherDisplayStyles.summaryValue}>
              {data.subTotal}
            </Text>
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
            <Text style={VoucherDisplayStyles.grandTotalLabel}>
              Grand Total
            </Text>
            <Text style={VoucherDisplayStyles.summaryValue}>
              {data.grandTotal}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Common Invoice Details Component
  const CommonInvoiceDetails = ({ data, isSales = false }) => {
    return (
      <>
        {/* Customer/Supplier Details */}
        {isSales ? (
          <>
            <View style={VoucherDisplayStyles.detailRow}>
              <Text style={VoucherDisplayStyles.detailLabel}>Customer</Text>
              <Text style={VoucherDisplayStyles.detailValueNoBg}>
                {data.customer}
              </Text>
            </View>
            <View style={VoucherDisplayStyles.detailRow}>
              <Text style={VoucherDisplayStyles.detailLabel}>Ship to</Text>
              <Text style={VoucherDisplayStyles.detailValueNoBg}>
                {data.shipTo}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={VoucherDisplayStyles.detailRow}>
              <Text style={VoucherDisplayStyles.detailLabel}>Supplier</Text>
              <Text style={VoucherDisplayStyles.detailValueNoBg}>
                {data.supplier}
              </Text>
            </View>
            <View style={VoucherDisplayStyles.detailRow}>
              <Text style={VoucherDisplayStyles.detailLabel}>PO Number</Text>
              <Text style={VoucherDisplayStyles.detailValueNoBg}>
                {data.poNumber}
              </Text>
            </View>
          </>
        )}

        <View style={VoucherDisplayStyles.detailRow}>
          <Text style={VoucherDisplayStyles.detailLabel}>Date</Text>
          <Text style={VoucherDisplayStyles.detailValueNoBg}>{data.date}</Text>
        </View>

        {isSales && (
          <View style={VoucherDisplayStyles.detailRow}>
            <Text style={VoucherDisplayStyles.detailLabel}>Due Date</Text>
            <Text style={VoucherDisplayStyles.detailValueNoBg}>
              {data.dueDate}
            </Text>
          </View>
        )}

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
            <View key={item.id} style={VoucherDisplayStyles.tableRow}>
              <Text style={VoucherDisplayStyles.cellId}>{item.id}</Text>
              <Text style={VoucherDisplayStyles.cellItem}>{item.item}</Text>
              <Text style={VoucherDisplayStyles.cellQty}>{item.qty}</Text>
              <Text style={VoucherDisplayStyles.cellPrice}>{item.price}</Text>
            </View>
          ))}

          {/* Common Summary Component */}
          <CommonSummary data={data} />
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

  // Function to render sales voucher screen
  const renderSalesInvoice = () => {
    const data = salesVoucherData;
    return (
      <>
        <ScrollView
          style={VoucherDisplayStyles.container}
          showsVerticalScrollIndicator={false}>
          {/* Complete Invoice Card - Everything in One Card */}
          <View style={VoucherDisplayStyles.card}>
            {/* Invoice Number and GSTIN in same row */}
            <View style={VoucherDisplayStyles.topRow}>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={VoucherDisplayStyles.topValueContainer}>
                  <Text style={VoucherDisplayStyles.topLabel}>
                    Invoice Number
                  </Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {data.invoiceNumber}
                  </Text>
                </View>
              </View>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={[VoucherDisplayStyles.topValueContainer, { marginLeft: 10 }]}>
                  <Text style={VoucherDisplayStyles.topLabel}>GSTIN</Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {data.gstin}
                  </Text>
                </View>
              </View>
            </View>

            {/* Common Invoice Details Component */}
            <CommonInvoiceDetails data={data} isSales={true} />
          </View>
        </ScrollView>

        {/* Spacer between card and button */}
        <View style={VoucherDisplayStyles.bottomSpacer} />

        <CustomBottomButton buttonText="Share" />
      </>
    );
  };

  // Function to render purchase voucher screen
  const renderPurchaseInvoice = () => {
    const data = purchaseVoucherData;
    return (
      <>
        <ScrollView
          style={VoucherDisplayStyles.container}
          showsVerticalScrollIndicator={false}>
          {/* Invoice Details Card */}
          <View style={VoucherDisplayStyles.card}>
            {/* Invoice Number and Supplier GSTIN in same row */}
            <View style={VoucherDisplayStyles.topRow}>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={VoucherDisplayStyles.topValueContainer}>
                  <Text style={VoucherDisplayStyles.topLabel}>
                    Invoice Number
                  </Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {data.invoiceNumber}
                  </Text>
                </View>
              </View>
              <View style={VoucherDisplayStyles.topColumn}>
                <View style={[VoucherDisplayStyles.topValueContainer, { marginLeft: 10 }]}>
                  <Text style={VoucherDisplayStyles.topLabel}>
                    Supplier GSTIN
                  </Text>
                  <Text style={VoucherDisplayStyles.topValue}>
                    {data.gstin}
                  </Text>
                </View>
              </View>
            </View>

            {/* Supplier, PO Number, Date in separate rows */}
            <CommonInvoiceDetails data={data} isSales={false} />
          </View>
        </ScrollView>

        {/* Spacer between card and button */}
        <View style={VoucherDisplayStyles.bottomSpacer} />

        <CustomBottomButton
          buttonText="Share"
          secondButtonText="Convert Invoice"
          showSecondButton
          secondButtonColor="#F7F9FC"
        />
      </>
    );
  };

  return (
    <View style={VoucherDisplayStyles.mainContainer}>
      <Header
        title={invoiceType === 'sales' ? 'Sales Invoice' : 'Purchase Invoice'}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Conditional rendering based on voucher type */}
      {invoiceType === 'sales' ? renderSalesInvoice() : renderPurchaseInvoice()}
    </View>
  );
};

const styles = StyleSheet.create({
  // All styles moved to VoucherDisplayStyles.js
});

export default Invoices;
