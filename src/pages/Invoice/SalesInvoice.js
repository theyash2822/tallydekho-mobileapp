import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import Header from '../../components/common/Header';
import AddSection from '../../components/Sales-purchaseInvoice/AddSection';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import SalesInvoiceInfo from '../../components/Sales-purchaseInvoice/SalesInvoiceInfo';
import PaymentCollection from '../../components/Sales-purchaseInvoice/PaymentCollection';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from './ScreenStyles';

const SalesInvoiceScreen = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  const customerRef = useRef(null);
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
        title="Create Invoice"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <SalesInvoiceInfo scrollViewRef={scrollViewRef} customerRef={customerRef} />
        <AddSection
          stockHeading="Item/Services"
          stockButtonText="Add Product ＋"
          products={products}
          setProducts={setProducts}
          logistics={logistics}
          setLogistics={setLogistics}
        />
        <PaymentCollection />
        <View ref={summaryRef}>
          <Summary 
            showPaymentDropdown={true} 
            onExpand={handleSummaryExpand}
            products={products}
            logistics={logistics}
          />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText="Submit Invoice"
        showSecondButton={false}
        onPress={() => {
          // Validate customer before submitting
          const isValid = customerRef.current?.validate();
          if (!isValid) {
            Alert.alert('Validation Error', 'Please enter a valid customer');
            return;
          }
          console.log('Pressed');
        }}
      />
    </View>
  );
};

export default SalesInvoiceScreen;
