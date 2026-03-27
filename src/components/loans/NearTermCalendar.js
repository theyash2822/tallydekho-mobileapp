import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';

const NearTermCalendar = ({calendarEvents = []}) => {
  const renderCalendarEvent = event => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventLeft}>
        <View style={styles.eventIcon}>
          <Icons.BankGreen />
          {/* <Feather name="github" size={16} color="#10B981" /> */}
        </View>
        <View style={styles.eventInfo}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
          <Text style={styles.eventDate}>{event.dueDate}</Text>
        </View>
      </View>
      <View style={styles.eventRight}>
        <Text style={styles.eventAmount}>{event.amount}</Text>
      </View>
    </View>
  );

  if (!calendarEvents || calendarEvents.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Near Term Calendar</Text>
      <View style={styles.eventsContainer}>
        {calendarEvents.map(renderCalendarEvent)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
    marginBottom: 12,
  },
  eventsContainer: {
    gap: 8,
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  eventDescription: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  eventDate: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  eventRight: {
    alignItems: 'flex-end',
  },
  eventAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
});

export default NearTermCalendar;
