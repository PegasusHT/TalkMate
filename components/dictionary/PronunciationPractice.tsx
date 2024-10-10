import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Text from '@/components/customText';
import { Mic, Volume2, VolumeX, Snail, ArrowLeft } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import PronunciationPerformanceModal from '@/components/dictionary/PronunciationPerformanceModal';
import ENV from '@/utils/envConfig';
import { PerformanceData, PhoneticWord, DictionaryDefinition, RecordedWordsPhoneticsMap } from '@/types/dictionary';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';
import PerformanceSound from './utils/PerformanceSound';
import { primaryColor, secondaryColor } from '@/constant/color';
import { getColorForAccuracy } from '@/components/dictionary/PronunciationPerformanceModal';
import WordPerformanceModal from './WordPerformanceModal';

type PronunciationPracticeProp = {
  sentence: string;
};

const PronunciationPractice: React.FC<PronunciationPracticeProp> = ({ sentence }) => {
  const isScreenActiveRef = useRef(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceResult, setPerformanceResult] = useState<PerformanceData | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [phoneticWords, setPhoneticWords] = useState<Array<{ word: string, phonetic: string, accuracy?: number }>>([]);
  const [permissionStatus, setPermissionStatus] = useState<Audio.PermissionStatus | null>(null);
  const recordingObject = useRef<Audio.Recording | null>(null);
  const soundObject = useRef<Audio.Sound | null>(null);
  const audioBase64Ref = useRef<string | null>(null);
  const [dictionaryDefinition, setDictionaryDefinition] = useState<DictionaryDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const navigation = useNavigation();
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();
  const [performanceScore, setPerformanceScore] = useState<number | null>(null);
  const [showUnderline, setShowUnderline] = useState(false);
  const [selectedWord, setSelectedWord] = useState<PhoneticWord | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [recordedWordsPhoneticsMap, setRecordedWordsPhoneticsMap] = useState<RecordedWordsPhoneticsMap>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const isLongSentence = sentence.length > 100;

  const handleBackPress = useCallback(async () => {
    isScreenActiveRef.current = false;
    await stopAllActivities();
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    return () => {
      isScreenActiveRef.current = false;
      stopAllActivities();
    };
  }, []);
  
  const stopAllActivities = async () => {
    if (recordingObject.current) {
      try {
        await recordingObject.current.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      recordingObject.current = null;
    }
    setIsRecording(false);
    if (isPlaying) {
      await stopSound();
    }
    setIsProcessing(false);
    setIsLoadingAudio(false);
  };

  useEffect(() => {
    if (isScreenActiveRef.current) {
      fetchPhonetic();
      checkPermissions();
      if (sentence.trim().split(/\s+/).length === 1) {
        fetchDictionaryDefinition(sentence.trim());
      } else {
        setDictionaryDefinition(null);
      }

      const autoPlayAudio = async () => {
        await fetchAudio();
        playSound();
      };

      autoPlayAudio();
    }

    return () => {
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
      stopAllActivities();
    };
  }, [sentence, isScreenActiveRef]);

  const fetchDictionaryDefinition = async (word: string) => {
    if (!isScreenActiveRef.current) return;
    setIsLoadingDefinition(true);
    try {
      const response = await fetch(`${ENV.AI_BACKEND_URL}/dictionary/${word}`);
      if (!isScreenActiveRef.current) return;
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
  };

  const checkPermissions = async () => {
    const { status } = await Audio.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setPermissionStatus(status);
    return status;
  };

  const fetchPhonetic = async () => {
    if (!isScreenActiveRef.current) return;
    try {
      const formData = new FormData();
      formData.append('text', sentence);
  
      const response = await fetch(`${ENV.AI_BACKEND_URL}/get_phonetic/`, {
        method: 'POST',
        body: formData,
      });
  
      if (!isScreenActiveRef.current) return;
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result && result.phonetic) {
        const words = sentence.split(' ');
        const phonetics = result.phonetic.split(' ');
        setPhoneticWords(words.map((word, index) => ({ 
          word, 
          phonetic: phonetics[index] || '' 
        })));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.log('Failed to fetch phonetic', error);
      if (isScreenActiveRef.current) {
        Alert.alert('Error', 'Failed to fetch phonetic transcription. Please try again.');
      }
    }
  };

  const fetchAudio = async () => {
    if (audioBase64Ref.current || !isScreenActiveRef.current) return;
  
    setIsLoadingAudio(true);
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('text', sentence);
  
      const response = await fetch(`${ENV.AI_BACKEND_URL}/tts/`, {
        method: 'POST',
        body: formData,
      });
  
      if (!isScreenActiveRef.current) return;
      setIsProcessing(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      audioBase64Ref.current = data.audio.split(',');
    } catch (error) {
      console.log('Error fetching audio:', error);
      if (isScreenActiveRef.current) {
        Alert.alert('Error', 'Failed to fetch the audio. Please try again.');
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const playSound = async (rate: number = 1.0) => {
    if (isPlaying || !isScreenActiveRef.current) {
      await stopSound();
    }
  
    if (!audioBase64Ref.current) {
      await fetchAudio();
    }
  
    if (!audioBase64Ref.current || !isScreenActiveRef.current) return;
  
    try {
      setIsPlaying(true);
      for (const audioSegment of audioBase64Ref.current) {
        if (!isScreenActiveRef.current) break;
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: `data:audio/wav;base64,${audioSegment}` },
          { shouldPlay: true, rate }
        );
        soundObject.current = newSound;
  
        await new Promise<void>((resolve) => {
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
              newSound.unloadAsync();
              resolve();
            }
          });
        });
      }
    } catch (error) {
      console.log('Error playing sound:', error);
      if (isScreenActiveRef.current) {
        Alert.alert('Error', 'Failed to play the sentence. Please try again.');
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (soundObject.current) {
      await soundObject.current.stopAsync();
      await soundObject.current.unloadAsync();
      soundObject.current = null;
    }
    setIsPlaying(false);
  };

  const updatePhoneticAccuracy = (accuracies: number[]) => {
    setPhoneticWords(prevWords => 
      prevWords.map((item, index) => ({
        ...item,
        accuracy: accuracies[index]
      }))
    );
    setShowUnderline(true);
  };

  const handleMicPress = useCallback(async () => {
    if (!isScreenActiveRef.current) return;
  
    if (isPlaying) {
      Alert.alert('Audio Playing', 'Please wait for the audio to finish before recording.');
      return;
    }
  
    if (permissionStatus !== 'granted') {
      const newStatus = await requestPermissions();
      if (newStatus !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio. Please enable it in your device settings.');
        return;
      }
    }
  
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      try {
        await setRecordingMode();
        await recordingObject.current?.stopAndUnloadAsync();
        const uri = recordingObject.current?.getURI();
        if (!uri) throw new Error('No recording URI found');
  
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const formData = new FormData();
        formData.append('title', sentence);
        formData.append('base64Audio', `data:audio/m4a;base64,${base64Audio}`);
  
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
  
        const response = await fetch(`${ENV.AI_BACKEND_URL}/assess_pronunciation/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!isScreenActiveRef.current) return;
  
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Server response:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        let result = await response.json();
        
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (parseError) {
            console.log('Failed to parse double-encoded JSON:', parseError);
          }
        }      
        
        if (result && typeof result === 'object' && 'recording_transcript' in result) {
          if (!result.recording_transcript || result.recording_transcript.trim() === '') {
            Alert.alert('Warning', 'No speech detected. Please try speaking louder or move to a quieter environment.');
          } else {
            setPerformanceResult({ ...result, audio_uri: uri });
            setShowPerformanceModal(true);
            updatePhoneticAccuracy(result.current_words_pronunciation_accuracy);
            setPerformanceScore(result.pronunciation_accuracy);
  
            const recordedMap: RecordedWordsPhoneticsMap = {};
            if (Array.isArray(result.real_and_transcribed_words) && Array.isArray(result.recorded_words_phonetic)) {
              result.real_and_transcribed_words.forEach((pair: [string, string], index: number) => {
                if (typeof pair[0] === 'string') {
                  recordedMap[pair[0]] = result.recorded_words_phonetic[index] || '';
                }
              });
            }
            setRecordedWordsPhoneticsMap(recordedMap);
          }
        } else {
          throw new Error('Unexpected response format from the server');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('Error message:', error.message);
        }
        if (isScreenActiveRef.current) {
          Alert.alert('Error', 'Failed to process your pronunciation. Please try again.');
        }
      } finally {
        setIsProcessing(false);
        recordingObject.current = null;
      }
    } else {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        if (recordingObject.current) {
          await recordingObject.current.stopAndUnloadAsync();
        }
  
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingObject.current = recording;
        setIsRecording(true);
      } catch (error) {
        console.log('Failed to start recording', error);
        if (isScreenActiveRef.current) {
          Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
        }
      }
    }
  }, [isScreenActiveRef, isRecording, isPlaying, sentence, permissionStatus, setRecordingMode, updatePhoneticAccuracy]);

  const handleTryAgain = async () => {
    await setShowPerformanceModal(false);
    await setPerformanceResult(null);
    await resetColors();
    handleMicPress()
  };

  const handleTryNewWord = useCallback(async () => {
    await stopAllActivities();
    isScreenActiveRef.current =false;
    navigation.goBack();
  }, [navigation, stopAllActivities]);

  const handleWordPress = (word: PhoneticWord) => {
    setSelectedWord({
      ...word,
      userSaid: recordedWordsPhoneticsMap[word.word] || ''
    });
    setShowWordModal(true);
  };

  const resetColors = useCallback(() => {
    setPhoneticWords(prevWords => prevWords.map(word => ({ 
      ...word, 
      accuracy: undefined 
    })));
    setShowUnderline(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className=''>
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-start px-4 pt-4">
        <View className="flex-row flex-wrap mb-1 mt-4">
          {phoneticWords.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleWordPress(item)}>
              <Text
                className={`${isLongSentence ? 'text-2xl' : 'text-4xl'} font-NunitoBold mr-2 ${getColorForAccuracy(item.accuracy)} ${
                  showUnderline ? 'underline' : ''
                }`}
              >
                {item.word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View className="flex-row flex-wrap mb-2">
          <Text className={`${isLongSentence ? 'text-base' : 'text-lg'} mr-1`}>/</Text>
          {phoneticWords.map((phoneticWord, index) => (
            <Text 
              key={index} 
              className={`${isLongSentence ? 'text-base' : 'text-lg'} mr-1 ${getColorForAccuracy(phoneticWord.accuracy)}`}
            >
              {phoneticWord.phonetic}
            </Text>
          ))}
          <Text className={`${isLongSentence ? 'text-base' : 'text-lg'} mr-1`}>/</Text>
        </View>

        <View className="flex-row justify-start space-x-4 my-4">
          <TouchableOpacity className='rounded-full border-[0.4px] p-2'
           onPress={() => playSound()} disabled={isPlaying || isLoadingAudio || isRecording}>
            <Volume2 color={isPlaying || isLoadingAudio || isRecording ? "gray" : "black"} size={20} />
          </TouchableOpacity>
          <TouchableOpacity className='rounded-full border-[0.4px] p-2'
           onPress={() => playSound(0.75)} disabled={isPlaying || isLoadingAudio || isRecording}>
            <Snail color={isPlaying || isLoadingAudio || isRecording ? "gray" : "black"} size={20} />
          </TouchableOpacity>
          {isPlaying && (
            <TouchableOpacity  className='rounded-full border-[0.4px] p-2' onPress={stopSound}>
              <VolumeX color="black" size={20} />
            </TouchableOpacity>
          )}
        </View>
        {isLoadingDefinition ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <>
            {dictionaryDefinition ? (
              <ScrollView className="mb-4">
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
              </ScrollView>
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
      <PerformanceSound score={performanceScore} isVisible={showPerformanceModal} />
      {performanceResult && (
        <PronunciationPerformanceModal
          isVisible={showPerformanceModal}
          onClose={() => {
            setShowPerformanceModal(false);
          }}
          performanceData={performanceResult}
          onTryAgain={handleTryAgain}
          setShowUnderline={setShowUnderline}
          onTryNewWord={handleTryNewWord} 
        />
      )}
      {selectedWord && (
        <WordPerformanceModal
          isVisible={showWordModal}
          onClose={() => setShowWordModal(false)}
          word={selectedWord.word}
          phonetic={selectedWord.phonetic}
          score={selectedWord.accuracy || 0}
          phoneticDetails={[
            {
              phonetic: selectedWord.phonetic,
              score: selectedWord.accuracy || 0,
              userSaid: selectedWord.userSaid
            }
          ]}
        />
      )}
    </SafeAreaView>
  );
};

export default PronunciationPractice;