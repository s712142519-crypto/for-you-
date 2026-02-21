
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppStage, PhotoData } from './types';
import { FlowerGrowth } from './components/FlowerGrowth';
import { MessageReveal } from './components/MessageReveal';
import { Atmosphere } from './components/Atmosphere';
import { Countdown } from './components/Countdown';
import { FullscreenVideo } from './components/FullscreenVideo';
import { Flower2, X, RotateCcw, Play } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro-1');
  const [hasStarted, setHasStarted] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!hasStarted) return;
    
    if (stage === 'intro-1') {
      const timer = setTimeout(() => setStage('intro-2'), 3500);
      return () => clearTimeout(timer);
    }
    if (stage === 'intro-2') {
      const timer = setTimeout(() => setStage('countdown'), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage, hasStarted]);

  const startApp = () => {
    setHasStarted(true);
    // There is no background music logic here. 
    // This interaction is used to allow video audio to play.
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col items-center overflow-hidden touch-none select-none">
      <Atmosphere />
      
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,127,0.1),transparent_70%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 text-center z-[1000] bg-black"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mb-10"
            >
              <HeartIcon className="w-24 h-24 text-pink-500 mx-auto drop-shadow-[0_0_20px_rgba(255,0,127,0.5)]" />
            </motion.div>
            <h1 className="text-4xl font-romantic text-white mb-4">Fazana's Birthday</h1>
            <p className="text-[10px] font-heading text-white/40 uppercase tracking-[0.4em] mb-12">A special gift just for you</p>
            
            <button 
              onClick={startApp}
              className="px-12 py-5 bg-pink-600 rounded-full text-white font-heading text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-4 shadow-[0_0_40px_rgba(219,39,119,0.3)] active:scale-90 transition-all"
            >
              <Play size={18} fill="currentColor" /> Start the Magic
            </button>
            <p className="mt-8 text-[9px] text-white/30 uppercase tracking-widest italic">Ensure sound is on for the surprise</p>
          </motion.div>
        ) : (
          <>
            {stage === 'intro-1' && (
              <motion.div 
                key="intro-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(20px)', y: -30 }}
                className="h-full w-full flex flex-col items-center justify-center p-6 text-center z-10"
              >
                <motion.h2 className="text-5xl sm:text-7xl md:text-8xl font-romantic text-accent-pink mb-10 px-4 leading-tight">
                  This is for you I made...
                </motion.h2>
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "120px" }} 
                    className="h-[2px] bg-pink-500 rounded-full" 
                />
              </motion.div>
            )}

            {stage === 'intro-2' && (
              <motion.div 
                key="intro-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                className="h-full w-full flex flex-col items-center justify-center p-6 text-center z-10"
              >
                <motion.p className="text-4xl sm:text-6xl md:text-7xl font-romantic text-accent-purple leading-tight max-w-4xl px-4 italic font-bold">
                Let's start in...
                </motion.p>
              </motion.div>
            )}

            {stage === 'countdown' && <Countdown key="countdown" onComplete={() => setStage('video-reveal')} />}

            {stage === 'video-reveal' && <FullscreenVideo key="video" onComplete={() => setStage('growing')} />}

            {stage === 'growing' && (
              <FlowerGrowth 
                key="growth" 
                onComplete={() => {
                  setStage('messages');
                  setShowMainContent(true);
                }} 
              />
            )}

            {showMainContent && (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full flex flex-col items-center z-10 relative overflow-hidden">
                <div className="w-full flex items-center justify-between px-8 pt-6 h-[12vh]">
                  <Flower2 size={24} className="text-pink-500/40" />
                  <h1 className="text-2xl sm:text-4xl font-elegant text-white uppercase tracking-[0.5em] font-bold">Fazana</h1>
                  <Flower2 size={24} className="text-purple-500/40" />
                </div>

                <div className="flex-1 w-full relative">
                  {(stage === 'messages' || stage === 'bond' || stage === 'final') && (
                    <MessageReveal stage={stage} setStage={setStage} onPhotoClick={(p) => setSelectedPhoto(p)} />
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-black/98 flex flex-col items-center justify-center p-4 backdrop-blur-2xl">
            <button onClick={closePhoto} className="absolute top-4 right-6 mt-4 p-4 rounded-full bg-white/10 text-white z-[5100] border border-white/10 active:scale-90"><X size={24} /></button>
            <motion.div animate={{ rotate: rotation }} className="relative max-h-[65vh] w-full flex items-center justify-center">
              <img src={selectedPhoto.url} className="max-h-[65vh] max-w-full object-contain rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" alt="" />
            </motion.div>
            <div className="mt-8 text-center px-4">
              <h3 className="text-2xl sm:text-4xl font-romantic text-pink-400 italic mb-8 drop-shadow-lg">{selectedPhoto.caption}</h3>
              <div className="flex gap-8 justify-center">
                <button onClick={() => setRotation(r => r - 90)} className="p-4 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-all"><RotateCcw size={24} /></button>
                <button onClick={() => setRotation(r => r + 90)} className="p-4 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-all"><RotateCcw size={24} className="scale-x-[-1]" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeartIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

export default App;
