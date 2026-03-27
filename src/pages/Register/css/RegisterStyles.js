import {StyleSheet} from 'react-native';

const RegisterStyles = StyleSheet.create({
  // Common layout blocks
  content: {
    flexDirection: 'column',
    gap: 6,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    marginBottom: 4,
  },

  // Text variants
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateSmall: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  amountMuted: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
});

export default RegisterStyles;
