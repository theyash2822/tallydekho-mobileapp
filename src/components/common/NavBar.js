import React, {useState, useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import QuickActionsModal from './QuickActionModal';
import {Icons} from '../../utils/Icons';

const BottomNav = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Optimized route detection with better error handling
  const currentRoute = useNavigationState(state => {
    if (!state?.routes?.length) return '';

    try {
      const mainTabsRoute = state.routes.find(
        route => route.name === 'MainTabs',
      );
      if (!mainTabsRoute?.state?.routes?.length) return '';

      const activeTabIndex = mainTabsRoute.state.index ?? 0;
      const activeTab = mainTabsRoute.state.routes[activeTabIndex];
      return activeTab?.name || '';
    } catch (error) {
      console.warn('Error getting current route:', error);
      return '';
    }
  });

  // Memoized tabs configuration
  const tabs = useMemo(
    () => [
      {
        name: 'dashboard',
        label: 'Home',
        icon: Icons.HomeLight,
        activeIcon: Icons.HomeDark,
        isFeatherIcon: false,
      },
      {
        name: 'ledger',
        label: 'Ledger',
        icon: Icons.LedgerLight,
        activeIcon: Icons.LedgerDark,
        isFeatherIcon: false,
      },
      {
        name: 'stocks',
        label: 'Stocks',
        icon: Icons.StockLight,
        activeIcon: Icons.StockDark,
        isFeatherIcon: false,
      },
      {
        name: 'report',
        label: 'Reports',
        icon: Icons.ReportLight,
        activeIcon: Icons.ReportDark,
        isFeatherIcon: false,
      },
    ],
    [],
  );

  // Memoized color function
  const getTabColor = useCallback(
    tabName => {
      return currentRoute === tabName
        ? Colors.activeTab || '#3F434E'
        : Colors.inactiveTab || '#898E9A';
    },
    [currentRoute],
  );

  // Optimized navigation handler
  const handleTabPress = useCallback(
    tabName => {
      if (currentRoute === tabName) return; // Prevent unnecessary navigation

      try {
        navigation.navigate('MainTabs', {
          screen: tabName,
          params: {},
          merge: true,
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [navigation, currentRoute],
  );

  const handleModalToggle = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Render individual tab item
  const renderTabItem = useCallback(
    (tab, key) => {
      const isActive = currentRoute === tab.name;
      const tabColor = getTabColor(tab.name);

      return (
        <TouchableOpacity
          key={key || tab.name}
          style={styles.navItem}
          onPress={() => handleTabPress(tab.name)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={`${tab.label} tab`}
          accessibilityRole="tab"
          accessibilityState={{selected: isActive}}>
          {tab.isFeatherIcon ? (
            <Icon
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={tabColor}
            />
          ) : (
            <>
              {isActive && tab.activeIcon ? (
                <tab.activeIcon width={30} height={30} />
              ) : (
                <tab.icon width={30} height={30} />
              )}
            </>
          )}
          <Text style={[styles.navText, {color: tabColor}]}>{tab.label}</Text>
        </TouchableOpacity>
      );
    },
    [currentRoute, getTabColor, handleTabPress],
  );

  return (
    <View style={styles.container}>
      <QuickActionsModal visible={modalVisible} onClose={handleModalClose} />

      <View style={styles.navContainer}>
        {/* First two tabs */}
        {tabs.slice(0, 2).map(tab => renderTabItem(tab))}

        {/* Plus button */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleModalToggle}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Quick actions"
          accessibilityRole="button">
          <View style={styles.plusIconContainer}>
            <Icon name="plus" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Last two tabs */}
        {tabs.slice(2).map(tab => renderTabItem(tab))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderColor: Colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navItem: {alignItems: 'center'},
  navText: {fontSize: 12, color: Colors.black},
  plusButton: {justifyContent: 'center', alignItems: 'center'},
  plusIconContainer: {
    // backgroundColor: '#009688',
    backgroundColor: '#07624C',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
});

export default BottomNav;
