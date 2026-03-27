import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import Colors from '../../utils/Colors';

const {width} = Dimensions.get('window');

const CashVsBankRatio = ({title, cashAmount, bankAmount, chartAmount}) => {
  // Convert amounts to numbers (remove ₹ and commas)
  const getNumericAmount = amountStr => {
    return parseFloat(amountStr.replace(/[₹,]/g, ''));
  };

  const cashValue = getNumericAmount(cashAmount);
  const bankValue = getNumericAmount(bankAmount);
  const totalValue = cashValue + bankValue;

  // Calculate percentages
  const cashPercentage = totalValue > 0 ? (cashValue / totalValue) * 100 : 0;
  const bankPercentage = totalValue > 0 ? (bankValue / totalValue) * 100 : 0;

  // Calculate angles for each segment
  const cashAngle = (cashPercentage / 100) * 360;
  const bankAngle = (bankPercentage / 100) * 360;

  const radius = 50;
  const centerX = 60;
  const centerY = 60;

  // Helper function to create arc path
  const createArcPath = (startAngle, endAngle, radius, centerX, centerY) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <View style={styles.ratioContainer}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          marginBottom: 10,
        }}>
        <Text style={styles.ratioTitle}>{title}</Text>
      </View>
      <View style={styles.ratioContent}>
        <View style={styles.chartContainer}>
          <Svg width={120} height={120}>
            {/* Background circle */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={12}
            />

            {/* Cash segment (Green) */}
            <Path
              d={createArcPath(0, cashAngle, radius, centerX, centerY)}
              fill="none"
              stroke="#10B981"
              strokeWidth={12}
              strokeLinecap="round"
            />

            {/* Bank segment (Blue) */}
            <Path
              d={createArcPath(cashAngle, 360, radius, centerX, centerY)}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={12}
              strokeLinecap="round"
            />
          </Svg>

          {/* Center text */}
          <View style={styles.chartCenter}>
            <Text style={styles.chartCenterText}>{chartAmount}</Text>
            <Text style={styles.chartCenterSubText}>Total</Text>
          </View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#10B981'}]} />
            <Text style={styles.legendText}>Cash</Text>
            <Text style={styles.legendValue}>{cashAmount}</Text>
            <Text style={styles.legendPercentage}>
              ({cashPercentage.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#3B82F6'}]} />
            <Text style={styles.legendText}>Bank</Text>
            <Text style={styles.legendValue}>{bankAmount}</Text>
            <Text style={styles.legendPercentage}>
              ({bankPercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ratioContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
  },
  ratioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  ratioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    marginRight: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  chartCenterSubText: {
    fontSize: 12,
    color: '#6B7280',
  },
  legendContainer: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginRight: 4,
  },
  legendPercentage: {
    fontSize: 12,
    color: '#666',
  },
});

export default CashVsBankRatio;
