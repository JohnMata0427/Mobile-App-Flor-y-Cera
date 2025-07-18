import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Flor & Cera',
  slug: 'flor-y-cera-app',
  description:
    'Flor & Cera es una aplicación que permite a los usuarios comprar productos artesanales como jabones y velas, así como también personalizar sus propios productos con la asistencia de inteligencia artificial.',
  owner: 'johnmata0427',
  githubUrl: 'https://github.com/JohnMata0427/Mobile-App-Flor-y-Cera',
  version: '1.1.0',
  orientation: 'portrait',
  primaryColor: '#9F93E7',
  icon: './assets/images/icon.png',
  scheme: 'mobileappflorycera',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  platforms: ['ios', 'android'],
  androidStatusBar: {
    translucent: true,
    barStyle: 'dark-content',
  },
  currentFullName: 'John Mata',
  originalFullName: 'John Mata',
  developmentClient: {
    silentLaunch: true,
  },
  androidNavigationBar: {
    barStyle: 'dark-content',
  },
  notification: {
    icon: './assets/images/icon.png',
    color: '#000000',
    androidCollapsedTitle: 'Notificaciones de Flor & Cera',
    androidMode: 'collapse',
  },
  splash: {
    backgroundColor: '#ffffff',
    image: './assets/images/icon.png',
    resizeMode: 'contain',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.florcera.app',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.florcera.app',
    icon: './assets/images/icon.png',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
    },
    softwareKeyboardLayoutMode: 'pan',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.ACCESS_MEDIA_LOCATION',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.POST_NOTIFICATIONS',
    ],
    edgeToEdgeEnabled: true,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-splash-screen',
      {
        image: './assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'La aplicación necesita acceso a la galería para seleccionar fotos.',
        cameraPermission: 'La aplicación necesita acceso a la cámara para tomar fotos.',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        enableGooglePay: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'da873e00-ecc2-497c-883d-ab85516b71e0',
    },
    STRIPE_API_KEY: process.env.STRIPE_API_KEY ?? '',
    BACKEND_URL: process.env.BACKEND_URL ?? '',
    COLOR_EXTRACTOR: process.env.COLOR_EXTRACTOR ?? '',
  },
};

export default config;
