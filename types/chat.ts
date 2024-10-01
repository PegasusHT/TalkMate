// types/index.ts

export type FeedbackType = 'NONE' | 'MINOR' | 'MAJOR';

export type Feedback = {
  correctedVersion: string;
  explanation: string;
  feedbackType: FeedbackType;
  isCorrect: boolean;
};

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  id: number;
  feedback?: Feedback;
  isLoading?: boolean;
  audioUri?: string;
};