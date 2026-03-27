import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const data = [
  {
    id: '1',
    name: 'Marqus Horizon',
    type: 'Party',
    date: '07/02/2024',
    amount: '₹500.00',
    overdue: true,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Diego Ashley',
    type: 'Vendor',
    date: '07/10/2025',
    amount: '₹250.00',
    overdue: true,
    avatar: null,
    initials: 'M',
    bgColor: '#9b59b6',
  },
  {
    id: '3',
    name: 'Dolores Patrick',
    type: 'Supplier',
    date: '21/02/2025',
    amount: '₹785.00',
    overdue: true,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    name: 'Julia Martineze',
    type: 'Party',
    date: '12/12/2023',
    amount: '₹500.00',
    overdue: true,
    initials: 'J',
    bgColor: '#3498db',
  },
  {
    id: '5',
    name: 'Papito Belerick',
    type: 'Supplier',
    date: '10/11/2025',
    amount: '₹7120.00',
    overdue: true,
    initials: 'P',
    bgColor: '#f4a261',
  },
  {
    id: '6',
    name: 'John Drew',
    type: 'Party',
    date: '8/06/2024',
    amount: '₹50.00',
    overdue: true,
    initials: 'D',
    bgColor: '#2ecc71',
  },
  {
    id: '7',
    name: 'John Drew',
    type: 'Party',
    date: '07/02/2025',
    amount: '₹50.00',
    overdue: true,
    initials: 'D',
    bgColor: '#2ecc71',
  },
];

const typeColors = {
  Party: '#f87171',
  Vendor: '#a78bfa',
  Supplier: '#60a5fa',
};

const PartyList = ({searchText}) => {
  const navigation = useNavigation();

  const filteredData = data.filter(party =>
    party.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({item, index}) => {
    const isLastItem = index === filteredData.length - 1;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('partyDetails', {party: item})}
        activeOpacity={0.8}>
        <View style={[styles.row, isLastItem && {borderBottomWidth: 0}]}>
          {item.avatar ? (
            <Image source={{uri: item.avatar}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, {backgroundColor: item.bgColor}]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
          )}
          <View style={styles.details}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              <View
                style={[
                  styles.typeBadge,
                  {backgroundColor: typeColors[item.type] + '20'},
                ]}>
                <View
                  style={[
                    styles.typeDot,
                    {backgroundColor: typeColors[item.type]},
                  ]}
                />
                <Text style={[styles.typeText, {color: typeColors[item.type]}]}>
                  {item.type}
                </Text>
              </View>
            </View>
            <Text style={styles.subText}>Last transaction on {item.date}</Text>
          </View>
          <View style={styles.amount}>
            {item.overdue && <Text style={styles.overdue}>overdue</Text>}
            <Text style={styles.amountText}>{item.amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Party List</Text>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={20}
            color="#666"
          />
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            removeClippedSubviews={false}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: 10}}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#494D58',
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#494D58',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeDot: {
    width: 6,
    height: 12,
    marginRight: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subText: {
    fontSize: 12,
    color: '#8F939E',
    marginTop: 2,
    fontWeight: '400',
  },
  amount: {
    alignItems: 'flex-end',
  },
  overdue: {
    color: '#8F939E',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 10,
  },
  amountText: {
    color: '#F56359',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 10,
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#8F939E',
    fontStyle: 'italic',
  },
});

export default PartyList;
