import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';
import {useAuth} from '../../../hooks/useAuth';

const FinancialYearDropdown = ({openDropdown, onDropdownToggle}) => {
  const {companies, selectedCompany, selectedFY, setSelectedFY} = useAuth();
  const [availableYears, setAvailableYears] = useState([]);
  
  // Use shared dropdown state
  const fyDropdownVisible = openDropdown === 'fy';

  useEffect(() => {
    if (selectedCompany?.years?.length > 0) {
      setAvailableYears(selectedCompany.years);

      // Only reset FY if previous FY does not exist in new list
      if (
        !selectedCompany.years.find(y => y.uniqueId === selectedFY?.uniqueId)
      ) {
        setSelectedFY(selectedCompany.years[0]);
      }
    } else {
      setAvailableYears([]);
      setSelectedFY(null);
    }
  }, [selectedCompany]);

  const toggleFYDropdown = () => {
    onDropdownToggle?.('fy');
  };

  const selectFY = fy => {
    setSelectedFY(fy);
    onDropdownToggle?.(null); // Close dropdown after selection
  };

  if (!selectedFY) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.fyContainer}>
        <TouchableOpacity onPress={toggleFYDropdown} style={styles.fyWrapper}>
          <Feather
            name="calendar"
            size={14}
            color={Colors.black}
            style={{marginRight: 6}}
          />
          <Text style={styles.fyText}>{selectedFY.name}</Text>
          <Feather
            name={fyDropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#898E9A"
            style={{marginLeft: 6}}
          />
        </TouchableOpacity>

        {fyDropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={availableYears}
              keyExtractor={item => item.uniqueId.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectFY(item)}>
                  <Text style={styles.dropdownText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{maxHeight: 140}}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-end',
  },
  fyContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  fyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fyText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.black,
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    paddingHorizontal: 16,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.black,
  },
});

export default FinancialYearDropdown;
