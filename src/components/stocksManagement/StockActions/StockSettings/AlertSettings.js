import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import StockSettingsStyles from './css/StockSettingsStyles';

const AlertSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expiryDays, setExpiryDays] = useState('30');
  const [expiryChannels, setExpiryChannels] = useState([
    'In-App',
    'Email',
    'WhatsApp',
  ]);
  const [isExpiryDropdownOpen, setIsExpiryDropdownOpen] = useState(false);

  const [lowStockChannels, setLowStockChannels] = useState(['In-App', 'Email']);
  const [isLowStockDropdownOpen, setIsLowStockDropdownOpen] = useState(false);

  const [negativeStockChannels, setNegativeStockChannels] = useState([
    'In-App',
    'Email',
    'WhatsApp',
  ]);
  const [isNegativeStockDropdownOpen, setIsNegativeStockDropdownOpen] =
    useState(false);

  // Checkbox states for all sections
  const [checkboxSelections, setCheckboxSelections] = useState({
    // Expiry section
    expiryInApp: true,
    expiryEmail: true,
    expiryWhatsapp: true,
    // Low Stock section
    lowStockInApp: true,
    lowStockEmail: true,
    lowStockWhatsapp: false,
    // Negative Stock section
    negativeStockInApp: true,
    negativeStockEmail: true,
    negativeStockWhatsapp: true,
  });

  const channelOptions = [
    {key: 'InApp', label: 'In-App'},
    {key: 'Email', label: 'Email'},
    {key: 'Whatsapp', label: 'WhatsApp'},
  ];

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const toggleCheckbox = checkboxKey => {
    setCheckboxSelections(prev => ({
      ...prev,
      [checkboxKey]: !prev[checkboxKey],
    }));

    const channelName = checkboxKey.includes('InApp')
      ? 'In-App'
      : checkboxKey.includes('Email')
      ? 'Email'
      : 'WhatsApp';

    const updateChannels = (setChannels, currentChannels) => {
      setChannels(prev =>
        prev.includes(channelName)
          ? prev.filter(channel => channel !== channelName)
          : [...prev, channelName],
      );
    };

    if (checkboxKey.startsWith('expiry')) {
      updateChannels(setExpiryChannels, expiryChannels);
    } else if (checkboxKey.startsWith('lowStock')) {
      updateChannels(setLowStockChannels, lowStockChannels);
    } else if (checkboxKey.startsWith('negativeStock')) {
      updateChannels(setNegativeStockChannels, negativeStockChannels);
    }
  };

  const removeChannel = (channelToRemove, channelType) => {
    const updateChannels = (setChannels, currentChannels) => {
      setChannels(
        currentChannels.filter(channel => channel !== channelToRemove),
      );
    };

    const getCheckboxKey = (channelType, channelName) => {
      const prefix =
        channelType === 'expiry'
          ? 'expiry'
          : channelType === 'lowStock'
          ? 'lowStock'
          : 'negativeStock';
      const suffix =
        channelName === 'In-App'
          ? 'InApp'
          : channelName === 'Email'
          ? 'Email'
          : 'Whatsapp';
      return `${prefix}${suffix}`;
    };

    switch (channelType) {
      case 'expiry':
        updateChannels(setExpiryChannels, expiryChannels);
        break;
      case 'lowStock':
        updateChannels(setLowStockChannels, lowStockChannels);
        break;
      case 'negativeStock':
        updateChannels(setNegativeStockChannels, negativeStockChannels);
        break;
    }

    const checkboxKey = getCheckboxKey(channelType, channelToRemove);
    setCheckboxSelections(prev => ({...prev, [checkboxKey]: false}));
  };

  // Sync channels with checkbox selections for all sections
  useEffect(() => {
    const syncChannels = (prefix, setChannels) => {
      const newChannels = [];
      if (checkboxSelections[`${prefix}InApp`]) newChannels.push('In-App');
      if (checkboxSelections[`${prefix}Email`]) newChannels.push('Email');
      if (checkboxSelections[`${prefix}Whatsapp`]) newChannels.push('WhatsApp');
      setChannels(newChannels);
    };

    syncChannels('expiry', setExpiryChannels);
    syncChannels('lowStock', setLowStockChannels);
    syncChannels('negativeStock', setNegativeStockChannels);
  }, [
    checkboxSelections.expiryInApp,
    checkboxSelections.expiryEmail,
    checkboxSelections.expiryWhatsapp,
    checkboxSelections.lowStockInApp,
    checkboxSelections.lowStockEmail,
    checkboxSelections.lowStockWhatsapp,
    checkboxSelections.negativeStockInApp,
    checkboxSelections.negativeStockEmail,
    checkboxSelections.negativeStockWhatsapp,
  ]);

  const renderChannelChips = (channels, channelType) => (
    <View style={StockSettingsStyles.chipContainer}>
      {channels.map((channel, index) => (
        <View key={index} style={StockSettingsStyles.chipSmall}>
          <Text style={StockSettingsStyles.chipText}>{channel}</Text>
          <TouchableOpacity
            style={StockSettingsStyles.chipRemove}
            onPress={() => removeChannel(channel, channelType)}>
            <Feather name="x" size={12} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );


  const renderCheckbox = (checkboxKey, label) => (
    <TouchableOpacity
      style={StockSettingsStyles.dropdownOptionNoBorder}
      onPress={() => toggleCheckbox(checkboxKey)}>
      <View style={StockSettingsStyles.checkboxRow}>
        <View
          style={[
            StockSettingsStyles.checkbox,
            {
              backgroundColor: checkboxSelections[checkboxKey]
                ? '#16C47F'
                : '#FFFFFF',
              borderColor: checkboxSelections[checkboxKey]
                ? '#16C47F'
                : '#E0E0E0',
            },
          ]}>
          {checkboxSelections[checkboxKey] && (
            <Feather name="check" size={16} color="#FFFFFF" />
          )}
        </View>
        <Text style={StockSettingsStyles.dropdownOptionText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDropdown = (isOpen, prefix) => {
    if (!isOpen) return null;

    return (
      <View style={StockSettingsStyles.dropdownOptionsSmall}>
        {channelOptions.map(option => (
          <View key={`${prefix}-${option.key}`}>
            {renderCheckbox(`${prefix}${option.key}`, option.label)}
          </View>
        ))}
      </View>
    );
  };

  const renderAlertSection = (
    title,
    channels,
    channelType,
    isDropdownOpen,
    setIsDropdownOpen,
    prefix,
    showInput = false,
  ) => (
    <View style={StockSettingsStyles.alertSection}>
      <Text style={StockSettingsStyles.sectionTitle}>{title}</Text>

      {showInput && (
        <View style={StockSettingsStyles.inputRow}>
          <View style={StockSettingsStyles.inputGroup}>
            <Text style={StockSettingsStyles.label}>Alert before</Text>
            <View style={StockSettingsStyles.combinedInput}>
              <TextInput
                style={StockSettingsStyles.numberInput}
                value={expiryDays}
                onChangeText={setExpiryDays}
                keyboardType="numeric"
                placeholder="30"
              />
              <Text style={StockSettingsStyles.unitTextSimple}>Days</Text>
            </View>
          </View>
        </View>
      )}

      <View style={StockSettingsStyles.chipBox}>
        <View style={StockSettingsStyles.chipBoxHeader}>
          <View style={StockSettingsStyles.chipContainer}>
            {renderChannelChips(channels, channelType)}
          </View>
          <TouchableOpacity
            style={StockSettingsStyles.chevronButtonSmall}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Feather
              name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#8F939E"
            />
          </TouchableOpacity>
        </View>
      </View>

      {renderDropdown(isDropdownOpen, prefix)}
    </View>
  );

  return (
    <View style={StockSettingsStyles.container}>
      <TouchableOpacity
        style={StockSettingsStyles.header}
        onPress={toggleExpanded}
         activeOpacity={1}> 
        <View style={StockSettingsStyles.headerLeft}>
          <View style={StockSettingsStyles.iconContainer}>
            <Feather name="alert-circle" size={20} color="#6F7C97" />
          </View>
          <Text style={StockSettingsStyles.headerTitle}>Alert</Text>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#8F939E"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={StockSettingsStyles.contentWithSmallPadding}>
          {renderAlertSection(
            'Expiry',
            expiryChannels,
            'expiry',
            isExpiryDropdownOpen,
            setIsExpiryDropdownOpen,
            'expiry',
            true,
          )}

          {renderAlertSection(
            'Low Stock',
            lowStockChannels,
            'lowStock',
            isLowStockDropdownOpen,
            setIsLowStockDropdownOpen,
            'lowStock',
          )}

          {renderAlertSection(
            'Negative Stock',
            negativeStockChannels,
            'negativeStock',
            isNegativeStockDropdownOpen,
            setIsNegativeStockDropdownOpen,
            'negativeStock',
          )}
        </View>
      )}
    </View>
  );
};

export default AlertSettings;
