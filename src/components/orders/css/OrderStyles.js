import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';
import {CommonInputStyles} from '../../../utils/CommonStyles';

const OrderStyles = StyleSheet.create({
  // Common container styles
  container: {
    padding: 12,
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  containerWithFlex: {
    padding: 12,
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flex: 1,
    overflow: 'visible',
  },

  // Common row styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Common heading styles
  heading: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Common label styles
  label: {
    marginBottom: 8,
    fontSize: 13,
    color: '#8F939E',
  },
  label14: {
    marginBottom: 8,
    fontSize: 12,
    color: '#8F939E',
  },

  // Common dropdown styles
  dropdownContainer: {
    position: 'relative',
    marginBottom: 10,
    zIndex: 1,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation:1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },

  // Common input row styles
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputRowWithMargin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  // Common input box styles
  inputBox: {
    width: '48%',
  },

  // Common input styles
  input: {
    ...CommonInputStyles.textInput,
    paddingHorizontal: 10,
  },

  // Common date input styles
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  // Common icon styles
  dateIcon: {
    marginRight: 8,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },

  // Common text styles
  dateText: {
    flex: 1,
    color: '#000',
  },
  dateTextWithMargin: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },

  // Common margin styles
  marginTop10: {
    marginTop: 10,
  },
  marginTop12: {
    marginTop: 12,
  },
  marginTop0: {
    marginTop: 0,
  },
  marginTop2: {
    marginTop: 2,
  },

  // Common flex styles
  marginLeftAuto: {
    marginLeft: 'auto',
  },
  flexRowGap8: {
    flexDirection: 'row',
    gap: 8,
  },

  // Common text styles for additional info
  additionalText: {
    fontSize: 12,
    color: '#6F7C97',
    marginTop: 4,
  },
});

export default OrderStyles;


