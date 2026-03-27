import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const CustomBottomButtons = ({
  onSave,
  onCancel,
  saveState = 'save', // 'save', 'saving', 'saved'
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  saveButtonColor = '#07624C',
  cancelButtonColor = '#F7F9FC',
  cancelTextColor = '#374151',
  disabled = false,
  showCancel = true,
  customStyles = {},
  savingText = 'Saving...',
  savedText = 'Saved',
}) => {
  const getSaveButtonContent = () => {
    switch (saveState) {
      case 'saving':
      case 'transferring':
        return (
          <>
            <ActivityIndicator size="small" color={Colors.white} />
            <Text style={styles.saveButtonText}>{savingText}</Text>
          </>
        );
      case 'saved':
      case 'transferred':
        return (
          <>
            <Icon name="check" size={16} color={Colors.white} />
            <Text style={styles.saveButtonText}>{savedText}</Text>
          </>
        );
      default:
        return <Text style={styles.saveButtonText}>{saveButtonText}</Text>;
    }
  };

  const getSaveButtonStyle = () => {
    const baseStyle = [
      styles.saveButton,
      {backgroundColor: saveButtonColor},
      customStyles.saveButton,
    ];

    switch (saveState) {
      case 'saving':
      case 'transferring':
        return [...baseStyle, styles.savingButton, customStyles.savingButton];
      case 'saved':
      case 'transferred':
        return [...baseStyle, styles.savedButton, customStyles.savedButton];
      default:
        return baseStyle;
    }
  };

  return (
    <View
      style={[
        styles.buttonContainer,
        Platform.OS === 'ios' && {paddingBottom: 18}, // iOS-specific margin
        customStyles.buttonContainer,
      ]}
    >
      <TouchableOpacity
        style={getSaveButtonStyle()}
        onPress={onSave}
        disabled={
          disabled || saveState === 'saving' || saveState === 'transferring'
        }
      >
        {getSaveButtonContent()}
      </TouchableOpacity>

      {showCancel && (
        <TouchableOpacity
          style={[
            styles.cancelButton,
            {backgroundColor: cancelButtonColor},
            customStyles.cancelButton,
          ]}
          onPress={onCancel}
        >
          <Text
            style={[
              styles.cancelButtonText,
              {color: cancelTextColor},
              customStyles.cancelButtonText,
            ]}
          >
            {cancelButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  savingButton: {
    backgroundColor: '#07624C',
  },
  savedButton: {
    backgroundColor: '#07624C',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomBottomButtons;
