import {StyleSheet} from 'react-native';
import Colors from './Colors';

export const CommonInputStyles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textInputLg: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },
  textInputWithHeight: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111111',
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
});

export const CommonLabelStyles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 8,
  },
  labelAsterisk: {
    color: '#EF4444',
    fontSize: 12,
  },
});

export const CommonDropdownStyles = StyleSheet.create({
  dropdownInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  placeholderText: {
    color: '#8F939E',
  },
  dropdownOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
  },
});

export const CommonLayoutStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
});
