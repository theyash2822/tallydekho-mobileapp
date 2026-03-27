import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Colors from '../../utils/Colors';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Banner = ({onVisibilityChange, selectedCompany}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [shouldShow, setShouldShow] = useState(false);

  const isDemoCompany = useMemo(() => {
    const name = selectedCompany?.name?.trim().toLowerCase();
    if (!name) return false;
    return name === 'abc enterprises' || name === 'demo company';
  }, [selectedCompany?.name]);

  useEffect(() => {
    let isMounted = true;
    const checkPairedState = async () => {
      const stored = await AsyncStorage.getItem('pairedDevice');
      const isPaired = !!stored;
      const visible = !isPaired || isDemoCompany;
      if (isMounted) {
        setShouldShow(visible);
        onVisibilityChange && onVisibilityChange(visible);
      }
    };

    checkPairedState();

    if (isFocused) {
      checkPairedState();
    }

    return () => {
      isMounted = false;
    };
  }, [isFocused, isDemoCompany, onVisibilityChange]);

  const handlePress = () => {
    navigation.navigate('tallyerp');
  };

  if (!shouldShow) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.syncBanner} onPress={handlePress}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.syncText}>Connect Tally Prime to sync data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    width: '98%',
  },
  syncBanner: {
    backgroundColor: '#009688',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  logo: {width: 24, height: 24, marginRight: 8},
  syncText: {color: Colors.white, fontWeight: 'bold', fontSize: 16},
  icon: {marginHorizontal: 8},
};

export default Banner;
