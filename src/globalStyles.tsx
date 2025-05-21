import { StyleSheet } from 'react-native';
import { GRAY_COLOR_DARK } from './constants/Colors';
import { BOLD_BODY_FONT } from './constants/Fonts';

export const globalStyles = StyleSheet.create({
  errorText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'red',
    fontSize: 10,
  },
  requiredMark: {
    color: 'red',
  },
  labelText: {
    fontFamily: BOLD_BODY_FONT,
    color: GRAY_COLOR_DARK,
    fontSize: 12,
  },
});
