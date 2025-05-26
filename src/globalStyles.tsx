import { StyleSheet } from 'react-native';
import { GRAY_COLOR_DARK, PRIMARY_COLOR_DARK } from './constants/Colors';
import { BOLD_BODY_FONT } from './constants/Fonts';

export const tabsGlobalStyles = StyleSheet.create({
  viewContent: {
    flex: 1,
  },
  tabBarStyle: {
    paddingHorizontal: 4,
    paddingTop: 5,
    height: 100,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  tabBarBadgeStyle: {
    backgroundColor: PRIMARY_COLOR_DARK,
    fontFamily: BOLD_BODY_FONT,
    fontSize: 10,
    paddingTop: 2,
  },
  tabBarIcon: {
    width: 55,
    height: 30,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

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
