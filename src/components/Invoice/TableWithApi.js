// /data/invoiceData.js

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../utils/Colors';

const invoiceData = {
  products: [
    {
      id: 1,
      product: 'Service #1',
      quantity: 1,
      tax: 12000,
      total: 12000,
    },
    {
      id: 2,
      product: 'Service #2',
      quantity: 2,
      tax: 15000,
      total: 30000,
    },
    {
      id: 3,
      product: 'Service #2',
      quantity: 3,
      tax: 15000,
      total: 40000,
    },
    {
      id: 4,
      product: 'Service #2',
      quantity: 5,
      tax: 10000,
      total: 22000,
    },
  ],
  summary: {
    subTotal: 96000,
    discount: '40%',
    tax: 'GST | 10.15%',
    logistics: 96000,
    validity: '30 days',
  },
};

const TableNew = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Simulating data fetch
    setProducts(invoiceData.products);
    setSummary(invoiceData.summary);

    // when using api just switch the above 2 lines with this
    // fetch('https://your-api.com/invoice')
    //   .then(res => res.json())
    //   .then(data => {
    //     setProducts(data.products);
    //     setSummary(data.summary);
    //   });
  }, []);

  return (
    <ScrollView style={styles.table}>
      {/* Table Header */}
      <View style={styles.tableRowHeader}>
        <Text style={[styles.tableHeaderText, styles.shrink]}>#</Text>
        <Text style={styles.tableHeaderText}>Product/s...</Text>
        <Text style={styles.tableHeaderText}>Qty.</Text>
        <Text style={styles.tableHeaderText}>Taxes</Text>
        <Text style={styles.tableHeaderText}>Total</Text>
      </View>

      {/* Table Rows */}
      {products.map((item, index) => (
        <React.Fragment key={item.id}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableText, styles.shrink]}>{index + 1}</Text>
            <Text style={styles.tableText}>{item.product}</Text>
            <Text style={styles.tableText}>{item.quantity}</Text>
            <Text style={styles.tableText}>₹{item.tax.toLocaleString()}</Text>
            <Text style={styles.tableText}>₹{item.total.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
        </React.Fragment>
      ))}

      {/* Invoice Summary */}
      {summary && (
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.grayText}>Sub total</Text>
            <Text style={styles.boldText}>
              ₹{summary.subTotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.grayText}>Discount</Text>
            <Text style={styles.boldText}>{summary.discount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.grayText}>Tax</Text>
            <Text style={styles.boldText}>{summary.tax}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.grayText}>Logistics</Text>
            <Text style={styles.boldText}>
              ₹{summary.logistics.toLocaleString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.grayText}>Validity period</Text>
            <Text style={styles.boldText}>{summary.validity}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 16,
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    backgroundColor: Colors.border,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  shrink: {
    flex: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
  },
  container: {
    padding: 10,
    backgroundColor: Colors.border,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  boldText: {
    fontWeight: '600',
    fontSize: 12,
    marginRight: 8,
  },
  grayText: {
    marginLeft: 8,
    color: '#7C7C7C',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});

export default TableNew;
