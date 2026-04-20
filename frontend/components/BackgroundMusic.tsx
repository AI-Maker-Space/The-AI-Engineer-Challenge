'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * BackgroundMusic Component
 * 
 * Provides soothing background music similar to Minecraft's soundscape.
 * Uses a royalty-free ambient track that loops seamlessly.
 * 
 * The music is intentionally subtle and calming, designed to enhance
 * focus and relaxation without being distracting.
 * Autoplays on mount with only a mute/unmute control.
 */
export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sourceIndexRef = useRef(0);

  // Audio sources - try in order if one fails
  const audioSources = [
    '/music/ambient-background.mp3',
    'https://archive.org/download/MinecraftVolumeAlpha/03%20Subwoofer%20Lullaby.mp3',
    'https://ia800504.us.archive.org/10/items/MinecraftVolumeAlpha/03%20Subwoofer%20Lullaby.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  ];

  // Initialize audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25; // Set to 25% volume for subtle background
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    }
  }, []);

  // Try loading next source if current one fails
  const tryNextSource = () => {
    if (audioRef.current && sourceIndexRef.current < audioSources.length) {
      const src = audioSources[sourceIndexRef.current];
      sourceIndexRef.current++;
      audioRef.current.src = src;
      audioRef.current.load();
    }
  };

  // Handle audio loading errors
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      console.log('Audio source error, trying next source...');
      if (sourceIndexRef.current < audioSources.length) {
        setTimeout(tryNextSource, 500);
      }
    };

    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Start with first source
  useEffect(() => {
    if (audioRef.current && sourceIndexRef.current === 0) {
      tryNextSource();
    }
  }, []);

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Music started');
      } catch (error) {
        console.error('Error playing audio:', error);
        // Try next source if play fails
        if (sourceIndexRef.current < audioSources.length) {
          tryNextSource();
          setTimeout(handlePlay, 500);
        }
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        loop
      >
        {/* Audio sources will be set programmatically for better error handling */}
        Your browser does not support the audio element.
      </audio>

      <div className="music-controls">
        <button
          className="music-button play-button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        {isPlaying && (
          <button
            className="music-button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            title={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        )}
      </div>
    </>
  );
}

