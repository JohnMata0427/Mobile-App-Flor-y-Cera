import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Flor & Cera',
  slug: 'flor-and-cera-app',
  description:
    'Flor & Cera es una aplicación que permite a los usuarios comprar productos artesanales como jabones y velas, así como también personalizar sus propios productos con la asistencia de inteligencia artificial.',
  owner: 'johnmata0427',
  updates: {
    fallbackToCacheTimeout: 30000,
    assetPatternsToBeBundled: ['**/*'],
    checkAutomatically: 'ON_LOAD',
    useNativeDebug: false,
    useEmbeddedUpdate: true,
    disableAntiBrickingMeasures: false,
    enabled: true,
  },
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
    backgroundColor: '#ffffff',
    barStyle: 'dark-content',
  },
  notification: {
    icon: './assets/images/notification-icon.png',
    androidMode: 'collapse',
  },
  splash: {
    backgroundColor: '#ffffff',
    image: './assets/images/icon.png',
    resizeMode: 'contain',
  },
  android: {
    package: 'com.florcera.app',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.florcera.app',
    icon: './assets/images/icon.png',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
    },
    softwareKeyboardLayoutMode: 'pan',
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      'ACCESS_WIFI_STATE',
      'ACCESS_MEDIA_LOCATION',
      'READ_MEDIA_IMAGES',
      'POST_NOTIFICATIONS',
    ],
    edgeToEdgeEnabled: true,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-notifications',
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
    eas: {
      projectId: 'da873e00-ecc2-497c-883d-ab85516b71e0',
    },
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
    COLOR_EXTRACTOR: process.env.COLOR_EXTRACTOR,
  },
};

export default config;
