
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, X, Star } from 'lucide-react';
import { MESSAGES, PHOTOS, MIRROR_PHOTOS } from '../constants';
import { AppStage, PhotoData } from '../types';

interface MessageRevealProps {
  onPhotoClick: (photo: PhotoData) => void;
  stage: AppStage;
  setStage: (stage: AppStage) => void;
}

export const MessageReveal: React.FC<MessageRevealProps> = ({ onPhotoClick, stage, setStage }) => {
  const [openedBoxes, setOpenedBoxes] = useState<number[]>([]);
  const [activeMemoryId, setActiveMemoryId] = useState<number | null>(null);

  useEffect(() => {
    if (stage === 'bond') {
      const timer = setTimeout(() => setStage('final'), 4500);
      return () => clearTimeout(timer);
    }
  }, [stage, setStage]);

  const handleOpenBox = (id: number) => setActiveMemoryId(id);
  const handleCloseMemory = () => {
    if (activeMemoryId !== null && !openedBoxes.includes(activeMemoryId)) {
        setOpenedBoxes(prev => [...prev, activeMemoryId]);
    }
    setActiveMemoryId(null);
  };

  const allOpened = openedBoxes.length === MESSAGES.length;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'messages' && (
          <motion.div 
            key="gift-grid" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="h-full w-full flex flex-col items-center justify-center p-4 overflow-y-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-4xl font-elegant uppercase tracking-widest font-bold text-white">5 Promise by me </h2>
              <p className="text-[9px] text-pink-400 mt-1 uppercase tracking-widest font-heading">Tap each to unlock my promise</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-4xl px-2">
              {MESSAGES.map((msg, idx) => {
                const isViewed = openedBoxes.includes(msg.id);
                const mirrorPhoto = MIRROR_PHOTOS[idx] || PHOTOS[idx];
                
                return (
                  <motion.div
                    key={msg.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenBox(msg.id)}
                    className="group aspect-[4/5] sm:aspect-[3/4] rounded-xl border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm shadow-xl"
                  >
                    <div className="absolute inset-0">
                      <img src={mirrorPhoto.url} className="w-full h-full object-cover blur-md opacity-30" alt="" />
                    </div>
                    <div className="relative z-10 text-center p-4">
                      <Heart size={28} fill={isViewed ? "#ff007f" : "none"} className={`mx-auto transition-colors duration-500 ${isViewed ? 'text-pink-500' : 'text-white/20'}`} />
                      <p className="mt-3 text-[10px] font-heading font-black tracking-tighter uppercase text-white/80">
                        {isViewed ? 'UNLOCKED' : 'LOCKED'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 min-h-[60px]">
              {allOpened && (
                <motion.button 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  onClick={() => setStage('bond')} 
                  className="px-6 py-2 text -[12px] rounded-full border border-pink-500 text-pink-500 font-heading font-black uppercase fixed bottom-6 right-4 z-50 md:static md:px-12 md:py-4"
                >
                  SEE OUR BOND <ArrowRight size={16} className="inline ml-2" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {activeMemoryId !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[6000] bg-black/98 flex flex-col items-center justify-center p-6 backdrop-blur-2xl">
              <button onClick={handleCloseMemory} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white"><X size={24} /></button>
              <div className="flex flex-col items-center max-w-md text-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                  <img src={MIRROR_PHOTOS[MESSAGES.findIndex(m => m.id === activeMemoryId)].url} className="w-full h-full object-cover" alt="" />
                </div>
                <h3 className="text-3xl font-elegant text-accent-pink mb-4 italic font-bold">{MESSAGES.find(m => m.id === activeMemoryId)?.title}</h3>
                <p className="text-xl font-romantic text-white leading-relaxed italic mb-8">"{MESSAGES.find(m => m.id === activeMemoryId)?.content}"</p>
                <button onClick={handleCloseMemory} className="px-10 py-3 bg-pink-500 text-white rounded-full font-heading text-[10px] uppercase tracking-widest">CLOSE</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'bond' && (
          <motion.div key="bond" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center">
            <Heart size={80} fill="#ff007f" className="text-pink-500 mb-8" />
            <h2 className="text-4xl sm:text-6xl font-romantic text-accent-pink leading-tight"> this is my message ,</h2>
            <h3 className="text-3xl sm:text-5xl font-romantic text-white/40 mt-6 italic font-bold"></h3>
          </motion.div>
        )}

        {stage === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-lg w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col items-center">
              <Sparkles className="text-pink-400 mb-6" size={32} />
              <h2 className="text-4xl sm:text-6xl font-elegant text-accent-pink mb-6 font-bold uppercase">Always Beside You</h2>
              <p className="text-xl sm:text-2xl font-romantic text-white leading-relaxed mb-10 italic">"YOU ALWAYS MY FAVROITE PERSON AND MORE THAN LIKE A FAMILY YOU ARE I AM GRATFULL TO HAVEA A FRIEND LIKE YOU IN MY LIFE SO.. HAPPY BIRTHDAY PANDA ALWAYS SMILE AND I ALWAYS THERE FOR YOU ,. Happy Birthday!"</p>
              <button onClick={() => window.location.reload()} className="w-full py-4 rounded-full border border-pink-500 bg-pink-500/20 text-white font-heading text-[10px] uppercase tracking-widest font-black">
                REPLAY STORY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
