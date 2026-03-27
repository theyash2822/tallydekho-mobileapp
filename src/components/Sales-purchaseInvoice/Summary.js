import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import PaymentDropdown from './PaymentStatus';

const Summary = ({
  showPaymentDropdown = false,
  onExpand,
  products = [],
  logistics = [],
}) => {
  const [expanded, setExpanded] = useState(true);

  // Calculate totals
  const calculations = useMemo(() => {
    // Product calculations
    let productSubtotal = 0;
    let totalDiscounts = 0;
    let totalProductTax = 0;

    products.forEach(item => {
      const qty = parseFloat(item.qty?.replace(/[^\d.]/g, '') || 0);
      const unitPrice = parseFloat(item.unitPrice?.replace(/[^\d.]/g, '') || 0);
      const baseAmount = qty * unitPrice;

      // Calculate discount
      const discountStr = (item.discount ?? '').toString().trim();
      let discountAmount = 0;
      if (discountStr) {
        if (discountStr.includes('%')) {
          // Percentage: multiply qty * unitPrice, then apply percentage
          const discountPercent = parseFloat(discountStr.replace('%', '')) || 0;
          discountAmount = (discountPercent / 100) * baseAmount;
        } else {
          // Flat amount: use the value directly
          discountAmount = parseFloat(discountStr) || 0;
        }
      }
      totalDiscounts += discountAmount;

      // Calculate tax
      const taxStr = (item.tax ?? '').toString().trim();
      let taxAmount = 0;
      if (taxStr) {
        if (taxStr.includes('%')) {
          // Percentage: multiply qty * unitPrice, then apply percentage
          const taxPercent = parseFloat(taxStr.replace('%', '')) || 0;
          taxAmount = (taxPercent / 100) * baseAmount;
        } else {
          // Flat amount: use the value directly
          taxAmount = parseFloat(taxStr) || 0;
        }
      }
      totalProductTax += taxAmount;

      productSubtotal += baseAmount;
    });

    // Logistics calculations
    let totalLogistics = 0;
    logistics.forEach(item => {
      const amount = parseFloat(item.amount?.replace(/[^\d.]/g, '') || 0);
      totalLogistics += amount;
    });

    const grandTotal = productSubtotal - totalDiscounts + totalProductTax + totalLogistics;

    return {
      productSubtotal,
      totalDiscounts,
      totalProductTax,
      totalLogistics,
      grandTotal,
    };
  }, [products, logistics]);

  const hasData = products.length > 0 || logistics.length > 0;

  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Summary</Text>
      </View>

      <View
        style={[
          styles.totalAmountContainer,
          {borderBottomWidth: expanded ? 1 : 1},
        ]}>
        <View style={styles.leftSection}>
          <Text style={styles.textGray}>Total amount</Text>
          <TouchableOpacity
            onPress={() => {
              const newExpanded = !expanded;
              setExpanded(newExpanded);
              // Auto-scroll when expanding
              if (newExpanded && onExpand) {
                setTimeout(() => {
                  onExpand();
                }, 100);
              }
            }}>
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#8A8A8E"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rightSection}>
          {/* <Feather name="refresh-ccw" size={18} color="#6B7280" /> */}
          <Text style={styles.amountText}>
            ₹{calculations.grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </Text>
        </View>
      </View>
      {/* Expanded Details - Only show when there's data */}
      {expanded && hasData && (
        <View style={styles.detailsContainer}>
          <View style={styles.innerContainer}>
            {products.length > 0 && (
              <>
                <View style={styles.row}>
                  <Text style={styles.textGray}>Subtotal</Text>
                  <Text style={styles.amount}>
                    ₹{calculations.productSubtotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </Text>
                </View>
                {calculations.totalProductTax > 0 && (
                  <View style={styles.row}>
                    <Text style={styles.textGray}>Taxes</Text>
                    <Text style={styles.amount}>
                      ₹{calculations.totalProductTax.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
                {calculations.totalDiscounts > 0 && (
                  <View style={styles.row}>
                    <Text style={styles.textGray}>Discount</Text>
                    <Text style={styles.amount}>
                      ₹{calculations.totalDiscounts.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
              </>
            )}
            {logistics.length > 0 && calculations.totalLogistics > 0 && (
              <View style={styles.row}>
                <Text style={styles.textGray}>Logistics</Text>
                <Text style={styles.amount}>
                  ₹{calculations.totalLogistics.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      {showPaymentDropdown && <PaymentDropdown onExpand={onExpand} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    backgroundColor: Colors.white,
    marginTop: 10,
  },
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  innerContainer: {
    backgroundColor: '#F7F9FC',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
  },
  textGray: {
    color: '#8A8A8E',
    fontSize: 14,
  },
  amountText: {
    color: '#16C47F',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 5,
  },
  detailsContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  amount: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Summary;
