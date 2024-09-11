module.exports = () => {
  const environment = process.env.APP_ENV || 'dev';
      
  return {
    expo: {
      name: "SpeakEase",
      slug: "SpeakEase",
      version: "1.0.0",
      scheme: "speakease",
      "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2463EB"
      },
      extra: {
        ENV: environment,
        BACKEND_URL: {
          dev: "http://localhost:8080/api",
          staging: "https://speakease-backend.onrender.com/api",
          prod: "http://localhost:8080/api"
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