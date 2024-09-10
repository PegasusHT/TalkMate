// types/index.ts
export type ChatMessage = {
    role: 'user' | 'model';
    content: string;
    id: number;
    feedback?: {
      correctedVersion: string;
      explanation: string;
    };
    isLoading?: boolean;
    audioUri?: string;
  };