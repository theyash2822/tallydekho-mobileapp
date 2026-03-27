import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';
import {CommonInputStyles} from '../../../utils/CommonStyles';

export const voucherFormStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingBottom:12,
    backgroundColor: '#fff',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  voucherTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  voucherTypeText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 10,
    marginBottom: 4,
    color: '#8F939E',
  },
  input: {
    ...CommonInputStyles.textInput,
    height: 44,
    color: '#000',
    paddingVertical: 0,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 100,
  },
  option: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    position: 'relative',
  },
  halfInput: {
    flex: 1,
    position: 'relative',
  },
  floatingDropdown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    elevation: 4,
    zIndex: 999,
  },
  inputWrapper: {
    paddingHorizontal: 1,
  },
});

export const voucherScreenStyles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.backgroundColorPrimary,
  },
});
