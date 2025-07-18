import { StyleSheet } from 'react-native';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from './constants/Colors';
import { HEADING_FONT } from './constants/Fonts';

export const welcomeStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    rowGap: 10,
  },
  splashImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  subtitle: {
    color: GRAY_COLOR,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  primaryButton: { width: '45%' },
  secondaryButton: {
    width: '45%',
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
});

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Text
  title: {
    fontFamily: HEADING_FONT,
    fontSize: 24,
    color: GRAY_COLOR_DARK,
    textAlign: 'center',
  },
  subtitle: {
    color: GRAY_COLOR,
    textAlign: 'center',
    fontSize: 12,
  },
  bodyText: {
    color: GRAY_COLOR_DARK,
    fontSize: 12,
  },
  link: {
    color: SECONDARY_COLOR_DARK,
    fontWeight: 'bold',
  },
  errorText: {
    fontWeight: 'semibold',
    color: 'red',
    fontSize: 12,
  },
  labelText: {
    fontWeight: 'bold',
    color: GRAY_COLOR_DARK,
    fontSize: 12,
  },

  // Button
  button: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  buttonPrimary: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },

  // Input
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: GRAY_COLOR_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: GRAY_COLOR_DARK,
    borderWidth: 1,
    borderColor: GRAY_COLOR,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  inputIconRight: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },

  // Image
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },

  // Misc
  divider: {
    borderTopColor: GRAY_COLOR_LIGHT,
    borderTopWidth: 1,
    marginVertical: 15,
  },
  requiredMark: {
    color: 'red',
  },
});
