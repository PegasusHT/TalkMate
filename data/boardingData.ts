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
    description: "Learn languages with tailored, fun and engaging methods from your AI-powered language teachers.",
    image: require('@/assets/icons/boarding1.png') as ImageSourcePropType,
    paddingTop: 40,
  },
  {
    title: "Learn with Real-life Scenarios Using Roleplay Mode",
    description: "Various settings from daily conversations to creative and fantastic dialogues.",
    image: require('@/assets/icons/boarding2.png') as ImageSourcePropType,
    paddingTop: 30,
  },
  // Add more boarding screens as needed
];

export { boardingData, BoardingScreen };