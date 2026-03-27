import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import QuotationStyles from './css/QuotationStyles';

const QuotationsSummary = ({products = [], logistics = []}) => {
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
    let totalLogisticTax = 0;
    let totalLogisticCharges = 0;

    logistics.forEach(item => {
      const amount = parseFloat(item.amount?.replace(/[^\d.]/g, '') || 0);
      totalLogistics += amount;
      totalLogisticCharges += amount;

      // Calculate logistic tax
      const taxRateStr = (item.taxRate ?? '').toString().trim();
      if (taxRateStr) {
        const taxRate = parseFloat(taxRateStr.replace('%', '')) || 0;
        totalLogisticTax += (taxRate / 100) * amount;
      }
    });

    const grandTotal = productSubtotal - totalDiscounts + totalProductTax + totalLogistics + totalLogisticTax;

    return {
      productSubtotal,
      totalDiscounts,
      totalProductTax,
      totalLogistics,
      totalLogisticTax,
      totalLogisticCharges,
      grandTotal,
    };
  }, [products, logistics]);

  const hasData = products.length > 0 || logistics.length > 0;

  return (
    <View style={QuotationStyles.container}>
      {/* Summary Header */}
      <View style={QuotationStyles.headerContainer}>
        <Text style={QuotationStyles.titleBold}>Summary</Text>
      </View>

      <View
        style={[
          QuotationStyles.totalAmountContainer,
          {borderBottomWidth: expanded ? 1 : 1},
        ]}>
        <View style={QuotationStyles.leftSection}>
          <Text style={QuotationStyles.textGray}>Grand Total</Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#8A8A8E"
              style={QuotationStyles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={QuotationStyles.rightSection}>
          <Feather name="refresh-ccw" size={18} color="#6B7280" />
          <Text style={QuotationStyles.amountText20}>
            ₹{calculations.grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </Text>
        </View>
      </View>

      {/* Expanded Details - Only show when there's data */}
      {expanded && hasData && (
        <View style={QuotationStyles.detailsContainer}>
          <View style={QuotationStyles.innerContainer}>
            {products.length > 0 && (
              <>
                <View style={QuotationStyles.rowWithBorder}>
                  <Text style={QuotationStyles.textGray}>Subtotal</Text>
                  <Text style={QuotationStyles.amount}>
                    ₹{calculations.productSubtotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </Text>
                </View>
                {calculations.totalDiscounts > 0 && (
                  <View style={QuotationStyles.rowWithBorder}>
                    <Text style={QuotationStyles.textGray}>Discounts</Text>
                    <Text style={QuotationStyles.amount}>
                      ₹{calculations.totalDiscounts.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
                {calculations.totalProductTax > 0 && (
                  <View style={QuotationStyles.rowWithBorder}>
                    <Text style={QuotationStyles.textGray}>Product Tax</Text>
                    <Text style={QuotationStyles.amount}>
                      ₹{calculations.totalProductTax.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
              </>
            )}
            {logistics.length > 0 && (
              <>
                {calculations.totalLogisticCharges > 0 && (
                  <View style={QuotationStyles.rowWithBorder}>
                    <Text style={QuotationStyles.textGray}>Logistic Changes</Text>
                    <Text style={QuotationStyles.amount}>
                      ₹{calculations.totalLogisticCharges.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
                {calculations.totalLogistics > 0 && (
                  <View style={QuotationStyles.rowWithBorder}>
                    <Text style={QuotationStyles.textGray}>Logistics</Text>
                    <Text style={QuotationStyles.amount}>
                      ₹{calculations.totalLogistics.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
                {calculations.totalLogisticTax > 0 && (
                  <View style={QuotationStyles.rowWithBorder}>
                    <Text style={QuotationStyles.textGray}>Logistic Tax</Text>
                    <Text style={QuotationStyles.amount}>
                      ₹{calculations.totalLogisticTax.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // All styles moved to QuotationStyles.js
});

export default QuotationsSummary;
