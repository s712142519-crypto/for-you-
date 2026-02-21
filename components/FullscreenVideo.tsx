
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { VIDEO_PATH } from '../constants';

interface FullscreenVideoProps {
  onComplete: () => void;
}

export const FullscreenVideo: React.FC<FullscreenVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        // Since user clicked "Start" on previous screen, we can play unmuted
        video.muted = false;
        await video.play();
        setIsMuted(false);
      } catch (error) {
        console.warn("Unmuted playback failed, falling back to muted autoplay", error);
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => setHasError(true));
      }
    };
    
    playVideo();
  }, []);

  const handleEnd = () => {
    if (isEnding) return;
    setIsEnding(true);
    setTimeout(onComplete, 1200);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-4 uppercase tracking-tighter text-white">Video Surprise</h2>
            <p className="text-white/60 font-romantic text-lg max-w-xs mb-8">
                We couldn't load the video. Make sure it's at:<br/>
                <span className="text-orange-400 font-sans text-sm bg-white/5 px-2 py-1 rounded inline-block mt-2">videos/birthday_video.mp4</span>
            </p>
            <div className="space-y-4 w-full max-w-xs">
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-white/10 rounded-full text-white font-heading text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5"
                >
                    <RefreshCw size={14} /> Retry
                </button>
                <button 
                    onClick={handleEnd}
                    className="w-full py-4 bg-orange-600 rounded-full text-white font-heading text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/20"
                >
                    Continue to Gift
                </button>
            </div>
        </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: isEnding ? 0 : 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,68,0,0.1)_0%,transparent_70%)]" />

      <video 
        ref={videoRef}
        playsInline
        onError={handleVideoError}
        className="w-full h-full object-contain relative z-10"
        onEnded={handleEnd}
      >
        <source src={VIDEO_PATH} type="video/mp4" />
      </video>

      {!isEnding && (
        <div className="absolute top-6 right-6 flex gap-4 z-40">
          <button 
            onClick={() => {
              if (videoRef.current) {
                const newMuted = !videoRef.current.muted;
                videoRef.current.muted = newMuted;
                setIsMuted(newMuted);
              }
            }}
            className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white shadow-xl"
          >
            {isMuted ? <VolumeX size={20} className="text-orange-500" /> : <Volume2 size={20} />}
          </button>
        </div>
      )}

      {!isEnding && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          onClick={handleEnd}
          className="absolute bottom-10 px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-heading text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-orange-600/20 transition-all z-40"
        >
          Skip Surprise <ArrowRight size={14} />
        </motion.button>
      )}

      <div className="absolute inset-0 border-[1px] border-orange-500/20 pointer-events-none z-20" />
    </motion.div>
  );
};
