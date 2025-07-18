import { requestAPI } from './requestAPI';
import Constants from 'expo-constants';

const { COLOR_EXTRACTOR = '' } = Constants.expoConfig?.extra ?? {};

const API_COLOR = process.env.EXPO_PUBLIC_API_COLOR_EXTRACTOR ?? COLOR_EXTRACTOR;

export const getDominantColor = async (imageUrl: string) => {
  try {
    const { color } = await requestAPI('/color-dominante', {
      method: 'POST',
      body: { imageUrl },
    }, API_COLOR);

    return color;
  } catch (error) {
    return '#000000';
  }
};
