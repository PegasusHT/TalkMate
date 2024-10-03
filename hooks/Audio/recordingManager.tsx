//hooks/Audio/recordingManager.tsx
import { Audio } from 'expo-av';

class AudioRecordingManager {
  private static instance: AudioRecordingManager;
  private recording: Audio.Recording | null = null;

  private constructor() {}

  public static getInstance(): AudioRecordingManager {
    if (!AudioRecordingManager.instance) {
      AudioRecordingManager.instance = new AudioRecordingManager();
    }
    return AudioRecordingManager.instance;
  }

  public async startRecording(): Promise<void> {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  public async stopRecording(): Promise<string | null> {
    console.log('Stopping recording..');
    if (!this.recording) {
      console.log('No active recording to stop');
      return null;
    }
    
    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      console.log('Recording stopped and stored at', uri);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording', error);
      return null;
    }
  }

  public isRecording(): boolean {
    return !!this.recording;
  }

  public async cleanUp(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.warn('Error cleaning up recording:', error);
      }
      this.recording = null;
    }
  }
}

export default AudioRecordingManager;