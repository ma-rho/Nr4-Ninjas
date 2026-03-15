'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    // Reset state when src changes
    setIsPlaying(false);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          if (error.name !== 'AbortError') {
            console.error("Error playing audio:", error);
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const audio = audioRef.current;
    if(audio) {
        audio.volume = newVolume;
        setVolume(newVolume);
        if (newVolume > 0) {
            setIsMuted(false);
            audio.muted = false;
        }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if(audio) {
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-background/50 rounded-lg p-4 space-y-4">
        <audio ref={audioRef} preload="metadata"></audio>

        <div className="flex items-center gap-4">
            <span className="text-xs w-12 text-center tabular-nums">{formatTime(currentTime)}</span>
            <Slider 
                value={[currentTime]}
                max={duration || 1}
                onValueChange={handleSeek}
                className="w-full"
            />
            <span className="text-xs w-12 text-center tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="flex justify-center items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}>
                <Rewind />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}>
                <FastForward />
            </Button>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <Slider
                value={isMuted ? [0] : [volume]}
                max={1}
                step={0.05}
                onValueChange={handleVolumeChange}
                className="w-24"
             />
        </div>
    </div>
  )
}