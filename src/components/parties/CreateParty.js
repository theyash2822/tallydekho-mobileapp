import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/common/Header';
import Colors from '../../utils/Colors';
import PartyInfo from './PartyInfo';
import FinancialSettings from './FinancialSettings';
import TagSection from './Categories';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateParty = ({navigation}) => {
  return (
    <>
      <Header
        title="Create Party"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <PartyInfo />
        <FinancialSettings />
        <TagSection />
      </ScrollView>
      <View style={styles.bottomcontainer}>
        <TouchableOpacity style={styles.button}>
          <Icon name="add" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Save and create another</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <FontAwesome name="check-circle" size={20} color="#6F7C97" />
          <Text style={styles.shareText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  bottomcontainer: {
    padding: 12,
    backgroundColor: Colors.white,
  },
  button: {
    backgroundColor: '#07624C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#F7F9FC',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareText: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginLeft: 6,
  },
});

export default CreateParty;
