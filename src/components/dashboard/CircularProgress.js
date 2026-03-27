import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

/**
 * BalanceIndicator - Circular progress indicator for net cash
 * @param {Object} data - JSON data object from API
 * @param {Object} data.netCash - Net cash information
 * @param {number} data.netCash.x - Current value (part of y)
 * @param {number} data.netCash.y - Total value (larger value)
 * @param {string} data.netCash.amount - Amount to display (formatted string)
 * @param {string} data.netCash.updatedTime - Time since last update
 * @param {number} data.netCash.progress - Optional: Direct progress percentage (0-100). If not provided, calculated from x/y
 */
const BalanceIndicator = ({data}) => {
  // Extract values from data object with fallbacks
  const x = data?.netCash?.x ?? 0;
  const y = data?.netCash?.y ?? 100;
  const amount = data?.netCash?.amount ?? '0';
  const updatedTime = data?.netCash?.updatedTime ?? 'just now';
  
  // Calculate progress: if direct progress is provided, use it; otherwise calculate from x/y ratio
  const directProgress = data?.netCash?.progress;
  const calculatedProgress = y > 0 ? Math.min((x / y) * 100, 100) : 0;
  const progress = directProgress !== undefined ? directProgress : calculatedProgress;

  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.balanceContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ECEFF7"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#54C392"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>

      {/* Text inside the Circular Progress */}
      <View style={styles.innerTextContainer}>
        <Text style={styles.balanceLabel}>Net Cash</Text>
        <Text style={styles.balanceAmount}>₹{amount}</Text>
        <Text style={styles.updatedText}>Updated {updatedTime} ago</Text>
      </View>

      {/* Income and Outcome Indicator */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, {backgroundColor: '#ECEFF7'}]} />
          <Text style={styles.legendText}>Outcome</Text>
        </View>
        <View style={{paddingHorizontal: 5}}></View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, {backgroundColor: '#54C392'}]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  innerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '33%',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  updatedText: {
    fontSize: 10,
    color: 'gray',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLine: {
    width: 25,
    height: 6,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#8F939E',
  },
});

export default BalanceIndicator;
