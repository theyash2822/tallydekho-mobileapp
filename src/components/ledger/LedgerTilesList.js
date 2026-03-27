import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';

const LedgerTilesList = ({tilesData}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [openMonths, setOpenMonths] = useState([]);

  // Automatically open the first month when tilesData loads
  useEffect(() => {
    if (tilesData && tilesData.length > 0 && openMonths.length === 0) {
      setOpenMonths([tilesData[0].month]);
    }
  }, [tilesData]);

  const handleToggleMonth = month => {
    setOpenMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month],
    );
  };

  const filteredData = (tilesData ?? [])
    .map(monthData => ({
      ...monthData,
      tiles: monthData.tiles.filter(tile => {
        let matchesType = true;
        if (selectedType === 'Cr') matchesType = tile.amountType === 'Cr';
        else if (selectedType === 'Dr') matchesType = tile.amountType === 'Dr';

        const matchesSearch =
          tile.type.toLowerCase().includes(search.toLowerCase()) ||
          tile.voucher.toLowerCase().includes(search.toLowerCase());

        return matchesType && matchesSearch;
      }),
    }))
    .filter(monthData => monthData.tiles.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons
          name="search"
          size={20}
          color="#8F939E"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Vouchers"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#8F939E"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            style={styles.clearIcon}>
            <MaterialIcons name="close" size={20} color="#8F939E" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.toggleRow}>
        {[
          {label: 'All', value: 'All'},
          {label: 'Credit', value: 'Cr'},
          {label: 'Debit', value: 'Dr'},
        ].map(({label, value}) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.toggleButton,
              selectedType === value && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedType(value)}>
            <Text
              style={[
                styles.toggleButtonText,
                selectedType === value && styles.toggleButtonTextActive,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {filteredData.length === 0 && (
        <View style={styles.noVouchersContainer}>
          <Text style={styles.noVouchersText}>No vouchers found</Text>
        </View>
      )}
      {filteredData.map(monthData => {
        const isMonthOpen = openMonths.includes(monthData.month);
        return (
          <View key={monthData.month} style={styles.monthSection}>
            <TouchableOpacity
              style={[
                styles.monthHeader,
                isMonthOpen &&
                  monthData.tiles.length > 0 &&
                  styles.monthHeaderOpen,
              ]}
              onPress={() => handleToggleMonth(monthData.month)}>
              <Text style={styles.monthHeaderText}>{monthData.month}</Text>
              <MaterialIcons
                name={isMonthOpen ? 'expand-less' : 'expand-more'}
                size={22}
                color="#8F939E"
              />
            </TouchableOpacity>
            {isMonthOpen && monthData.tiles.length > 0 && (
              <View style={styles.tilesContainer}>
                {monthData.tiles.map((tile, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.tileRow,
                      idx !== monthData.tiles.length - 1 &&
                        styles.tileRowBorder,
                    ]}>
                    <View style={styles.tileInfo}>
                      <Text style={styles.tileType}>
                        {tile.type}
                        {'   '}
                        <Text style={styles.tileVoucher}>{tile.voucher}</Text>
                      </Text>
                      <View style={styles.amountBalRow}>
                        <Text style={styles.tileAmount}>
                          {tile.amountType} {tile.amount}
                        </Text>
                        <Text style={styles.tileBal}>Bal {tile.bal}</Text>
                      </View>
                    </View>
                    <Text style={styles.tileDate}>{tile.date}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    marginBottom: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    minHeight: Platform.OS === 'ios' ? 50 : undefined,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#222',
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButtonActive: {
    backgroundColor: '#fff', 
    borderColor: Colors.border,
  },
  toggleButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },
  toggleButtonTextActive: {
    color: '#222',
  },
  monthSection: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  monthHeaderOpen: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  monthHeaderText: {
    flex: 1,
    fontWeight: '500',
    color: '#838F9A',
  },
  tilesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tileRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tileInfo: {
    flex: 1,
  },
  tileType: {
    fontWeight: '500',
    color: '#111',
  },
  tileVoucher: {
    fontWeight: '500',
    color: '#111',
  },
  tileAmount: {
    color: '#838F9A',
    fontWeight: '400',
    fontSize: 12,
  },
  tileBal: {
    color: '#838F9A',
    fontSize: 12,
  },
  tileDate: {
    color: '#838F9A',
    fontSize: 12,
    marginRight: 8,
  },
  amountBalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 16,
  },
  clearIcon: {
    marginLeft: 4,
    padding: 4,
  },
  noVouchersContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVouchersText: {
    color: '#8F939E',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LedgerTilesList;
