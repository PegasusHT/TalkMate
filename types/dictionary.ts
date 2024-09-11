export type PerformanceData = {
  recording_transcript: string;
  real_and_transcribed_words: [string, string][];
  real_and_transcribed_words_ipa: [string, string][];
  pronunciation_accuracy: number;
  current_words_pronunciation_accuracy: number[];
  pronunciation_categories: number[];
  real_words_phonetic: string[];
  recorded_words_phonetic: string[];
  audio_uri?: string;
};

export type PhoneticWord = {
  word: string;
  accuracy?: number;
};

export type DictionaryDefinition = {
  word: string;
  phonetic: string;
  meanings: {
    part_of_speech: string;
    definitions: {
      definition: string;
      example: string;
    }[];
  }[];
  audio_url: string | null;
} | null;
