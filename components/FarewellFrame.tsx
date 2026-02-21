
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import { PHOTOS } from '../constants';
import { PhotoData } from '../types';
import { Heart, PenTool, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface FarewellFrameProps {
  onPhotoClick: (photo: PhotoData) => void;
  onReturnToMessages: () => void;
}

type LocalStage = 'gallery' | 'typing' | 'bond' | 'choice' | 'final';

export const FarewellFrame: React.FC<FarewellFrameProps> = ({ onPhotoClick, onReturnToMessages }) => {
  const [stage, setStage] = useState<LocalStage>('gallery');
  const [featuredPhoto, setFeaturedPhoto] = useState<PhotoData | null>(PHOTOS[0]);
  const [typedMessage, setTypedMessage] = useState("");

  const carouselRef = useRef<HTMLDivElement>(null);
  const basePhotos = useMemo(() => PHOTOS.slice(0, 20), []);
  const infinitePhotos = useMemo(() => [...basePhotos, ...basePhotos, ...basePhotos], [basePhotos]);
  
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Initialize carousel position
  useEffect(() => {
    if (carouselRef.current && stage === 'gallery') {
      const itemWidth = window.innerWidth < 640 ? 110 : 150;
      x.set(-(basePhotos.length * itemWidth));
      
      controls.start({
        x: x.get() - 5000,
        transition: { duration: 180, ease: "linear", repeat: Infinity }
      });
    }
  }, [basePhotos.length, x, stage, controls]);

  const handleItemClick = (photo: PhotoData) => {
    setFeaturedPhoto(photo);
    controls.stop();
  };

  const handleDrag = () => {
    const currentX = x.get();
    const itemWidth = window.innerWidth < 640 ? 110 : 150;
    const totalWidth = basePhotos.length * itemWidth;
    if (currentX < -(totalWidth * 2)) x.set(currentX + totalWidth);
    else if (currentX > -totalWidth) x.set(currentX - totalWidth);
  };

  const handleFinishTyping = () => {
    setStage('bond');
    // Auto transition from bond message to choice button after 4 seconds
    setTimeout(() => {
      setStage('choice');
    }, 4000);
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-full flex flex-col items-center justify-between py-12 px-4"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-purple-900/10 pointer-events-none"></div>

            <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-xl h-[45vh]">
              <AnimatePresence mode="wait">
                {featuredPhoto && (
                  <motion.div
                    key={featuredPhoto.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-6">
                      <div className="absolute -inset-6 bg-pink-500/20 rounded-full blur-3xl opacity-60"></div>
                      <img 
                        src={featuredPhoto.url} 
                        alt="" 
                        className="max-h-[30vh] sm:max-h-[38vh] w-auto rounded-3xl border-2 border-white/20 shadow-[0_0_50px_rgba(255,0,127,0.3)] relative z-10"
                      />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 -right-4 z-20 text-pink-500 bg-black/60 backdrop-blur-md p-3 rounded-full border border-pink-500/40">
                        <Heart size={24} fill="currentColor" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-center px-6"
                    >
                      <p className="text-white text-2xl sm:text-3xl font-romantic leading-relaxed">
                        {featuredPhoto.caption}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-10 w-full overflow-hidden mb-6">
              <div className="flex items-center gap-3 mb-6 px-10">
                <div className="h-[1px] w-12 bg-white/20"></div>
                <span className="text-white/40 uppercase tracking-[0.6em] text-[10px] font-heading font-bold italic">Memory Flow</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
              </div>
              
              <div className="relative w-full cursor-grab active:cursor-grabbing">
                <motion.div
                  ref={carouselRef}
                  drag="x"
                  style={{ x }}
                  onDrag={handleDrag}
                  onDragStart={() => controls.stop()}
                  className="flex gap-4 sm:gap-6 px-6"
                >
                  {infinitePhotos.map((photo, i) => (
                    <motion.div
                      key={`farewell-inf-${photo.id}-${i}`}
                      whileHover={{ y: -10, scale: 1.05 }}
                      onClick={() => handleItemClick(photo)}
                      className={`w-[100px] sm:w-[130px] aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 relative
                        ${featuredPhoto?.id === photo.id ? 'border-pink-500 shadow-[0_0_20px_#ff007f]' : 'border-white/10'}`}
                    >
                      <img 
                        src={photo.url} 
                        alt="" 
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      {featuredPhoto?.id === photo.id && (
                        <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                          <CheckCircle2 className="text-pink-500" size={32} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px #a855f7" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage('typing')}
              className="z-30 px-12 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-purple-500 text-purple-400 font-heading tracking-[0.3em] flex items-center gap-4 group hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            >
              <PenTool size={22} className="group-hover:rotate-12 transition-transform" /> 
              DESCRIBE MESSAGE
            </motion.button>
          </motion.div>
        )}

        {stage === 'typing' && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-2xl p-6 flex flex-col items-center"
          >
            <div className="mb-10 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="mx-auto w-16 h-16 border-2 border-dashed border-pink-500 rounded-full flex items-center justify-center mb-6">
                <PenTool className="text-pink-500" size={24} />
              </motion.div>
              <h2 className="text-4xl font-romantic text-white mb-2">My Special Message</h2>
              <p className="text-white/40 font-heading text-[10px] uppercase tracking-[0.4em]">This is our friendship look like </p>
            </div>
            
            <div className="relative w-full">
              <textarea
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Writing my heart out..."
                className="w-full h-64 p-8 bg-zinc-900/50 border-2 border-white/10 rounded-[2.5rem] text-white font-romantic text-2xl focus:border-pink-500/50 outline-none transition-all placeholder:text-white/10 shadow-2xl backdrop-blur-xl resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 0, 127, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinishTyping}
              disabled={!typedMessage.trim()}
              className="mt-12 px-16 py-5 rounded-full border-2 border-pink-500 text-pink-500 font-bold tracking-[0.4em] flex items-center gap-4 disabled:opacity-20 transition-all uppercase text-sm"
            >
              FINISH <CheckCircle2 size={24} />
            </motion.button>
          </motion.div>
        )}

        {stage === 'bond' && (
          <motion.div
            key="bond"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 max-w-3xl"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 blur-3xl bg-pink-500/20 scale-150"></div>
              <Heart size={100} fill="#ff007f" className="text-pink-500 relative z-10 drop-shadow-[0_0_30px_#ff007f]" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-5xl sm:text-7xl font-romantic leading-tight text-pink-400">
                This is our friendship
              </h2>
              <h3 className="text-4xl sm:text-6xl font-romantic text-white/80">
                forever and always.
              </h3>
            </motion.div>
          </motion.div>
        )}

        {stage === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <Sparkles className="text-purple-400 mb-8 animate-pulse" size={48} />
            <h2 className="text-4xl sm:text-5xl font-romantic text-white mb-12 leading-relaxed">
              I have one last thing to show you...
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255, 0, 127, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage('final')}
              className="group relative px-12 py-6 rounded-3xl bg-pink-600/20 border-2 border-pink-500 text-pink-500 font-heading font-bold tracking-[0.2em] transition-all overflow-hidden"
            >
              SEE THE FINAL MESSAGE
            </motion.button>
          </motion.div>
        )}

        {stage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-y-auto"
          >
            <div className="fixed inset-0 bg-black"></div>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 max-w-2xl w-full p-10 sm:p-16 rounded-[3rem] bg-white/5 border border-pink-500/20 backdrop-blur-3xl flex flex-col items-center"
            >
              <h2 className="text-5xl sm:text-6xl font-romantic text-pink-400 mb-10 text-center">Always Beside You</h2>
              
              <div className="space-y-8 text-xl sm:text-2xl text-white/90 font-romantic leading-relaxed text-center">
                <div className="p-6 bg-pink-500/5 rounded-2xl italic border-l-4 border-pink-500/30">
                  <p className="mb-4">"{typedMessage}"</p>
                </div>
                
                <p className="opacity-80">Every laugh we've shared is a melody that plays forever in my heart.</p>
                
                <p className="text-pink-300 font-bold italic">Happy Birthday. You are truly special.</p>
              </div>

              <div className="mt-16 flex gap-8">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="text-pink-600">
                  <Heart size={40} fill="currentColor" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="text-purple-600">
                  <Heart size={30} fill="currentColor" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.5, delay: 1 }} className="text-pink-600">
                  <Heart size={40} fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setStage('gallery')}
              className="relative z-10 mt-12 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white/80 transition-all text-[10px] uppercase tracking-widest font-bold"
            >
              START OVER
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
