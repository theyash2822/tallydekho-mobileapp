import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';
import CustomSwitchTwo from '../common/CustomSwitchTwo';
import {Icons} from '../../utils/Icons';
import FormField from '../common/FormField';

const DispatchInfo = ({ scrollViewRef, previousInputRef, trackingNoRef: externalTrackingNoRef, onDropdownToggle }) => {
  const [dispatchMethod, setDispatchMethod] = useState('Transport');
  const [trackingNo, setTrackingNo] = useState('');
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [narration, setNarration] = useState('');
  const [showDispatchDropdown, setShowDispatchDropdown] = useState(false);

  const handleToggleDropdown = () => {
    const newValue = !showDispatchDropdown;
    setShowDispatchDropdown(newValue);
    if (onDropdownToggle) {
      onDropdownToggle(newValue);
    }
  };

  const handleDispatchMethodSelect = method => {
    setDispatchMethod(method.label);
    setShowDispatchDropdown(false);
    if (onDropdownToggle) {
      onDropdownToggle(false);
    }
  };

  // Refs for input navigation
  const internalTrackingNoRef = useRef(null);
  const trackingNoRef = externalTrackingNoRef || internalTrackingNoRef;
  const vehicleNameRef = useRef(null);
  const vehiclePhoneRef = useRef(null);
  const vehicleNumberRef = useRef(null);
  const narrationRef = useRef(null);

  // Container refs for smart scrolling
  const trackingContainerRef = useRef(null);
  const vehicleContainerRef = useRef(null);
  const narrationContainerRef = useRef(null);
  const [trackingContainerY, setTrackingContainerY] = useState(0);
  const [vehicleContainerY, setVehicleContainerY] = useState(0);
  const [narrationContainerY, setNarrationContainerY] = useState(0);

  // Smart scrolling handlers
  const handleTrackingFocus = () => {
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && trackingContainerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: trackingContainerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleVehicleFocus = () => {
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && vehicleContainerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: vehicleContainerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleNarrationFocus = () => {
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && narrationContainerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: narrationContainerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const dispatchMethods = [
    { id: 'transport', label: 'Transport', icon: 'transport', customIcon: true },
    { id: 'courier', label: 'Courier', icon: 'cube-outline', customIcon: false },
    { id: 'pickup', label: 'Self Pickup', icon: 'person-outline', customIcon: false },
    { id: 'delivery', label: 'Home Delivery', icon: 'home-outline', customIcon: false },
  ];

  const selectedMethod = dispatchMethods.find(
    method => method.label === dispatchMethod,
  );


  return (
    <View style={styles.container}>
      {/* Dispatch Method */}
      <Text style={styles.label}>Dispatch Method</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={handleToggleDropdown}>
        {selectedMethod?.customIcon ? (
          <Icons.Truck width={18} height={18} />
        ) : (
          <Icon
            name={selectedMethod?.icon || 'car-outline'}
            size={20}
            color={'#6f7c97'}
          />
        )}
        <Text style={styles.dropdownText}>{dispatchMethod}</Text>
        <Icon
          name={
            showDispatchDropdown ? 'chevron-up-outline' : 'chevron-down-outline'
          }
          size={20}
          color="#8F939E"
        />
      </TouchableOpacity>

      {/* Dropdown Options */}
      {showDispatchDropdown && (
        <ScrollView 
          style={styles.dropdownList}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled">
          {dispatchMethods.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.dropdownItem,
                dispatchMethod === method.label && styles.selectedDropdownItem,
                index === dispatchMethods.length - 1 && styles.lastDropdownItem,
              ]}
              onPress={() => handleDispatchMethodSelect(method)}>
              {method.customIcon ? (
                <Icons.Truck width={18} height={18} />
              ) : (
                <Icon name={method.icon} size={18} color="#6f7c97" />
              )}
              <Text style={styles.dropdownItemText}>{method.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Tracking No. */}
      <FormField
        label="Tracking No."
        placeholder="Enter tracking number"
        value={trackingNo}
        onChangeText={setTrackingNo}
        inputRef={trackingNoRef}
        containerRef={trackingContainerRef}
        onLayout={(e) => setTrackingContainerY(e.nativeEvent.layout.y)}
        scrollViewRef={scrollViewRef}
        returnKeyType="next"
        labelStyle={styles.label}
        inputStyle={styles.input}
        onSubmitEditing={() => {
          if (showVehicleInfo && vehicleNameRef?.current) {
            setTimeout(() => vehicleNameRef.current?.focus(), 50);
          } else if (narrationRef?.current) {
            setTimeout(() => narrationRef.current?.focus(), 50);
          }
        }}
        onFocus={handleTrackingFocus}
      />

      {/* Vehicle Info Toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.vehicleLabel}>Vehicle Information</Text>
        <CustomSwitchTwo
          isOn={showVehicleInfo}
          onToggle={() => setShowVehicleInfo(!showVehicleInfo)}
        />
      </View>

      {/* Vehicle Info Fields (Conditional) */}
      {showVehicleInfo && (
        <View
          ref={vehicleContainerRef}
          onLayout={(e) => {
            const { y } = e.nativeEvent.layout;
            setVehicleContainerY(y);
          }}
          style={{ marginTop: 0 }}>
          <FormField
            label="Name"
            inputRef={vehicleNameRef}
            scrollViewRef={scrollViewRef}
            returnKeyType="next"
            labelStyle={styles.label}
            inputStyle={styles.input}
            onSubmitEditing={() => {
              if (vehiclePhoneRef?.current) {
                setTimeout(() => vehiclePhoneRef.current?.focus(), 50);
              }
            }}
            onFocus={handleVehicleFocus}
          />

          <View style={styles.row}>
            <FormField
              label="Phone Number"
              inputRef={vehiclePhoneRef}
              keyboardType="numeric"
              scrollViewRef={scrollViewRef}
              returnKeyType="next"
              style={styles.halfInput}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onSubmitEditing={() => {
                if (vehicleNumberRef?.current) {
                  setTimeout(() => vehicleNumberRef.current?.focus(), 50);
                }
              }}
              onFocus={handleVehicleFocus}
            />
            <FormField
              label="Vehicle Number"
              inputRef={vehicleNumberRef}
              scrollViewRef={scrollViewRef}
              returnKeyType="next"
              style={styles.halfInput}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onSubmitEditing={() => {
                if (narrationRef?.current) {
                  setTimeout(() => narrationRef.current?.focus(), 50);
                }
              }}
              onFocus={handleVehicleFocus}
            />
          </View>
        </View>
      )}

      {/* Narration */}
      <FormField
        label="Narration"
        placeholder="Enter Notes"
        value={narration}
        onChangeText={setNarration}
        inputRef={narrationRef}
        containerRef={narrationContainerRef}
        onLayout={(e) => setNarrationContainerY(e.nativeEvent.layout.y)}
        scrollViewRef={scrollViewRef}
        multiline
        returnKeyType="done"
        labelStyle={styles.label}
        inputStyle={[styles.input, styles.notesBox]}
        onFocus={handleNarrationFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 14,
    marginTop: 14,
    marginBottom: 4,
  },
  optionalText: {
    color: '#999',
    fontSize: 12,
  },
  mandatoryAsterisk: {
    color: '#f00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mandatoryText: {
    color: '#8F939E',
    fontSize: 12,
  },
  dropdown: {
    ...CommonDropdownStyles.dropdownInput,
    padding: 12,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
    minHeight: 48,
  },
  dropdownText: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  selectedDropdownItem: {
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  input: {
    ...CommonInputStyles.textInput,
    padding: 12,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
    color: '#333',
    height: 45,
  },
  notesBox: {
    height: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  vehicleLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
});

export default DispatchInfo;
