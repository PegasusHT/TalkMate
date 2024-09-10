import Constants from 'expo-constants';

export const getEnvironment = (): 'dev' | 'staging' | 'prod' => {
  return (Constants.expoConfig?.extra?.ENV as 'dev' | 'staging' | 'prod') || 'dev';
};

type EnvConfig = {
  BACKEND_URL: string;
  AI_BACKEND_URL: string;
};

export const getEnvironmentConfig = (): EnvConfig => {
  const environment = getEnvironment();
  const envConfig = Constants.expoConfig?.extra || {};

  return {
    BACKEND_URL: envConfig.BACKEND_URL?.[environment] || '',
    AI_BACKEND_URL: envConfig.AI_BACKEND_URL?.[environment] || '',
  };
};

const ENV = getEnvironmentConfig();

export default ENV;