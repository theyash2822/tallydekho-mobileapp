import React , {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Table from '../components/Invoice/Table';
import InvoiceComponent from '../components/Invoice/Details';
import Narration from '../components/Invoice/Narration';
import Header from '../components/common/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../utils/Colors';
import TableNew from '../components/Invoice/TableWithApi';
import CompleteInvoiceModal from '../components/Invoice/MarkasPaidModal';

const InvoiceScreen = ({route, navigation}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const {status} = route.params;
  return (
    <>
      <Header
        title="Invoice#001"
        leftIcon="chevron-left"
        rightIcon="file"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Open Settings')}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <InvoiceComponent
          status={status} // Can be 'paid', 'partially_paid', 'Unpaid' , 'Partial'
        />
        <Table />
        {/* <TableNew/> */}

        <Narration />
      </ScrollView>
      <View style={styles.bottomcontainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <FontAwesome name="check-circle" size={18} color="white" />
          <Text style={styles.buttonText}>Mark as paid</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={18} color="#6B7280" />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <CompleteInvoiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    padding: 10,
  },
  bottomcontainer: {
    padding: 10,
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
  },
  shareText: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginLeft: 6,
  },
});

export default InvoiceScreen;
