import React, {useState, useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../components/common/Header';
import LedgerBody from '../components/ledger/LedgerBody';
import LedgerCreationModal from '../components/ledger/LedgerCreationModal';
import {FilterDrawer} from '../components/filterdrawer';
import Colors from '../utils/Colors';


// TODO: If API provides nature options, fetch them here instead of hardcoding
// For now, using standard accounting nature types
const natureOptions = ['Assets', 'Liabilities', 'Income', 'Expense'];
const groupOptions = [
  'Alpha Group',
  'Beta Group',
  'Gamma Group',
  'Delta Group',
  'Assets Group',
  'Liabilities Group',
  'Expense Group',
  'Income Group',
];

const Ledger = ({navigation, route}) => {
  const [showCreation, setShowCreation] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterData, setFilterData] = React.useState(null);
  const [resetKey, setResetKey] = React.useState(0);
  const initialFilterType = route?.params?.filterType || null;

  // Temporary filter states (for FilterDrawer)
  const [tempNature, setTempNature] = useState('Assets');
  const [tempHideZero, setTempHideZero] = useState(false);
  const [tempGroup, setTempGroup] = useState('');

  // Reset filters when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setFilterData(null);
      setResetKey(prev => prev + 1);
      setTempNature('Assets');
      setTempHideZero(false);
      setTempGroup('');
    }, []),
  );

  // Initialize temp states when opening filter drawer
  const handleFilterPress = useCallback(() => {
    setTempNature(filterData?.nature || 'Assets');
    setTempHideZero(filterData?.hideZero || false);
    setTempGroup(filterData?.group || '');
    setShowFilter(true);
  }, [filterData]);

  // Apply filters when "Apply Filters" is clicked
  const handleApplyFilters = useCallback(() => {
    setFilterData({
      nature: tempNature,
      hideZero: tempHideZero,
      group: tempGroup,
    });
    setShowFilter(false);
  }, [tempNature, tempHideZero, tempGroup]);

  // Custom filters configuration for FilterDrawer
  const customFilters = useMemo(() => {
    const filteredGroupOptions = tempGroup.trim()
      ? groupOptions.filter(g => 
          g.toLowerCase().includes(tempGroup.toLowerCase())
        )
      : [];

    return {
      nature: {
        label: 'Nature',
        type: 'radio',
        options: natureOptions.map(option => ({
          key: option.toLowerCase(),
          label: option,
        })),
        selected: tempNature.toLowerCase(),
        onSelect: (key) => {
          const selected = natureOptions.find(opt => opt.toLowerCase() === key);
          if (selected) setTempNature(selected);
        },
      },
      group: {
        label: 'Group',
        type: 'textInput',
        placeholder: 'Search Group',
        value: tempGroup,
        onChange: setTempGroup,
        options: filteredGroupOptions.map(option => ({
          key: option,
          label: option,
        })),
        selected: tempGroup ? [tempGroup] : [],
        onSelect: (key) => setTempGroup(key),
        onDeselect: () => setTempGroup(''),
        onDeselectAll: () => setTempGroup(''),
      },
    };
  }, [tempNature, tempHideZero, tempGroup]);

  return (
    <>
      <Header
        title="Ledgers"
        rightIconType="Ionicons"
        rightIcon={'add'}
        rightIcon2Type="Ionicons"
        rightIcon2={'filter'}
        rightIcon2Size={18}
        onRightPress={() => setShowCreation(true)}
        onRightPress2={handleFilterPress}
        showBackgroundContainer
      />
      <View style={styles.container}>
        <LedgerBody 
          key={resetKey}
          filterData={filterData} 
          filterType={initialFilterType} 
        />
      </View>

    
      <LedgerCreationModal
        visible={showCreation}
        onClose={() => setShowCreation(false)}
      />
      <FilterDrawer
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        customFilters={customFilters}
        onApply={handleApplyFilters}
        slideDirection="left"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
});

export default Ledger;
