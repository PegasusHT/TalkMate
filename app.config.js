module.exports = () => {
  const environment = process.env.APP_ENV || 'dev';
  const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
  const  GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;

  return {
    expo: {
      name: "TalkMate",
      slug: "TalkMate",
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
        bundleIdentifier: "com.jimmydev.TalkMate"
      },
      android: {
        package: "com.jimmydev.TalkMate",
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff"
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
          staging: "https://ai-backend-378206958409.us-east1.run.app",
          prod: "http://localhost:8000"
        }
      },
    },
  };
};