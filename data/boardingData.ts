import { ImageSourcePropType } from 'react-native';

interface BoardingScreen {
  title: string;
  description: string;
  image: ImageSourcePropType;
  paddingTop: number;
}

const boardingData: BoardingScreen[] = [
  {
    title: "Your Shortcut to Language Fluency",
    description: "Learn English with tailored, fun and engaging methods from your AI-powered language teachers.",
    image: require('@/assets/icons/boarding1.png') as ImageSourcePropType,
    paddingTop: 40,
  },
  {
    title: "Immerse Yourself in Real-Life Scenarios with Roleplay",
    description: "Experience immersive language learning in various settings, from casual chats to fantastical adventures.",
    image: require('@/assets/icons/boarding2.png') as ImageSourcePropType,
    paddingTop: 30,
  },
  
];

export { boardingData, BoardingScreen };