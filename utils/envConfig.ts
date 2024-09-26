import Constants from 'expo-constants';

export const getEnvironment = (): 'dev' | 'staging' | 'prod' => {
  return (Constants.expoConfig?.extra?.ENV as 'dev' | 'staging' | 'prod') || 'dev';
};

type EnvConfig = {
  GOOGLE_IOS_CLIENT_ID: string;
  BACKEND_URL: string;
  AI_BACKEND_URL: string;
};

export const getEnvironmentConfig = (): EnvConfig => {
  const environment = getEnvironment();
  const envConfig = Constants.expoConfig?.extra || {};

  return {
    GOOGLE_IOS_CLIENT_ID: envConfig.GOOGLE_IOS_CLIENT_ID,
    BACKEND_URL: envConfig.BACKEND_URL?.[environment] || '',
    AI_BACKEND_URL: envConfig.AI_BACKEND_URL?.[environment] || '',
  };
};

const ENV = getEnvironmentConfig();

// console.log('Environment:', getEnvironment());
// console.log('Config:', ENV);

export default ENV;