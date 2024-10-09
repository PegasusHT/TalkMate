const { default: plugin } = require("tailwindcss");

module.exports = () => {
  const environment = process.env.APP_ENV || 'dev';
  const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
  const  GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;

  return {
    expo: {
      name: "TalkMate AI",
      slug: "TalkMate-AI",
      owner: "jimmydevdigimind",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "com.jimmydev.talkmate",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF"
      },
      icon: "./assets/images/phone-logo.png",
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.jimmydev.TalkMate",
        scheme: "com.jimmydev.talkmate",
        buildNumber: '2',
        runtimeVersion: "1.0.0",
        usesIcloudStorage: true,
        config: {
          usesNonExemptEncryption: false
        }
      },
      updates: {
        url: "https://u.expo.dev/a9df5a4b-2126-4f44-99a0-aa848e66d363"
      },
      android: {
        package: "com.jimmydev.TalkMate",
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        runtimeVersion: {
          policy: "appVersion"
        }
      },
      extra: {
        ENV: environment,
        GOOGLE_IOS_CLIENT_ID: GOOGLE_IOS_CLIENT_ID,
        GOOGLE_WEB_CLIENT_ID: GOOGLE_WEB_CLIENT_ID,
        BACKEND_URL: {
          dev: "http://localhost:8080/api",
          staging: "https://speakease-backend.onrender.com/api",
          prod: "https://speakease-backend.onrender.com/api"
        },
        AI_BACKEND_URL:{
          dev: "http://localhost:8000",
          staging: "https://ai-backend-785452493637.us-east1.run.app",
          prod: "https://ai-backend-785452493637.us-east1.run.app"
        },
        eas: {
          projectId: "fb518968-0eef-4a1b-9e12-afa0ce8cb20c"
        }
      },
  
    },
  };
};