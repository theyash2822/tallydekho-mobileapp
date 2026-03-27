import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextSemibold} from '../../../../utils/CustomText';
import Colors from '../../../../utils/Colors';
import CustomAnimatedModal from '../../../common/CustomAnimatedModal';

const {width} = Dimensions.get('window');

const MultiUserAccessModal = ({visible, onClose, onNotify}) => {
  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}>
      {/* Header with Icon and Close Button */}
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={32} color="#10B981" />
        </View>
        <TouchableOpacity style={styles.crossIcon} onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextSemibold style={styles.title}>Multi-User Access</TextSemibold>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          This feature is on the way. You'll soon
        </Text>
        <Text style={styles.descriptionText}>
          be able to add multiple users and
        </Text>
        <Text style={styles.descriptionText}>manage permissions.</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.notifyButton} onPress={onNotify}>
          <Text style={styles.notifyButtonText}>Notify me</Text>
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  crossIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  title: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  notifyButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MultiUserAccessModal;
