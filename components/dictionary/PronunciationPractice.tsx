import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Text from '@/components/customText';
import { Mic, Volume2, VolumeX, Snail, ArrowLeft } from 'lucide-react-native';
import PronunciationPerformanceModal from '@/components/dictionary/PronunciationPerformanceModal';
import ENV from '@/utils/envConfig';
import { PerformanceData, PhoneticWord, DictionaryDefinition } from '@/types/dictionary';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePronunciationAudio } from '@/hooks/pronunciation/usePronunAudio';
import { usePronunciationRecording } from '@/hooks/pronunciation/usePronunRecording';
import PhoneticDisplay from '@/components/dictionary/PhoneticDisplay';

type PronunciationPracticeProp = {
  sentence: string;
};

const PronunciationPractice: React.FC<PronunciationPracticeProp> = ({ sentence }) => {
  const [isScreenActive, setIsScreenActive] = useState(true);
  const [performanceResult, setPerformanceResult] = useState<PerformanceData | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [phoneticWords, setPhoneticWords] = useState<PhoneticWord[]>([]);
  const [dictionaryDefinition, setDictionaryDefinition] = useState<DictionaryDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const navigation = useNavigation();
  const hasAutoPlayed = useRef(false);

  const { isPlaying, isLoadingAudio, playSound, stopSound } = usePronunciationAudio(sentence, isScreenActive);

  const updatePhoneticAccuracy = useCallback((accuracies: number[]) => {
    setPhoneticWords(prevWords => 
      prevWords.map((word, index) => ({
        ...word,
        accuracy: accuracies[index]
      }))
    );
  }, []);
  
  const { isRecording, isProcessing, handleMicPress } = usePronunciationRecording(
    sentence,
    isScreenActive,
    updatePhoneticAccuracy,
    setPerformanceResult,
    setShowPerformanceModal
  );

  const handleBackPress = useCallback(async () => {
    setIsScreenActive(false);
    await stopSound();
    navigation.goBack();
  }, [navigation, stopSound]);

  const fetchPhonetic = useCallback(async () => {
    if (!isScreenActive) return;
    try {
      const formData = new FormData();
      formData.append('text', sentence);
  
      const response = await fetch(`${ENV.AI_BACKEND_URL}/get_phonetic/`, {
        method: 'POST',
        body: formData,
      });
  
      if (!isScreenActive) return;
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result && result.phonetic) {
        const words = result.phonetic.split(' ');
        setPhoneticWords(words.map((word: string) => ({ word })));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.log('Failed to fetch phonetic', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to fetch phonetic transcription. Please try again.');
      }
    }
  }, [isScreenActive, sentence]);

  const fetchDictionaryDefinition = useCallback(async (word: string) => {
    if (!isScreenActive) return;
    setIsLoadingDefinition(true);
    try {
      const response = await fetch(`${ENV.AI_BACKEND_URL}/dictionary/${word}`);
      if (!isScreenActive) return;
      if (response.status === 404) {
        setDictionaryDefinition(null);
      } else if (response.ok) {
        const data = await response.json();
        setDictionaryDefinition(data);
      } else {
        console.log(`Unexpected response status: ${response.status}`);
        setDictionaryDefinition(null);
      }
    } catch (error) {
      console.log('Failed to fetch dictionary definition', error);
      setDictionaryDefinition(null);
    } finally {
      setIsLoadingDefinition(false);
    }
  }, [isScreenActive]);

  useEffect(() => {
    if (isScreenActive) {
      fetchPhonetic();
      if (sentence.trim().split(/\s+/).length === 1) {
        fetchDictionaryDefinition(sentence.trim());
      } else {
        setDictionaryDefinition(null);
      }
      hasAutoPlayed.current = false;
    }
  }, [sentence, isScreenActive, fetchPhonetic, fetchDictionaryDefinition]);

  useEffect(() => {
    if (isScreenActive && !isLoadingAudio && !isPlaying && !hasAutoPlayed.current) {
      playSound();
      hasAutoPlayed.current = true;
    }
  }, [isScreenActive, isLoadingAudio, isPlaying, playSound]);

  const getColorForAccuracy = useCallback((accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-gray-600';
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }, []);

  const handleTryAgain = useCallback(() => {
    setShowPerformanceModal(false);
    setPerformanceResult(null);
    setPhoneticWords(prevWords => prevWords.map(word => ({ word: word.word })));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className=''>
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-start px-4 pt-4">
        <Text className="text-2xl font-NunitoBold mb-1 mt-4">{sentence}</Text>
        <PhoneticDisplay phoneticWords={phoneticWords} getColorForAccuracy={getColorForAccuracy} />
        <View className="flex-row justify-start space-x-4 mb-4">
          <TouchableOpacity onPress={() => playSound()} disabled={isPlaying || isLoadingAudio}>
            <Volume2 color={isPlaying || isLoadingAudio ? "gray" : "black"} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playSound(0.5)} disabled={isPlaying || isLoadingAudio}>
            <Snail color={isPlaying || isLoadingAudio ? "gray" : "black"} size={24} />
          </TouchableOpacity>
          {isPlaying && (
            <TouchableOpacity onPress={stopSound}>
              <VolumeX color="black" size={24} />
            </TouchableOpacity>
          )}
        </View>
        {isLoadingDefinition ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <>
            {dictionaryDefinition ? (
              <View className="mb-4">
                {dictionaryDefinition.meanings.map((meaning, index) => (
                  <View key={index} className="mb-2">
                    <Text className="font-NunitoSemiBold">{meaning.part_of_speech}</Text>
                    {meaning.definitions.map((def, defIndex) => (
                      <View key={defIndex} className="ml-4">
                        <Text>{defIndex + 1}. {def.definition}</Text>
                        {def.example && <Text className="italic">Example: {def.example}</Text>}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              sentence.trim().split(/\s+/).length === 1 && (
                <Text className="text-gray-500 italic mb-4">No definition found for this word.</Text>
              )
            )}
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={handleMicPress}
        disabled={isProcessing || isPlaying}
        className={`self-center p-6 rounded-full ${
          isRecording ? 'bg-red-500' : isProcessing || isPlaying ? 'bg-gray-500' : 'bg-primary-500'
        }`}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Mic color="white" size={32} />
        )}
      </TouchableOpacity>
      {performanceResult && (
        <PronunciationPerformanceModal
          isVisible={showPerformanceModal}
          onClose={() => setShowPerformanceModal(false)}
          performanceData={performanceResult}
          onTryAgain={handleTryAgain}
        />
      )}
    </SafeAreaView>
  );
};

export default PronunciationPractice;