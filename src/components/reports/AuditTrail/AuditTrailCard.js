import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';

const AuditTrailCard = ({onPress}) => {
  const [unreconciledCount, setUnreconciledCount] = useState(14);
  const [progressValue] = useState(new Animated.Value(0));
  const [totalVouchers] = useState(20);

  useEffect(() => {
    // Animate progress bar on mount
    Animated.timing(progressValue, {
      toValue: (unreconciledCount / totalVouchers) * 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [unreconciledCount, totalVouchers, progressValue]);

  const progressPercentage = (unreconciledCount / totalVouchers) * 100;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Icon name="hash" size={20} color="#8797C3" />
          </View>
          <Text style={styles.title}>Audit Trail</Text>
        </View>
        <Icon name="chevron-right" size={16} color="#6B7280" />
      </View>

      <View style={styles.content}>
        <View style={styles.metricContainer}>
          <Text style={styles.metricLabel}>Unreconciled vouchers</Text>
          <Text style={styles.metricValue}>{unreconciledCount}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressValue.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
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
    marginBottom: 12,
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
    marginBottom: 0,
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryTitle,
  },
  progressContainer: {
    marginBottom: 0,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
});

export default AuditTrailCard;
