import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Text, TextInput, ScrollView} from 'react-native';
import Header from '../components/common/Header';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Colors from '../utils/Colors';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PartyList from '../components/parties/Partylist';
import BottomNav from '../components/common/NavBar';

const Parties = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  //  Clear search text when screen is focused
  useFocusEffect(
    useCallback(() => {
      setSearchText('');
    }, []),
  );

  return (
    <>
      <Header
        title="Parties"
        leftIcon="chevron-left"
        rightIcon="user-plus"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('createParty')}
      />
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#A0A0A0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for parties"
            placeholderTextColor="#8F939E"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View>

        <View style={styles.statsRow}>
          <PartyCard icon="cash-multiple" title="Total Parties" value="1350" />
          <PartyCard icon="barcode" title="Active Parties" value="23" />
        </View>

        <View style={styles.statsRow2}>
          <PartyCard
            icon="warehouse"
            title="Outstanding Recievables"
            value="13"
          />
          <PartyCard
            icon="alert-circle-outline"
            title="Outstanding Payables"
            value="130"
          />
        </View>
        <PartyList searchText={searchText} />
      </ScrollView>
      <BottomNav />
    </>
  );
};

const PartyCard = ({icon, title, value, onPress}) => {
  const formattedValue = parseFloat(value).toFixed(2);
  const [integerPart, decimalPart] = formattedValue.split('.');
  const displayDecimal = decimalPart !== '00';

  return (
    <Card style={styles.statCard} mode="contained" onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={20} color="#494D58" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.statTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.statValue}>
            {integerPart}
            {displayDecimal && (
              <Text style={styles.decimalValue}>.{decimalPart}</Text>
            )}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.backgroundColorPrimary,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 10,
  },
  statsRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    paddingLeft: 8,
    paddingTop: 12,
    paddingBottom: 12,
    margin: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    maxWidth: '100%',
  },
  decimalValue: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.primaryTitle,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryTitle,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECEFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.primaryTitle,
    paddingVertical: 0,
  },
});

export default Parties;
