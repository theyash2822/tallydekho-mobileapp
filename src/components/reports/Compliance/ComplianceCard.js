import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Svg, {Circle, Text as SvgText, Path} from 'react-native-svg';
import Colors from '../../../utils/Colors';
import {Icons} from '../../../utils/Icons';

const {width} = Dimensions.get('window');

const ComplianceCard = ({
  onPress,
  data = {currentMonth: 'Jul'}, // API data: currentMonth indicates filing progress
}) => {
  const graphWidth = width - 80;
  const graphHeight = 140;
  const centerX = graphWidth / 2;
  const centerY = graphHeight - 20;
  const radius = 70;

  // All months in chronological order (starting from Jan)
  const allMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Get current month from API data
  const currentMonth = data.currentMonth || 'Mar';
  const currentMonthIndex = allMonths.indexOf(currentMonth);

  // Calculate filed and unfiled months based on current month
  // Filed months: Jan to currentMonth (green)
  // Unfiled months: months after currentMonth (gray)
  const filedMonths = allMonths.slice(0, currentMonthIndex + 1);
  const unfiledMonths = allMonths.slice(currentMonthIndex + 1);

  // Calculate positions for month labels around the arc
  const getMonthPosition = (month, index) => {
    // Arc goes from left to right (180° to 0°), but months are in chronological order
    const angle = Math.PI - (index / (allMonths.length - 1)) * Math.PI;
    const labelRadius = radius + 20;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY - labelRadius * Math.sin(angle);

    return {x, y};
  };

  // Create continuous arc segments
  const createArcSegments = () => {
    const segments = [];
    const totalMonths = allMonths.length;

    // Create one continuous green arc for filed months (Jan to currentMonth)
    if (currentMonthIndex >= 0) {
      const filedStartIndex = 0; // Always start from Jan
      const filedEndIndex = currentMonthIndex;

      const startAngle =
        Math.PI - (filedStartIndex / (totalMonths - 1)) * Math.PI;
      const endAngle = Math.PI - (filedEndIndex / (totalMonths - 1)) * Math.PI;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY - radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY - radius * Math.sin(endAngle);

      // For a semi-circle, we never need largeArcFlag since max arc is 180°
      segments.push(
        <Path
          key="filed-arc"
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
          stroke="#10B981"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />,
      );
    }

    return segments;
  };

  // Calculate needle position to point at current month
  const needleAngle = Math.PI - (currentMonthIndex / (allMonths.length - 1)) * Math.PI;
  const needleLength = radius - 10;
  const needleX = centerX + needleLength * Math.cos(needleAngle);
  const needleY = centerY - needleLength * Math.sin(needleAngle);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Icons.ComplianceIcon height={20} width={20} />
          </View>
          <Text style={styles.title}>Compliance</Text>
        </View>
        <Icon name="chevron-right" size={16} color="#6B7280" />
      </View>

      <View style={styles.content}>
        <Text style={styles.gstTitle}>GST filed</Text>

        <View style={styles.gaugeContainer}>
          <Svg width={graphWidth} height={graphHeight}>
            {/* Background arc - full semi-circle */}
            <Path
              d={`M ${
                centerX - radius
              } ${centerY} A ${radius} ${radius} 0 0 1 ${
                centerX + radius
              } ${centerY}`}
              stroke="#F3F4F6"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            {/* Arc segments */}
            {createArcSegments()}
            {/* Month labels around the arc */}
            {allMonths.map((month, index) => {
              const isFiled = filedMonths.includes(month);
              const pos = getMonthPosition(month, index);

              return (
                <SvgText
                  key={month}
                  x={pos.x}
                  y={pos.y}
                  fontSize="11"
                  fill={isFiled ? '#10B981' : '#9CA3AF'}
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="middle">
                  {month}
                </SvgText>
              );
            })}

            {/* Needle */}
            <Path
              d={`M ${centerX} ${centerY} L ${needleX} ${needleY}`}
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Pivot point */}
            <Circle cx={centerX} cy={centerY} r="3" fill="#000" />
          </Svg>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, {backgroundColor: '#10B981'}]} />
            <Text style={styles.statusText}>Filed</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, {backgroundColor: '#E5E7EB'}]} />
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECEFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  content: {
    alignItems: 'center',
  },
  gstTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryTitle,
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
});

export default ComplianceCard;
