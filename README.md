# TalkMate

A cross-platform app that utilizes AI to help the users practice English conversation. It will talk to the users, and give feedback about grammar, pronunciation, vocabulary, and also provides better solution for the user. tech stacks: MongoDB, React Native, TypeScript, Expo, Tailwindcss (dont use React Native stylesheets). AI: Gemini Backend: - Nodejs for app backend, - Python3, FastAPI to handle AI backend, Whisper, tts for text and audio AI.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Build and push the app

```bash
eas build --platform ios --profile production
eas submit --platform ios  
```

## Rebuild app
```bash
   npx expo prebuild
   npx expo run:ios --no-build-cache
```

## See list of ios simulator devices 
`xcrun simctl list devices`

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more
