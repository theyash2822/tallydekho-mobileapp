import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';

const Header = ({}) => {
  const navigation = useNavigation();

  const goBack = () => {
    // navigation.navigate('dashboard');
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={goBack}>
        <Feather name="chevron-left" size={24} color="#8F939E" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Create Purchase Invoice</Text>
      <TouchableOpacity>
        <Feather name="file" size={24} color="#8F939E" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('createParty')}>
        <Feather
          name="user-plus"
          size={24}
          color="#8F939E"
          style={{marginLeft: 14}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default Header;
