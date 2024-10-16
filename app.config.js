module.exports = () => {
  const environment = process.env.APP_ENV || 'dev';
  const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
  const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;

  return {
    expo: {
      name: "TalkMate AI",
      slug: "TalkMate-AI",
      owner: "jimmydevdigimind",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "com.jimmydev.talkmate",
      icon: "./assets/images/phone-logo.png",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF"
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.jimmydev.TalkMate",
        scheme: "com.jimmydev.talkmate",
        buildNumber: '2',
        runtimeVersion: "1.0.0",
        config: {
          usesNonExemptEncryption: false
        }
      },
      android: {
        package: "com.jimmydev.talkmate",
        adaptiveIcon: {
          foregroundImage: "./assets/images/splash.png",
          backgroundColor: "#ffffff"
        },
        runtimeVersion: {
          policy: "appVersion"
        }
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/phone-logo.png"
      },
      plugins: [
        [
          "expo-router",
          {
            "origin": "http://localhost:8080"
          }
        ],
        [
          "expo-font"
        ],
        [
          "expo-av",
          {
            "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone to temporarily record chat audio."
          }
        ],
        [
          "expo-screen-orientation",
          {
            "initialOrientation": "PORTRAIT"
          }
        ]
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        ENV: environment,
        GOOGLE_IOS_CLIENT_ID,
        GOOGLE_WEB_CLIENT_ID,
        BACKEND_URL: {
          dev: "http://localhost:8080/api",
          staging: "https://speakease-backend.onrender.com/api",
          prod: "https://speakease-backend.onrender.com/api"
        },
        AI_BACKEND_URL: {
          dev: "http://localhost:8000",
          staging: "https://ai-backend-785452493637.us-east1.run.app",
          prod: "https://ai-backend-785452493637.us-east1.run.app"
        },
        eas: {
          projectId: "fb518968-0eef-4a1b-9e12-afa0ce8cb20c"
        }
      }
    },
  };
};
