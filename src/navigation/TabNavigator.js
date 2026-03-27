import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNav} from '../components/common';
import Dashboard from '../pages/Dashboard';
import Reports from '../pages/Reports';
import StocksManagement from '../pages/StocksDashboard';
import Ledger from '../pages/Ledger';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      tabBar={props => <BottomNav {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="dashboard" component={Dashboard} />
      <Tab.Screen name="report" component={Reports} />
      <Tab.Screen name="stocks" component={StocksManagement} />
      <Tab.Screen name="ledger" component={Ledger} />
    </Tab.Navigator>
  );
}
