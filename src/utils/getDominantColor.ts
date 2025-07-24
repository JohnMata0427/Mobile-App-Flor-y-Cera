import Constants from 'expo-constants';
import { requestAPI } from './requestAPI';

const { COLOR_EXTRACTOR = process.env.EXPO_PUBLIC_API_COLOR_EXTRACTOR } =
  Constants.expoConfig?.extra ?? {};

export const getDominantColor = async (imageUrl: string) => {
  try {
    const { color } = await requestAPI(
      '/color-dominante',
      {
        method: 'POST',
        body: { imageUrl },
      },
      COLOR_EXTRACTOR,
    );

    return color;
  } catch (error) {
    return '#000000';
  }
};
