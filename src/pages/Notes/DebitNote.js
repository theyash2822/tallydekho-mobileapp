import React, {useRef, useState} from 'react';
import {ScrollView, View, StyleSheet, Platform, Alert} from 'react-native';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';


//import {useAuth} from '../../context/AuthContext';
//import {ScrollView, View, StyleSheet, Platform} from 'react-native';
import Header from '../../components/common/Header';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import DebitNoteInfo from '../../components/notes/DebitNoteInfo';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const DebitNote = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);

  const handleSummaryExpand = () => {
    // Auto-scroll to summary when expanded
    setTimeout(() => {
      summaryRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: y - 20,
          animated: true,
        });
      });
    }, 200);
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Debit Note"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          commonScreenStyles.scrollContent,
          isKeyboardVisible && styles.keyboardPadding,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <DebitNoteInfo 
          scrollViewRef={scrollViewRef} 
          products={products}
          setProducts={setProducts}
          logistics={logistics}
          setLogistics={setLogistics}
        />
        <View ref={summaryRef}>
          <Summary 
            showPaymentDropdown={false} 
            onExpand={handleSummaryExpand}
            products={products}
            logistics={logistics}
          />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText="Submit Debit Note" showSecondButton={true} secondButtonText="Save as Optional" onPress={() => Alert.alert('Info', 'Please pair Desktop App to submit')} onSecondPress={() => Alert.alert('Info', 'Please pair Desktop App to submit')} />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
});

export default DebitNote;
