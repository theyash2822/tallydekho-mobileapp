import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      icon: 'file-plus',
      description: 'You created INV-30975.',
      timestamp: '5m ago',
    },
    {
      id: 2,
      icon: 'file-plus',
      description: 'You created INV-30975',
      timestamp: '5m ago',
    },
    {
      id: 3,
      icon: 'file-plus',
      description: 'You created INV-30975',
      timestamp: '5m ago',
    },
    {
      id: 4,
      icon: 'user',
      description: 'Rajesh generated 14 IRNs',
      timestamp: '5m ago',
    },
  ];

  const renderActivityItem = activity => (
    <View key={activity.id} style={styles.activityCard}>
      <View style={styles.iconContainer}>
        <Feather name={activity.icon} size={20} color="#6F7C97" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.descriptionText}>{activity.description}</Text>
      </View>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestampText}>{activity.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <View style={styles.activitiesList}>
        {activities.map(renderActivityItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timestampContainer: {
    alignItems: 'flex-end',
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#10B981',
  },
});

export default RecentActivity;
