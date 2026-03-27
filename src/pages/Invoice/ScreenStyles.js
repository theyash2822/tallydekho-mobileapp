import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

export const commonScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 2,
  },
});

