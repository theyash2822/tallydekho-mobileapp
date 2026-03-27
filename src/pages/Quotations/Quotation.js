import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../../components/common/Header';
import EntryType from '../../components/Quotations/EntryType';
import QuotationsSummary from '../../components/Quotations/Summary';
import TermsAndConditions from '../../components/Quotations/Terms&Conditions';
import AddLogisticsSection from '../../components/Quotations/AddLogistics';
import BottomArea from '../../components/common/BottomArea';
import { commonScreenStyles } from '../Invoice/ScreenStyles';

const Quotation = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);

  return (
    <>
      <View style={commonScreenStyles.container}>
        <Header
          title="Create Quotation"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={commonScreenStyles.scrollContent}>
          <EntryType 
            scrollViewRef={scrollViewRef} 
            products={products}
            setProducts={setProducts}
          />
          <AddLogisticsSection 
            logistics={logistics}
            setLogistics={setLogistics}
          />
          <QuotationsSummary 
            products={products}
            logistics={logistics}
          />
          <TermsAndConditions />
        </ScrollView>
        <BottomArea
          buttonText="Submit Quotation"
          secondButtonText="Submit & Share PDF"
        />
      </View>
    </>
  );
};

export default Quotation;
