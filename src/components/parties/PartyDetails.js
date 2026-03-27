import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Header from '../common/Header';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InvoiceCard from '../purchases/PurchasesInvoices';
import Colors from '../../utils/Colors';
import BottomNav from '../common/NavBar';

const PartyDetails = ({route}) => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const {party} = route.params;

  const typeColors = {
    Party: '#f87171',
    Vendor: '#a78bfa',
    Supplier: '#60a5fa',
  };

  return (
    <>
      <Header
        title="Parties"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        {/* <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#A0A0A0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for parties"
            placeholderTextColor="#8F939E"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View> */}

        {/* Profile Section */}
        <View style={styles.profileCard}>
          {party.avatar ? (
            <Image source={{uri: party.avatar}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, {backgroundColor: party.bgColor}]}>
              <Text style={styles.avatarText}>{party.initials}</Text>
            </View>
          )}

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.name}>{party.name}</Text>
            <View style={styles.typeBadge}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: typeColors[party.type] || '#999'},
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  {color: typeColors[party.type] || '#333'},
                ]}>
                {party.type}
              </Text>
            </View>
          </View>

          <View style={[styles.infoRow, {marginTop: 8}]}>
            <MaterialIcons name="phone" size={16} color="#898E9A" />
            <Text style={styles.infoText}>+1 902-21938123</Text>
            <View style={{marginLeft: 8}}></View>
            <MaterialIcons name="email" size={16} color="#898E9A" />
            <Text style={styles.infoText}>user@gmail.com</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="pin" size={20} color="#898E9A" />
            <Text style={styles.infoText}>Mumbai, India</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.reminderBtn}>
              <Text style={styles.reminderText}>Send reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction Section */}
        <View style={styles.transactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={20}
              color="#666"
            />
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.iconCircleGreen}>
              <MaterialIcons name="receipt-long" size={20} color="#fff" />
            </View>
            <Text style={styles.label}>Total Receivables/Payables</Text>
            <Text style={styles.value}>{party.amount}</Text>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.iconCircleRed}>
              <MaterialIcons name="error-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.label}>Outstanding</Text>
            <Text style={styles.value}>220</Text>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.iconCircleGray}>
              <FontAwesome name="calendar" size={18} color="#fff" />
            </View>
            <Text style={styles.label}>Last Transaction Date</Text>
            <Text style={styles.value}>{party.date}</Text>
          </View>
        </View>

        <View style={styles.containernew}>
          {/* Heading with Icon */}
          <View style={styles.headernew}>
            <Text style={styles.headingnew}>Invoice</Text>
            <Feather name="more-horizontal" size={20} color="gray" />
          </View>

          {/* Invoice Card */}
          <InvoiceCard
            invoiceNumber="001234"
            companyName="Larsen & Victor Company Limited"
            date="24/01/2025"
            amount="5,000"
            isPaid={true}
          />
        </View>
      </ScrollView>
      <BottomNav />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backgroundColorPrimary,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileCard: {
    // marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
  name: {fontSize: 18, fontWeight: '500', color: '#1F1F1F'},
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: 8,
  },
  dot: {
    width: 6,
    height: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 2},
  infoText: {marginLeft: 6, fontSize: 12, color: '#8F939E', fontWeight: '400'},
  buttonRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },

  reminderBtn: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#ECEFF7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  reminderText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },

  editText: {
    color: '#494D58',
    fontWeight: '400',
    fontSize: 12,
  },
  transactionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 16, fontWeight: '600'},
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircleGreen: {
    backgroundColor: '#28c76f',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  iconCircleRed: {
    backgroundColor: '#ea5455',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  iconCircleGray: {
    backgroundColor: '#b8c2cc',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  label: {flex: 1, fontSize: 14, color: '#555'},
  value: {fontWeight: '600', fontSize: 14},
  containernew: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    shadowColor: Colors.black,
    marginTop: 10,
  },
  headernew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headingnew: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PartyDetails;
