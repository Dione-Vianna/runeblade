import { useCallback } from 'react';
import { soundManager } from '../game/core/SoundManager';

export const useSoundManager = () => {
  const play = useCallback((soundType: Parameters<typeof soundManager.play>[0]) => {
    soundManager.play(soundType);
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    soundManager.setMasterVolume(volume);
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    soundManager.setSoundVolume(volume);
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    soundManager.setMusicVolume(volume);
  }, []);

  const toggleMute = useCallback(() => {
    soundManager.toggleMute();
  }, []);

  const isMuted = soundManager.isMuted;
  const getMasterVolume = () => soundManager.masterVolume;
  const getSoundVolume = () => soundManager.soundVolume;
  const getMusicVolume = () => soundManager.musicVolume;

  return {
    play,
    setMasterVolume,
    setSoundVolume,
    setMusicVolume,
    toggleMute,
    isMuted,
    masterVolume: getMasterVolume(),
    soundVolume: getSoundVolume(),
    musicVolume: getMusicVolume(),
  };
};
