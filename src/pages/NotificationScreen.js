// import React, {useState} from 'react';
// import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
// import Header from '../components/common/Header';
// import Colors from '../utils/Colors';

// const notifications = [
//   {
//     id: '1',
//     title: 'Budget Overspend Warning',
//     description:
//       "⚠️ Budget Alert: You've exceeded your monthly marketing budget by ₹2,000.",
//     time: '5 mins ago',
//     tag: 'Warning',
//     color: '#FFB74A',
//     borderColor: '#CD8518',
//     button: 'Adjust plan',
//     category: 'Transactions',
//   },
//   {
//     id: '2',
//     title: 'Daily Summary Alert',
//     description:
//       "Your daily financial summary is ready! 📊 Tap to review today's income, expenses, and cash flow.",
//     time: '12:02 PM',
//     tag: 'Urgent',
//     color: '#DA3E29',
//     borderColor: '#9E0200',
//     category: 'Analytics',
//   },
//   {
//     id: '3',
//     title: 'Goal Progress Update',
//     description:
//       "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
//     time: 'Jan 20, 2025',
//     color: '#07624C',
//     borderColor: '#00442E',
//     category: 'All',
//   },
// ];

// const TABS = ['All', 'Transactions', 'Analytics'];

// const NotificationItem = React.memo(({item}) => (
//   <View style={styles.notificationContainer}>
//     <View style={[styles.icon, {backgroundColor: item.color , borderWidth:1 , borderColor:item.borderColor}]}>
//       <Icon name="notifications" size={24} color="#FFF" />
//     </View>
//     <View style={styles.notificationContent}>
//       <View style={styles.titleRow}>
//         <Text style={styles.notificationTitle}>{item.title}</Text>
//         <Text style={styles.notificationTime}>{item.time}</Text>
//       </View>
//       <Text style={styles.notificationText}>{item.description}</Text>
//       {item.button && (
//         <TouchableOpacity style={styles.actionButton}>
//           <Text style={styles.buttonText}>{item.button}</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   </View>
// ));

// const NotificationsScreen = () => {
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('All');

//   const filteredNotifications =
//     selectedTab === 'All'
//       ? notifications
//       : notifications.filter(item => item.category === selectedTab);

//   return (
//     <>
//       <Header
//         title="Notifications"
//         leftIcon="chevron-left"
//         onLeftPress={() => navigation.goBack()}
//       />
//       {/* Tabs Section */}
//       <View style={styles.tabContainer}>
//         {TABS.map(tab => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setSelectedTab(tab)}
//             style={styles.tab}>
//             <Text
//               style={[
//                 styles.tabText,
//                 selectedTab === tab && styles.selectedTabText,
//               ]}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={styles.container}>
//         {/* Section Title */}
//         <Text style={styles.sectionTitle}>Today</Text>

//         {/* Notifications List */}
//         <FlatList
//           data={filteredNotifications}
//           keyExtractor={item => item.id}
//           renderItem={({item}) => <NotificationItem item={item} />}
//           removeClippedSubviews={false} // Prevents unnecessary component removal
//           // initialNumToRender={5} // Controls how many items render initially
//           // maxToRenderPerBatch={5} // Limits rendering batches to prevent UI crashes
//         />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundColorPrimary,
//     paddingHorizontal: 20,
//   },

//   /* Tabs */
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//     paddingBottom: 5,
//     backgroundColor: Colors.white,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//   },
//   tabText: {
//     fontSize: 14,
//     color: 'grey',
//   },
//   selectedTabText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   actionButton: {
//     borderWidth: 1,
//     backgroundColor: '#07624C',
//     borderColor: '#E8EBE8',
//     paddingVertical: 5, // Reduce padding
//     paddingHorizontal: 10, // Reduce horizontal padding
//     borderRadius: 5, // Optional: Add rounded corners
//     alignSelf: 'flex-start', // Reduces width to fit content
//   },

//   buttonText: {
//     color: Colors.white,
//   },

//   /* Section Title */
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   /* Notification Styling */
//   notificationContainer: {
//     flexDirection: 'row',
//     backgroundColor: Colors.white,
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//   },
//   icon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   /* Title & Time in Same Row */
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   notificationTime: {
//     fontSize: 12,
//     color: '#999',
//   },
//   notificationText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '400',
//     marginVertical: 5,
//   },
// });

// export default NotificationsScreen;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/common/Header';
import Colors from '../utils/Colors';

const notifications = [
  {
    id: '1',
    title: 'Budget Overspend Warning',
    description:
      "⚠️ Budget Alert: You've exceeded your monthly marketing budget by ₹2,000.",
    time: '5 mins ago',
    tag: 'Warning',
    button: 'Adjust plan',
    category: 'Transactions',
  },
  {
    id: '2',
    title: 'Daily Summary Alert',
    description:
      "Your daily financial summary is ready! 📊 Tap to review today's income, expenses, and cash flow.",
    time: '12:02 PM',
    tag: 'Urgent',
    category: 'Analytics',
  },
  {
    id: '3',
    title: 'Goal Progress Update',
    description:
      "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
    time: 'Jan 20, 2025',
    category: 'All',
  },
  {
    id: '4',
    title: 'Goal Progress Update',
    description:
      "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
    time: 'Jan 20, 2025',
    category: 'All',
  },
  {
    id: '5',
    title: 'Goal Progress Update',
    description:
      "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
    time: 'Jan 20, 2025',
    category: 'All',
  },
  {
    id: '6',
    title: 'Goal Progress Update',
    description:
      "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
    time: 'Jan 20, 2025',
    category: 'All',
  },
  {
    id: '7',
    title: 'Goal Progress Update',
    description:
      "Great News! 🎉 You're 75% closer to your savings goal for this month. Keep up the momentum!",
    time: 'Jan 20, 2025',
    category: 'All',
  },
];

const badge = [
  {color: '#FFB74A', borderColor: '#CD8518'},
  {color: '#DA3E29', borderColor: '#9E0200'},
  {color: '#07624C', borderColor: '#00442E'},
];

const TABS = ['All', 'Transactions', 'Analytics'];

const NotificationItem = React.memo(({item}) => (
  <View style={styles.notificationContainer}>
    <View
      style={[
        styles.icon,
        {
          backgroundColor: item.color,
          borderWidth: 1,
          borderColor: item.borderColor,
        },
      ]}>
      <Icon name="notifications" size={24} color="#FFF" />
    </View>
    <View style={styles.notificationContent}>
      <View style={styles.titleRow}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <Text style={styles.notificationText}>{item.description}</Text>
      {item.button && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>{item.button}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
));

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredNotifications =
    selectedTab === 'All'
      ? notifications
      : notifications.filter(item => item.category === selectedTab);

  // Add badge colors to each notification (based on index)
  const notificationsWithBadge = filteredNotifications.map((item, index) => ({
    ...item,
    color: badge[index % badge.length].color,
    borderColor: badge[index % badge.length].borderColor,
  }));

  return (
    <>
      <Header
        title="Notifications"
        leftIcon="chevron-left"
        hideBottomBorder
        onLeftPress={() => navigation.goBack()}
      />
      {/* Tabs Section */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={styles.tab}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Today</Text>

        {/* Notifications List */}
        <FlatList
          data={notificationsWithBadge}
          keyExtractor={item => item.id}
          renderItem={({item}) => <NotificationItem item={item} />}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    paddingHorizontal: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    backgroundColor: Colors.white,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  tabText: {
    fontSize: 14,
    color: 'grey',
  },
  selectedTabText: {
    color: 'black',
    fontWeight: 'bold',
  },
  actionButton: {
    borderWidth: 1,
    backgroundColor: '#07624C',
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },

  buttonText: {
    color: Colors.white,
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  /* Notification Styling */
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    marginVertical: 5,
  },
});

export default NotificationsScreen;
