import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Text from '@/components/customText';
import { Mic, Volume2, VolumeX, Snail, ArrowLeft } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import PronunciationPerformanceModal from '@/components/dictionary/PronunciationPerformanceModal';
import ENV from '@/utils/envConfig';
import { PerformanceData, PhoneticWord, DictionaryDefinition } from '@/types/dictionary';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';

type PronunciationPracticeProp = {
  sentence: string;
};

const PronunciationPractice: React.FC<PronunciationPracticeProp> = ({ sentence }) => {
  const [isScreenActive, setIsScreenActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceResult, setPerformanceResult] = useState<PerformanceData | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [phoneticWords, setPhoneticWords] = useState<PhoneticWord[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Audio.PermissionStatus | null>(null);
  const recordingObject = useRef<Audio.Recording | null>(null);
  const soundObject = useRef<Audio.Sound | null>(null);
  const audioBase64Ref = useRef<string | null>(null);
  const [dictionaryDefinition, setDictionaryDefinition] = useState<DictionaryDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const navigation = useNavigation();
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();

  const handleBackPress = useCallback(async () => {
    setIsScreenActive(false);
    await stopAllActivities();
    navigation.goBack();
  }, [navigation]);

  const stopAllActivities = async () => {
    if (isRecording) {
      await recordingObject.current?.stopAndUnloadAsync();
      setIsRecording(false);
    }
    if (isPlaying) {
      await stopSound();
    }
    setIsProcessing(false);
    setIsLoadingAudio(false);
  };

  useEffect(() => {
    if (isScreenActive) {
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
  }, [sentence, isScreenActive]);

  const fetchDictionaryDefinition = async (word: string) => {
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
      console.error('Failed to fetch phonetic', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to fetch phonetic transcription. Please try again.');
      }
    }
  };

  const getColorForAccuracy = (accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-gray-600';
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const fetchAudio = async () => {
    if (audioBase64Ref.current || !isScreenActive) return;

    setIsLoadingAudio(true);
    try {
      const formData = new FormData();
      formData.append('text', sentence);

      const response = await fetch(`${ENV.AI_BACKEND_URL}/tts/`, {
        method: 'POST',
        body: formData,
      });

      if (!isScreenActive) return;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      audioBase64Ref.current = data.audio;
    } catch (error) {
      console.error('Error fetching audio:', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to fetch the audio. Please try again.');
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const playSound = async (rate: number = 1.0) => {
    if (isPlaying || !isScreenActive) {
      await stopSound();
    }

    if (!audioBase64Ref.current) {
      await fetchAudio();
    }

    if (!audioBase64Ref.current || !isScreenActive) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64Ref.current}` },
        { shouldPlay: true, rate }
      );
      soundObject.current = newSound;
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
          if (status.didJustFinish) {
            newSound.unloadAsync();
          }
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to play the sentence. Please try again.');
      }
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

  const handleMicPress = useCallback(async () => {
    if (!isScreenActive) return;

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
  
        if (!isScreenActive) return;

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        let result = await response.json();
        
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (parseError) {
            console.error('Failed to parse double-encoded JSON:', parseError);
          }
        }      
        
        if (result && typeof result === 'object' && 'recording_transcript' in result) {
          if (!result.recording_transcript || result.recording_transcript.trim() === '') {
            Alert.alert('Warning', 'No speech detected. Please try speaking louder or move to a quieter environment.');
          } else {
            setPerformanceResult({ ...result, audio_uri: uri });
            setShowPerformanceModal(true);
            updatePhoneticAccuracy(result.current_words_pronunciation_accuracy);
          }
        } else {
          throw new Error('Unexpected response format from the server');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        if (isScreenActive) {
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
        console.error('Failed to start recording', error);
        if (isScreenActive) {
          Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
        }
      }
    }
  }, [isScreenActive, isRecording, isPlaying, sentence, permissionStatus, setRecordingMode]);

  const updatePhoneticAccuracy = (accuracies: number[]) => {
    setPhoneticWords(prevWords => 
      prevWords.map((word, index) => ({
        ...word,
        accuracy: accuracies[index]
      }))
    );
  };

  const handleTryAgain = () => {
    setShowPerformanceModal(false);
    setPerformanceResult(null);
    setPhoneticWords(prevWords => prevWords.map(word => ({ word: word.word })));
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className=''>
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-start px-4 pt-4">
        <Text className="text-2xl font-NunitoBold mb-1 mt-4">{sentence}</Text>
        <View className="flex-row flex-wrap mb-2">
          <Text className="text-lg mr-1">/</Text>
          {phoneticWords.map((phoneticWord, index) => (
            <Text 
              key={index} 
              className={`text-lg mr-1 ${getColorForAccuracy(phoneticWord.accuracy)}`}
            >
              {phoneticWord.word}
            </Text>
          ))}
          <Text className="text-lg mr-1">/</Text>
        </View>
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