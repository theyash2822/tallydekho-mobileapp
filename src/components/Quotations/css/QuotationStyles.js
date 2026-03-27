import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';
import {CommonInputStyles} from '../../../utils/CommonStyles';


const QuotationStyles = StyleSheet.create({
  // Common container styles
  container: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  containerWithFlex: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 10,
  },
  scrollContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },


  // Common header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // Common field styles
  field: {
    marginBottom: 16,
  },

  field2: {
    marginBottom: 4,
  },

  // Common label styles
  label: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '400',
    color: Colors.secondaryText,
  },

  // Common title styles
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
  },
  title16: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#494D58',
  },
  titleBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Common subtitle styles
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  subtitle13: {
    fontSize: 13,
    color: '#8F939E',
    marginBottom: 15,
  },
  subtitleNew: {
    fontSize: 13,
    color: '#8F939E',
    marginBottom: 8,
  },

  // Common input styles
  input: {
    ...CommonInputStyles.textInput,
    borderRadius: 6,
    padding: 10,
    paddingVertical: 12,
    color: Colors.primaryText,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 14,
  },

  // Common row container styles
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap:8
  },
  halfField: {
    flex: 1,
  },

  termBox: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderColor: Colors.border,
    borderWidth: 1,
  },

  rowWithBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  termText: {
    fontSize: 14,
    color: '#333',
  },

  amountText20: {
    color: '#16C47F',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 5,
  },


  // Common section header styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
  },

  // Common dropdown styles
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    marginLeft: 2,
    fontSize: 14,
    color: '#494D58',
    flex: 1,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#494D58',
    marginLeft: 8,
  },

  // Common summary styles
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
    bottomborderWidth: 1,
    borderColor: '#F0EFF4',
  },
  innerContainer: {
    backgroundColor: '#F7F9FC',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
  },
  textGray: {
    color: '#8A8A8E',
    fontSize: 14,
  },
  detailsContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 6,
  },
  amount: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },


  // Common margin styles
  marginTop1: {
    marginTop: 1,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop12: {
    marginTop: 12,
  },
  marginRight8: {
    marginRight: 8,
  },
});

export default QuotationStyles;


